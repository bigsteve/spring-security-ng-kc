import { Injectable, NgZone } from '@angular/core';
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

    constructor( private zone_: NgZone, private http_: HttpClient) {
        this.headers = this.headers.set('Content-Type', 'application/octet-stream')
        .set('Access-Control-Allow-Origin', environment.accessConttrolAllowOrigin)
        .set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
        .set('Access-Control-Allow-Headers', 'X-Requested-With, content-type')
     }

     get http(): HttpClient {
         return this.http_
     }

     get zone(): NgZone {
         return this.zone_
     }

    getAccountDetails(user: User) {
        return this.http.post(environment.resourcesUrl + AppConstants.ACCOUNT_API_URL, user, { observe: 'response', withCredentials: true });
    }

    abstract getData(v: string)

}
