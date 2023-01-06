import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from "../constants/app.constants";
import { environment } from '../../environments/environment';
import { User } from '../model/user.model';
import { AuthorizedServiceInterface } from './authorized.service.interface';

@Injectable({
    providedIn: 'root'
})
export abstract class AuthorizedService implements AuthorizedServiceInterface {

    headers: HttpHeaders = new HttpHeaders()
    private http_: HttpClient

    constructor( http: HttpClient) {
        this.http_ = http
        this.headers.set('Content-Type', 'application/json; charset=utf-8')
        .set('Access-Control-Allow-Origin', 'https://auth.samplebank.com')
        .set('Access-Control-Allow-Origin', 'https://samplebank.com')
        .set('Access-Control-Allow-Origin', 'https://samplebank.com:8443')
     }

    get http(): HttpClient {
        return this.http_
    }

    getAccountDetails(user: User) {
        return this.http.post(environment.rooturl + AppConstants.ACCOUNT_API_URL, user, { observe: 'response', withCredentials: true });
    }

    abstract getData(v: string)

}
