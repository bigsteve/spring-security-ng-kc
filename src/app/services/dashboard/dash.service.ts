import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountTransactions } from 'src/app/model/account.transactions.model';
import { Page } from 'src/app/model/page.model';

@Injectable()
export class DashService {
    private readonly BACKEND_URL =
        'http://localhost:8080/myaccount/mybalance/page/1?';

    constructor(private http: HttpClient) { }

    getCompanies(params = '', observe = true): Observable<Page> {
        return this.http.post<Page>(`${this.BACKEND_URL}${params}`, {
            observe: observe ? 'response' : null,
        });
    }

    // getCompanies(params = '', observe = true): Observable<HttpResponse<Page>> {
    //     return this.http.post<HttpResponse<Page>>(`${this.BACKEND_URL}${params}`, {
    //         observe: observe ? 'response' : null,
    //     });
    // }

}
