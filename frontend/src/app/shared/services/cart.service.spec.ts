import { of } from "rxjs";
import { CartService } from "./cart.service";

describe('cart service', () => {

    let cartService: CartService;
    const countValue = 3;

    beforeEach(() => {
        const valueServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);
        valueServiceSpy.get.and.returnValue(of({ count: 3 }));

        cartService = new CartService(valueServiceSpy);
    })

    it('should emit new count value', (done: DoneFn) => {
        cartService.count$.subscribe((count) => {
            expect(count).toBe(countValue);
            done();
        })

        cartService.setCount(countValue);
    })
})