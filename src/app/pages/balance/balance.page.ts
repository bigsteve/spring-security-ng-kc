import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/model/user.model'
import { formatCurrency } from '@angular/common'
import { GridComponent } from 'src/app/components/grid/grid.component'
import { Seo } from 'src/app/model/seo/seo.model'

@Component({
    selector: 'app-balance',
    templateUrl: './balance.page.html',
    styleUrls: ['./balance.page.css']
})

export class BalancePage implements OnInit {

    user = new User()
    grid: GridComponent

    public seo = new Seo()

    constructor() {

        this.seo.title = "Transactions History"
    }

    ngOnInit(): void {
    }

    // changed from:
    // {{transaction.transactionType=='Withdrawal' ? (transaction.transactionAmt | currency) : ' '}}
    getTransactionType(v: any, t: string): any {
        let o = ''
        if (v.transactionType == t) o = formatCurrency(v.transactionAmt, 'en-US', '$')
        return o
    }

}
