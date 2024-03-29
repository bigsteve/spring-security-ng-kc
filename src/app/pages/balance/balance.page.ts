import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/model/user.model'
import { Seo } from 'src/app/model/seo/seo.model'
import { DashboardService } from 'src/app/services/dashboard/dashboard.service'
import { Column } from 'src/app/model/crud/column.model'

@Component({
    selector: 'app-balance',
    templateUrl: './balance.page.html',
    styleUrls: ['./balance.page.scss']
})

export class BalancePage implements OnInit {

    user = new User()
    columns: Column[]
    public seo = new Seo()
    public crudConfig = {
        crudName: 'balance_crud',
        crudEnabled: true,
        exportEnabled: true,
        globalSearchEnabled: false,
        searchEnabled: true,
        orderEnabled: true,
        configEnabled: true,
        massActionsEnabled: false,
        uid: "transactionId"
    }


    public crudConfig2 = {
        crudName: 'balance_crud2',
        crudEnabled: true,
        exportEnabled: true,
        globalSearchEnabled: false,
        configEnabled: true,
        massActionsEnabled: false,
        uid: "transactionId"
    }
    public exportFileName: string

    constructor(private readonly componentService: DashboardService) {
        this.componentService = componentService
        this.seo.title = "Transactions History"
        this.seo.subtitle = "Transactions History"
    }

    public getBalanceService(): DashboardService {
        return this.componentService
    }

    ngOnInit(): void {

        this.columns = [
            new Column({ key: 'accountNumber', title: 'Account Number', sensitiveData: true }),
            new Column({ key: 'transactionId', title: 'Transaction Id', placeholder: 'Transaction Id' }),
            new Column({ key: 'transactionType', title: 'Transaction Type', placeholder: 'Transaction Type' }),
            new Column({ key: 'closingBalance', title: 'Closing Balance', placeholder: 'Balance Bigger', cellTemplate: "pipeCurrency" }),
            new Column({ key: 'createDt', title: 'Date', placeholder: 'Date', cellTemplate: "pipeDateShort" }),
            new Column({ key: 'status', title: 'Status', placeholder: 'Status' }),
            new Column({ key: 'transactionAmt', title: 'Amount', cellTemplate: "pipeCurrency" }),
            new Column({ key: 'transactionSummary', title: 'Summary', placeHolder: 'Summary' }),
            new Column({ key: 'gridActionsCell', title: 'Actions', searchEnabled: false, orderEnabled: false, cellTemplate: "rowActions" })
        ]
    }


}
