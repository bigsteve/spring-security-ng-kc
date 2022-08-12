import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    kcs: any;

    constructor(kcs: KeycloakService) {
        this.kcs = kcs
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {


        if (!this.kcs._instance.authenticated) {
            this.kcs.login({ redirectUri: window.location.href })
        }

        return next.handle(request).pipe(map((event: HttpEvent<any>) => {
            return event
        }))
    }

    public async isLoggedIn() {
        return await this.kcs.isLoggedIn();
    }


}



// import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
// import {Injectable} from '@angular/core';
// import {Observable} from 'rxjs';
// import {map} from 'rxjs/operators';

// @Injectable()
// export class ResponseInterceptor implements HttpInterceptor {

//     intercept(req: HttpRequest, next: HttpHandler): Observable<HttpEvent<any>> {

//         return next.handle(req).pipe(map((event: HttpEvent<any>) => {
//             if (event instanceof HttpResponse) {
//                 event = event.clone({body: this.modifyBody(event.body)});
//             }
//             return event;
//         }));

//     }

//     private modifyBody(body: any) {
//         /*
//         * write your logic to modify the body
//         * */
//     }
// }
