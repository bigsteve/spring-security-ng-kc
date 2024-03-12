import { Component} from '@angular/core';
import { FormComponent } from '../form/form.component';
import { GridmasterComponent } from '../../grid/gridmaster.component';

@Component({
    selector: 'app-crud',
    templateUrl: './../../grid/grid.component.html',
    styleUrls: ['./../../grid/grid.component.scss']
})
export class CrudComponent extends GridmasterComponent {

    public openDialog(v: any) {
        this.dialog.open(FormComponent, {
            width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%',
            data: this.page.data[v.params.row],
            disableClose: true
        });
    }

    ngOnInit(){
        super.ngOnInit()
    }
}

