import { LoaderService } from "./loader.service";

describe('loader service', () => {

    let loaderService: LoaderService;

    beforeEach(() => {
        loaderService = new LoaderService();
    })

    it('should emit true value for showing loader', (done: DoneFn) => {
        loaderService.isShowed$.subscribe((value: boolean) => {
            expect(value).toBe(true);
            done();
        })

        loaderService.show();
    })

    it('should emit true value for hiding loader', (done: DoneFn) => {
        loaderService.isShowed$.subscribe((value: boolean) => {
            expect(value).toBe(false);
            done();
        })

        loaderService.hide();
    })
})