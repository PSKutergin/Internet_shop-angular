import { OrderStatusType } from "src/app/types/order-status.type";
import { OrderStatusUtil } from "./order-status";

describe('order status util', () => {

    it('should return name and color with no status', () => {
        const result = OrderStatusUtil.getStatusAndColor(null);

        expect(result.name).not.toBe("");
        expect(result.color).not.toBe("");
    })

    it('should return new order status with wrong status', () => {
        const result = OrderStatusUtil.getStatusAndColor('test' as OrderStatusType);

        expect(result.name).toBe("Новый");
        expect(result.color).toBe("#456f49");
    })
})