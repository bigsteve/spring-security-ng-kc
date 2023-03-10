import { Component, Inject, Input, OnInit } from '@angular/core';
import { Seo } from 'src/app/model/seo/seo.model';
import { GridComponent } from '../../grid/grid.component';
import { FormComponent } from '../form/form.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-crud',
    templateUrl: './crud.component.html',
    styleUrls: ['./crud.component.scss']
})
export class CrudComponent extends GridComponent implements OnInit {

    @Inject(MatDialog) public dialog: MatDialog

    openDialog() {
        this.dialog.open(FormComponent, {
          data: {
            animal: 'panda',
          },
        });
      }
    ngOnInit(): void {
    }

}
