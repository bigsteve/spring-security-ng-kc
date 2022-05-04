import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { DashboardService } from '../../services/dashboard/dashboard.service';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  user = new User();
  cards = new Array();
  currOutstandingAmt:Number = 0;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('userdetails'));
    if(this.user){
      this.dashboardService.getCardsDetails(this.user).subscribe(
        responseData => {
        this.cards = <any> responseData.body;
        this.cards.forEach(function (card) {
          this.currOutstandingAmt = this.currOutstandingAmt+card.availableAmount;
        }.bind(this)); 
        }, error => {
          console.log(error);
        });
    }
  }

}
