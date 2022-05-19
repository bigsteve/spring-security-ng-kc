import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/model/user.model'
import { DashboardService } from '../../services/dashboard/dashboard.service'
import { ActivatedRoute } from '@angular/router'
import { formatCurrency } from '@angular/common'

@Component({
    selector: 'app-balance',
    templateUrl: './balance.page.html',
    styleUrls: ['./balance.page.css']
})

export class BalancePage implements OnInit {

    user = new User()
    page: number
    prev: number
    next: number
    transactions = new Array()

    constructor(private dashboardService: DashboardService, private route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            this.page = parseInt(params.page) ? params.page : 1
            this.navigateTo(this.page)
            this.pagination()
        })
    }

    ngOnInit(): void {
        this.navigateTo(this.page)
    }

    navigateTo(toPage: number): void {
        this.user = JSON.parse(sessionStorage.getItem('userdetails'))

        if (this.user) {
            this.dashboardService.getAccountTransactions(this.user, toPage).subscribe(
                responseData => {
                    this.transactions = <any>responseData.body
                    console.log(this.transactions)
                }, error => {
                    console.log(error)
                })
        }
    }

    pagination(): void {
        this.prev = (this.page > 1) ? this.page - 1 : 1
        this.next = +this.page + 1
    }

    // changed from:
    // {{transaction.transactionType=='Withdrawal' ? (transaction.transactionAmt | currency) : ' '}}
    getTransactionType(v: any, t: string): any {
        let o = ''
        if(v.transactionType==t) o = formatCurrency(v.transactionAmt, 'en-US', '$')
        return o
    }

}
