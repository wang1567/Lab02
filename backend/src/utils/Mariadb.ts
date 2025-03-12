import * as mariadb from "mariadb";
import { Pool, PoolConnection } from "mariadb";
import { logger } from "../middlewares/log";

export class Mariadb {
    private static instance: Mariadb; // 單例模式
    private pool: Pool; // 連接池
    private connection: PoolConnection | null = null; // 當前連接

    private constructor() {
        // 初始化連接池
        this.pool = mariadb.createPool({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            port: Number(process.env.DBPORT),
            database: process.env.DBNAME, // 新增資料庫名稱
            connectionLimit: 5,
        });

        this.init().catch((error) => {
            logger.error("Failed to initialize database connection:", error);
        });
    }

    /**
     * 獲取單例實例
     */
    public static getInstance(): Mariadb {
        if (!Mariadb.instance) {
            Mariadb.instance = new Mariadb();
        }
        return Mariadb.instance;
    }

    /**
     * 初始化連接
     */
    private async init(): Promise<void> {
        try {
            this.connection = await this.pool.getConnection();
            logger.info(`Connected to database: jdbc:mariadb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`);
        } catch (error) {
            logger.error("Failed to connect to database:", error);
            throw error; // 拋出錯誤，讓上層處理
        }
    }

    /**
     * 執行 SQL 查詢
     * @param sql SQL 語句
     * @param params 查詢參數
     * @returns 查詢結果
     */
    public async query<T>(sql: string, params?: any[]): Promise<T> {
        let conn: PoolConnection | null = null;
        try {
            conn = await this.pool.getConnection(); // 從連接池獲取連接
            const result = await conn.query(sql, params); // 執行查詢
            return result as T;
        } catch (error) {
            logger.error("Failed to execute query:", error);
            throw error; // 拋出錯誤，讓上層處理
        } finally {
            if (conn) {
                conn.release(); // 釋放連接
            }
        }
    }

    /**
     * 關閉連接池
     */
    public async close(): Promise<void> {
        try {
            await this.pool.end();
            logger.info("Database connection pool closed.");
        } catch (error) {
            logger.error("Failed to close connection pool:", error);
            throw error;
        }
    }
}