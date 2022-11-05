import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  user = new User();

  constructor() {
    
  }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('userdetails'));
  }

}
