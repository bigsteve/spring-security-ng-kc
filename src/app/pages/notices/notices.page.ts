import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
    selector: 'app-notices',
    templateUrl: './notices.page.html',
    styleUrls: ['./notices.page.scss']
})
export class NoticesPage implements OnInit {

    notices = new Array();

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getNoticeDetails().subscribe(
            {
                next: (responseData) => {
                    this.notices = <any>responseData.body;
                    this.notices.forEach(function (card: { availableAmount: any; }) {
                        this.currOutstandingAmt = this.currOutstandingAmt + card.availableAmount;
                    }.bind(this))
                }, error: (error) => {
                    console.log(error)
                },
                complete: null
            })
    }
}

/**
 * 
 * 
 * add edit action button
 * add record delete button and confirmation dialog
 * add add/edit form with validation messages and auto populate functionality
 * 
 * 
 * 
 */