import { Injectable } from '@angular/core';
import { AppConstants } from "../../constants/app.constants";
import { environment } from '../../../environments/environment';
import { User } from '../../model/user.model';
import { Contact } from '../../model/contact.model';
import { DataPage } from '../../model/data.page.model'
import { AuthorizedService } from '../authorized.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends AuthorizedService {

    getData(params: string) {
        return this.http.post<DataPage>(environment.rooturl + AppConstants.BALANCE_API_URL + params, null, { observe: 'response', withCredentials: true });
    }

    getLoansDetails(user: User) {
        return this.http.post(environment.rooturl + AppConstants.LOANS_API_URL, user, { observe: 'response', withCredentials: true });
    }

    getCardsDetails(user: User) {
        return this.http.post(environment.rooturl + AppConstants.CARDS_API_URL, user, { observe: 'response', withCredentials: true });
    }

    getNoticeDetails() {
        return this.http.get(environment.rooturl + AppConstants.NOTICES_API_URL, { observe: 'response' });
    }

    saveMessage(contact: Contact) {
        return this.http.post(environment.rooturl + AppConstants.CONTACT_API_URL, contact, { observe: 'response' });
    }

}
