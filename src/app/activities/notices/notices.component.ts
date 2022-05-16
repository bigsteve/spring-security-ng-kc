import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.css']
})
export class NoticesComponent implements OnInit {

  notices = new Array();

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.dashboardService.getNoticeDetails().subscribe(
      responseData => {
      this.notices = <any> responseData.body;
      this.notices.forEach(function (card) {
        this.currOutstandingAmt = this.currOutstandingAmt+card.availableAmount;
      }.bind(this)); 
      }, error => {
        console.log(error);
      });
  }

}
