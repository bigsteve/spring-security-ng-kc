import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Seo } from 'src/app/model/seo/seo.model';

@Component({
  selector: 'app-crud-dialog',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class FormComponent implements OnInit {

    @Input() crudConfig: any
    @Input() seo: Seo
    @Input() service: any
    @Input() columns: any
    @Input() matDialogClose: boolean
    
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        console.log(data)
    }

    ngOnInit(): void {
    }
}

  
