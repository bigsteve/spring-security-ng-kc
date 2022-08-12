import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {

    isLoading = new BehaviorSubject<boolean>(false)
    countSubjects = 0

    constructor() {
    }

    show() {
        this.countSubjects++
        this.isLoading.next(true)
    }

    hide() {
        if(this.countSubjects > 0) this.countSubjects--
        if(this.countSubjects == 0) this.isLoading.next(false)
    }
}
