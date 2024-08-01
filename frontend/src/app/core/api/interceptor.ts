import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DefaultResponseType } from "src/app/types/default-response.type";
import { LoginResponseType } from "src/app/types/login-response.type";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const tokens = this.authService.getTokens();
        if (tokens && tokens.accessToken) {
            const authReq = req.clone({
                headers: req.headers.set('x-access-token', tokens.accessToken)
            });
            return next.handle(authReq)
                .pipe(
                    catchError((error) => {
                        if (error.status === 401 && !authReq.url.includes('/login') && !authReq.url.includes('/refresh')) {
                            return this.handle401Error(authReq, next);
                        }
                        return throwError(() => error);
                    })
                )
        }
        return next.handle(req);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        return this.authService.refresh()
            .pipe(
                switchMap((result: DefaultResponseType | LoginResponseType) => {
                    let error = '';
                    if ((result as DefaultResponseType).error !== undefined) {
                        error = (result as DefaultResponseType).message;
                    }

                    const refreshResult = result as LoginResponseType;
                    if (!refreshResult.accessToken || !refreshResult.refreshToken) {
                        error = 'Не удалось обновить токен';
                    }

                    if (error) {
                        return throwError(() => new Error(error));
                    }

                    this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);
                    return next.handle(req.clone({
                        headers: req.headers.set('x-access-token', refreshResult.accessToken)
                    }));
                }),
                catchError((error) => {
                    this.authService.removeTokens();
                    this.router.navigate(['/']);
                    return throwError(() => error);
                })
            )
    }
}