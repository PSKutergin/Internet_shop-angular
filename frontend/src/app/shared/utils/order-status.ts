import { OrderStatusType } from "src/app/types/order-status.type";

export class OrderStatusUtil {
    static getStatusAndColor(status: OrderStatusType | undefined | null): { name: string, color: string } {
        switch (status) {
            case OrderStatusType.new: {
                return { name: 'Новый', color: '#456f49' };
            }
            case OrderStatusType.delivery: {
                return { name: 'Доставка', color: '#456f49' };
            }
            case OrderStatusType.cancelled: {
                return { name: 'Отменён', color: '#ff7575' };
            }
            case OrderStatusType.success: {
                return { name: 'Выполнен', color: '#b6d5b9' };
            }
            case OrderStatusType.pending: {
                return { name: 'Обработка', color: '#456f49' };
            }
            default: {
                return { name: 'Новый', color: '#456f49' };
            }
        }
    }
}