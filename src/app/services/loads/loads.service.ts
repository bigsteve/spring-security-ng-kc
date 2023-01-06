import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from "../../constants/app.constants";
import { environment } from '../../../environments/environment';
import { User } from '../../model/user.model';
import { Contact } from '../../model/contact.model';
import { DataPage } from '../../model/data.page.model'
import { AuthorizedService } from '../authorized.service';

@Injectable({
    providedIn: 'root'
})
export class LoadsService extends AuthorizedService{
    
    getData(params: string) {
        return this.http.post<DataPage>(environment.rooturl + AppConstants.LOADS_API_URL + params, null, { observe: 'response', withCredentials: true });
    }

}
