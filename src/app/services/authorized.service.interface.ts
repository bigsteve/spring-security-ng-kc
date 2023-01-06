import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../model/user.model';

export interface AuthorizedServiceInterface {

    getAccountDetails(user: User): any
    getData(v: string): any

}
