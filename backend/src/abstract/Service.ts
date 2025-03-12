export abstract class Service {
    // 定義通用的服務方法
    abstract getAvailability(date: string): Promise<any>;
    abstract createReservation(reservation: any): Promise<void>;
  }