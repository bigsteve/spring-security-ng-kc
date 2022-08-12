import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/model/user.model'
import { Seo } from 'src/app/model/seo/seo.model'
import { DashboardService } from 'src/app/services/dashboard/dashboard.service'
import { Column } from 'src/app/model/crud/column.model'

@Component({
    selector: 'app-balance',
    templateUrl: './balance.page.html',
    styleUrls: ['./balance.page.css']
})

export class BalancePage implements OnInit {

    user = new User()
    columns: Column[]
    public seo = new Seo()
    public crudConfig = {
        crudEnabled: true,
        exportEnabled: true,
        globalSearchEnabled: false,
        configEnabled: true,
        massActionsEnabled: false,
        uid: "transactionId"
    }
    public exportFileName: string

    constructor(private readonly balanceService: DashboardService) {
        this.balanceService = balanceService
        this.seo.title = "Transactions History"
    }

    public getBalanceService(): DashboardService {
        return this.balanceService
    }

    ngOnInit(): void {

        this.columns = [
            new Column({ key: 'accountNumber', title: 'Account Number'}),
            new Column({ key: 'transactionId', title: 'Transaction Id', placeholder: 'Transaction Id' }),
            new Column({ key: 'transactionType', title: 'Transaction Type', placeholder: 'Transaction Type' }),
            new Column({ key: 'closingBalance', title: 'Closing Balance', placeholder: 'Balance Bigger', cellTemplate: "pipeCurrency" }),
            new Column({ key: 'createDt', title: 'Date', placeholder: 'Date', cellTemplate: "pipeDateShort" }),
            new Column({ key: 'status', title: 'Status', placeholder: 'Status' }),
            new Column({ key: 'transactionAmt', title: 'Amount', placeholder: 'Amount Bigger', cellTemplate: "pipeCurrency" }),
            new Column({ key: 'transactionSummary', title: 'Summary' }),
            new Column({ key: 'gridActionsCell', title: 'Actions', searchEnabled: false, orderEnabled: false, cellTemplate: "rowActions" })
        ]
    }

}
