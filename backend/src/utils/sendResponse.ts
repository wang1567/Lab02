import { Response } from 'express';
import { resp } from './resp'; // 引入 resp 接口

/**
 * 統一返回 API 響應
 * @param res Express 的 Response 物件
 * @param status HTTP 狀態碼 (例如 200, 400, 500)
 * @param code 自定義狀態碼 (例如 "SUCCESS", "INVALID_INPUT")
 * @param message 響應訊息 (例如 "Success", "Invalid input")
 * @param body 響應資料 (泛型)
 */
export const sendResponse = <E>(res: Response, status: number, code: string, message: string, body: E) => {
    const response: resp<E> = {
        code,
        message,
        body
    };
    res.status(status).json(response);
};