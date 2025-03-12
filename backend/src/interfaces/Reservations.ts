export interface Reservation {
    reservation_id: number;   // 預約編號 (INT，自動遞增，由資料庫生成)
    student_id: string;       // 學生編號 (外鍵，對應 Students.student_id)
    seat_id: number;          // 座位編號 (外鍵，對應 Seats.seat_id)
    timeslot_id: number;      // 時段編號 (外鍵，對應 Timeslots.timeslot_id)
    reservation_date: string; // 新增！預約日期 (DATE 格式: 'YYYY-MM-DD')
    create_time?: string;     // 創建時間 (DATETIME，資料庫自動生成，可選)
}