export interface Reservation {
    reservation_id: number;
    student_id: string;
    seat_id: number;
    timeslot_id: number;
    reservation_date: string;
    create_time?: string;
  }
  
  export interface ReservationAvailability {
    timeslot_id: number;
    start_time: string;
    end_time: string;
    seat_id: number;
    row_label: string;
    seat_number: number;
    status: 'available' | 'booked';
  }