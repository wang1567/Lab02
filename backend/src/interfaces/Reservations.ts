export interface Reservation {
    reservation_id: number;
    student_id: string;
    seat_id: number;
    timeslot_id: number;
    reservation_date: string;
    create_time?: string;
  }
  
