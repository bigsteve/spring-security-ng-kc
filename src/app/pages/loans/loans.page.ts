import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
    selector: 'app-loans',
    templateUrl: './loans.page.html',
    styleUrls: ['./loans.page.scss']
})
export class LoansPage implements OnInit {

    user = new User();
    loans = new Array();
    currOutstandingBalance: Number = 0;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.user = JSON.parse(sessionStorage.getItem('userdetails'));
        if (this.user) {
            this.dashboardService.getLoansDetails(this.user).subscribe({
                next: responseData => {
                    this.loans = <any>responseData.body;
                    this.loans.forEach(function (loan) {
                        this.currOutstandingBalance = this.currOutstandingBalance + loan.outstandingAmount;
                    }.bind(this));
                },
                error: error => {
                    console.error(error);
                },
                complete: () => console.info('complete')
            });
        }
    }



}
