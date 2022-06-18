import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/model/user.model'
import { DashboardService } from '../../services/dashboard/dashboard.service'
import { ActivatedRoute } from '@angular/router'
import { formatCurrency } from '@angular/common'
import { GridComponent } from 'src/app/components/grid/grid.component'

@Component({
    selector: 'app-balance',
    templateUrl: './balance.page.html',
    styleUrls: ['./balance.page.css']
})

export class BalancePage implements OnInit {

    user = new User()
    grid : GridComponent
    page: number
    prev: number
    next: number
    transactions = new Array()

    // constructor(private dashboardService: DashboardService, private route: ActivatedRoute) {
    //     this.route.params.subscribe(params => {
    //     })
    // }

    ngOnInit(): void {
    }

    // changed from:
    // {{transaction.transactionType=='Withdrawal' ? (transaction.transactionAmt | currency) : ' '}}
    getTransactionType(v: any, t: string): any {
        let o = ''
        if(v.transactionType==t) o = formatCurrency(v.transactionAmt, 'en-US', '$')
        return o
    }

}
