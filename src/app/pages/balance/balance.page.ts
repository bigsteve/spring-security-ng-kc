import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/model/user.model'
import { Seo } from 'src/app/model/seo/seo.model'
import { DashboardService } from 'src/app/services/dashboard/dashboard.service'

@Component({
    selector: 'app-balance',
    templateUrl: './balance.page.html',
    styleUrls: ['./balance.page.css']
})

export class BalancePage implements OnInit {

    user = new User()
    columns: {}[]
    public seo = new Seo()

    constructor(private readonly balanceService: DashboardService) {
        this.balanceService = balanceService
        this.seo.title = "Transactions History"
    }

    public getBalanceService(): DashboardService {
        return this.balanceService
    }

    ngOnInit(): void {

        this.columns = [
            { key: 'accountNumber', title: 'Account Number' },
            { key: 'transactionId', title: 'Transaction Id', placeholder: 'Transaction Id' },
            { key: 'transactionType', title: 'Transaction Type', placeholder: 'Transaction Type' },
            { key: 'closingBalance', title: 'Closing Balance', placeholder: 'Balance Bigger', cellTemplate: "pipeCurrency" },
            { key: 'createDt', title: 'Date', placeholder: 'Date', cellTemplate: "pipeDateShort" },
            { key: 'status', title: 'Status', placeholder: 'Status' },
            { key: 'transactionAmt', title: 'Amount', placeholder: 'Amount Bigger', cellTemplate: "pipeCurrency" },
            { key: 'transactionSummary', title: 'Summary' },
            { key: 'gridActionsCell', title: 'Actions', searchEnabled: false, orderEnabled: false, cellTemplate: "rowActions" }
        ]
    }

}
