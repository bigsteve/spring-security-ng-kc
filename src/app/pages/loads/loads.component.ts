import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/model/user.model'
import { Seo } from 'src/app/model/seo/seo.model'
import { Column } from 'src/app/model/crud/column.model'
import { LoadsService } from 'src/app/services/loads/loads.service'

@Component({
    selector: 'loads-component',
    templateUrl: './loads.component.html',
    styleUrls: ['./loads.component.scss']
})

export class LoadsComponent implements OnInit {

    user = new User()
    columns: Column[]
    public seo = new Seo()
    public crudConfig = {
        crudName: 'loads_crud',
        crudEnabled: true,
        exportEnabled: true,
        globalSearchEnabled: false,
        configEnabled: true,
        massActionsEnabled: false,
        uid: "id"
    }

    public exportFileName: string

    constructor(private readonly componentService: LoadsService) {
        this.componentService = componentService
        this.seo.title = "Loads"
        this.seo.subtitle = "The Loads Subtitle"
    }

    public getLoadService(): LoadsService {
        return this.componentService
    }

    ngOnInit(): void {

        let contact = [
            new Column({ key: 'id', title: 'Person Id', placeholder: 'Person Id' }),
            new Column({ key: 'fname', title: 'First Name', placeholder: 'First Name' }),
            new Column({ key: 'createdAt', title: 'Created At', placeholder: 'Created At', cellTemplate: "pipeDateShort" })
        ]


        this.columns = [
            new Column({ key: 'id', title: 'Load Id', placeholder: 'Load Id' }),
            new Column({ key: 'createdAt', title: 'Created At', placeholder: 'Created At', cellTemplate: "pipeDateShort" }),
            // new Column({ key: 'status', title: 'Status', placeholder: 'Status' }),
            new Column({ key: "contact.fname", data: contact, title: 'First Name', placeholder: 'First Name', activeEnabled: false }),
            new Column({ key: "contact.lname", data: contact, title: 'Last Name', placeholder: 'Last Name', activeEnabled: false }),
            new Column({ key: 'contact.createdAt', title: 'Created At', placeholder: 'Created At', cellTemplate: "pipeDateShort" }),
            new Column({ key: 'weight', title: 'Weight', placeholder: 'Weight' }),
            new Column({ key: 'load', title: 'Load', placeHolder: 'Load' }),
            new Column({ key: 'companyName', title: 'Company Name', placeHolder: 'Company Name' }),
            new Column({ key: 'gridActionsCell', title: 'Actions', searchEnabled: false, orderEnabled: false, cellTemplate: "rowActions" })
        ]
    }


}
