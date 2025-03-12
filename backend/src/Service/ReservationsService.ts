import { Pool } from 'mariadb';
import { Reservation, ReservationAvailability } from '../interfaces/Reservations';
import { getDB } from '../utils/Mariadb';

export class ReservationsService {
  private pool: Pool;

  constructor() {
    this.pool = getDB(); // 從 utils/Mariadb.ts 取得連線池
  }

  // 查詢某天空位狀態
  async getAvailability(date: string): Promise<ReservationAvailability[]> {
    const conn = await this.pool.getConnection();
    try {
      const query = `
        SELECT t.timeslot_id, t.start_time, t.end_time, 
               s.seat_id, s.row_label, s.seat_number,
               IF(r.reservation_id IS NULL, 'available', 'booked') AS status
        FROM Timeslots t
        CROSS JOIN Seats s
        LEFT JOIN Reservations r 
          ON r.timeslot_id = t.timeslot_id 
          AND r.seat_id = s.seat_id 
          AND r.reservation_date = ?
        ORDER BY t.timeslot_id, s.seat_id`;
      return await conn.query(query, [date]);
    } finally {
      conn.release();
    }
  }

  // 新增預約
  async createReservation(reservation: Omit<Reservation, 'reservation_id' | 'create_time'>): Promise<void> {
    const conn = await this.pool.getConnection();
    try {
      const query = `
        INSERT INTO Reservations 
          (student_id, seat_id, timeslot_id, reservation_date)
        VALUES (?, ?, ?, ?)`;
      await conn.query(query, [
        reservation.student_id,
        reservation.seat_id,
        reservation.timeslot_id,
        reservation.reservation_date
      ]);
    } finally {
      conn.release();
    }
  }
}