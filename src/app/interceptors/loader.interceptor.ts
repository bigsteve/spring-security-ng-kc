import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {


    constructor(private loaderService: LoaderService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        
        let showLoader = true
        if(request.urlWithParams.includes('export')) showLoader = false

        if(showLoader) this.loaderService.show();

        return next.handle(request).pipe(
            
            finalize(() => {
                if(showLoader) this.loaderService.hide()
            })
        )
    }
}
