import { of } from "rxjs";
import { CartService } from "./cart.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

describe('cart service', () => {

    let cartService: CartService;
    let valueServiceSpy: jasmine.SpyObj<HttpClient>;
    const countValue = 3;

    beforeEach(() => {
        valueServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);
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

    it('should make http request for cart data', (done: DoneFn) => {
        cartService.getCart().subscribe(() => {
            expect(valueServiceSpy.get).toHaveBeenCalledOnceWith(environment.api + 'cart', { withCredentials: true });
            done();
        })
    })
})