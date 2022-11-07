import { Component, OnInit } from '@angular/core';
import { faHome, faUsers, faHandshake, faCar, faStethoscope, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  
    faUsers = faUsers
    faHandshake = faHandshake
    faCar = faCar
    faHome = faHome
    faStethoscope = faStethoscope
    faGraduationCap = faGraduationCap

  constructor() {

   }

  ngOnInit(): void {

  }

}
