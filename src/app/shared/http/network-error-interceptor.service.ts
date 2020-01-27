import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Injectable()
export class NetworkErrorInterceptorService implements HttpInterceptor {

    snackBarRef: MatSnackBarRef<SimpleSnackBar>;

    constructor(private injector: Injector) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const snackBar = this.injector.get(MatSnackBar);


        return next.handle(req)
            .do((ev: HttpEvent<any>) => {
                if (ev instanceof HttpResponse && this.snackBarRef) {
                    this.snackBarRef.dismiss();
                    this.snackBarRef = null;
                }
            })
            .catch((response: any) => {
                if (response instanceof HttpErrorResponse &&
                    (response.status === 0 || response.status === 503) &&
                    !this.snackBarRef
                ) {
                    this.snackBarRef = snackBar.open('Le serveur est temporairement indisponible.');
                }

                return Observable.throw(response);
            });
    }

}