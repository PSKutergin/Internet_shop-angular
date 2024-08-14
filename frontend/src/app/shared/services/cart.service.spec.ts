import { of } from "rxjs";
import { CartService } from "./cart.service";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { TestBed } from "@angular/core/testing";

describe('cart service', () => {

    let cartService: CartService;
    let httpServiceSpy: jasmine.SpyObj<HttpClient>;
    const countValue = 3;

    beforeEach(() => {
        httpServiceSpy = jasmine.createSpyObj('HttpClient', ['get']);
        httpServiceSpy.get.and.returnValue(of({ count: 3 }));

        TestBed.configureTestingModule({
            providers: [
                CartService,
                { provide: HttpClient, useValue: httpServiceSpy }
            ]
        })

        cartService = TestBed.inject(CartService);
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
            expect(httpServiceSpy.get).toHaveBeenCalledOnceWith(environment.api + 'cart', { withCredentials: true });
            done();
        })
    })
})