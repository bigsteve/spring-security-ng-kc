import { Component, OnInit } from '@angular/core'
import { User } from 'src/app/model/user.model'
import { DashboardService } from '../../services/dashboard/dashboard.service'
import { ActivatedRoute } from '@angular/router'

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
            this.page = parseInt(params.page)
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
                }, error => {
                    console.log(error)
                })
        }
    }

    pagination(): void {
        this.prev = (this.page > 0) ? this.page - 1 : 0
        this.next = this.page + 1
    }


}
