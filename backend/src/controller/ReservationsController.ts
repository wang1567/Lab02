import { Contorller } from "../abstract/Contorller";
import { Request, Response } from "express";
import { logger } from "../middlewares/log";
import { ReservationsService } from "../Service/ReservationsService";
import { DB } from "../app";
import { sendResponse } from "../utils/sendResponse";
import { Reservation } from "../interfaces/Reservations";

require('dotenv').config();

export class ReservationsController extends Contorller {
    protected service: ReservationsService; // 明確指定類型

    constructor() {
        super();
        this.service = new ReservationsService(); // 初始化 ReservationsService
    }

    /**
     * 測試用：查詢所有預約紀錄
     */
    public async test(req: Request, res: Response) {
        try {
            await DB.connection?.query("USE lab_b310;");
            const resp = await DB.connection?.query("SELECT * FROM Reservations;");
            sendResponse(res, 200, "SUCCESS", "查詢成功", resp);
        } catch (error) {
            logger.error("Test failed:", error);
            sendResponse(res, 500, "INTERNAL_ERROR", "內部伺服器錯誤", null);
        }
    }

    /**
     * 查詢某天的座位預約狀態
     */
    public async getAvailability(req: Request, res: Response) {
        try {
            const date = req.params.date; // 從 URL 參數獲取日期
            const availability = await this.service.getAvailability(date); // 調用 ReservationsService 的方法
            sendResponse(res, 200, "SUCCESS", "查詢成功", availability);
        } catch (error) {
            logger.error("Failed to get availability:", error);
            sendResponse(res, 500, "INTERNAL_ERROR", "內部伺服器錯誤", null);
        }
    }

    /**
     * 新增預約
     */
    public async createReservation(req: Request, res: Response) {
        try {
            const reservation: Omit<Reservation, 'reservation_id' | 'create_time'> = req.body;
            await this.service.createReservation(reservation); // 調用 ReservationsService 的方法
            sendResponse(res, 201, "SUCCESS", "預約成功", null);
        } catch (error) {
            logger.error("Failed to create reservation:", error);

            // 根據錯誤類型返回適當的響應
            if (error instanceof Error && error.message.includes("Duplicate entry")) {
                sendResponse(res, 409, "CONFLICT", "此座位在該時段已被預約", null);
            } else if (error instanceof Error && error.message.includes("foreign key constraint")) {
                sendResponse(res, 400, "INVALID_INPUT", "無效的學生編號、座位編號或時段編號", null);
            } else {
                sendResponse(res, 500, "INTERNAL_ERROR", "內部伺服器錯誤", null);
            }
        }
    }
}