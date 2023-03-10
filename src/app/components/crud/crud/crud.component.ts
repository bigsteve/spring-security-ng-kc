import { Component, Input, OnInit } from '@angular/core';
import { Seo } from 'src/app/model/seo/seo.model';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {

    @Input() crudConfig: any
    @Input() seo: Seo
    @Input() service: any
    @Input() columns: any
    
  constructor() { }

  ngOnInit(): void {
  }

}
