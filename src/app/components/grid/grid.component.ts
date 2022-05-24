// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { take } from 'rxjs/operators';
// import { DashboardService } from '../../services/dashboard/dashboard.service';
// import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
// import { ActivatedRoute } from '@angular/router';
// import { formatCurrency } from '@angular/common';
// import { User } from 'src/app/model/user.model';
// import { Page } from 'src/app/model/page.model';


// @Component({
//     selector: 'app-grid',
//     templateUrl: './grid.component.html',
//     styleUrls: ['./grid.component.css']
// })


// export class GridComponent implements OnInit {

//     public configuration: Config;
//     public columns: Columns[];

//     user: User
//     page: number
//     prev: number
//     next: number
//     data = new Array()

//     constructor(private dashboardService: DashboardService, private route: ActivatedRoute) {
//         this.route.params.subscribe(params => {
//             this.page = parseInt(params.page) ? params.page : 1
//             this.navigateTo(this.page)
//             this.pagination()
//         })
//     }


//     ngOnInit(): void {

//         this.navigateTo(this.page)

//         this.configuration = { ...DefaultConfig };
//         this.configuration.searchEnabled = true;
//         this.configuration.serverPagination = false;
//         // this.configuration.draggable = true;
//         console.log(this.configuration)
//         // ... etc.
//         this.columns = [
//           { key: 'accountNumber', title: 'Account Number' },
//           { key: 'closingBalance', title: 'Closing Balance' },
//           { key: 'createDt', title: 'Date' },
//           { key: 'transactionAmt', title: 'Amount' },
//           { key: 'transactionSummary', title: 'Summary' }
//         ];


//         this.data.forEach(el => {
//             formatCurrency(el.transactionAmt, 'en-US', '$')
//         })
//     }

//     navigateTo(toPage: number): void {
//         this.user = JSON.parse(sessionStorage.getItem('userdetails'))

//         if (this.user) {
//             this.dashboardService.getAccountTransactions(this.user, toPage).subscribe(
//                 responseData => {
//                     this.data = (<any>responseData.body).content
//                 }, error => {
//                     console.log(error)
//                 })
//         }
//     }



//     pagination(): void {
//         this.prev = (this.page > 1) ? this.page - 1 : 1
//         this.next = +this.page + 1
//     }

//     // changed from:
//     // {{transaction.transactionType=='Withdrawal' ? (transaction.transactionAmt | currency) : ' '}}
//     getTransactionType(v: any, t: string): any {
//         let o = ''
//         if(v.transactionType==t) o = formatCurrency(v.transactionAmt, 'en-US', '$')
//         return o
//     }
// }


// import { DashboardService } from '../../services/dashboard/dashboard.service';
// import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
// import { ActivatedRoute } from '@angular/router';
// import { formatCurrency } from '@angular/common';
// import { User } from 'src/app/model/user.model';
// import { Component } from '@angular/core';
// import { Page } from 'src/app/model/page.model';

// @Component({
//     selector: 'ngx-tables',
//     template: `
//     <div>
//       <h3>
//         Server-side Paging
//       </h3>
//       <ngx-datatable
//         class="material"
//         [rows]="rows"
//         [columns]="[{ name: 'Name' }, { name: 'Gender' }, { name: 'Company' }]"
//         [columnMode]="force"
//         [headerHeight]="50"
//         [footerHeight]="50"
//         rowHeight="auto"
//         [externalPaging]="true"
//         [count]="page.totalElements"
//         [offset]="page.pageNumber"
//         [limit]="page.size"
//         (page)="setPage($event)"
//       >
//       </ngx-datatable>
//     </div>
//   `
// })

// export class GridComponent {

//     user : User;
//     page : Page;
//     rows = [];
    
//     constructor(private dashboardService: DashboardService, private route: ActivatedRoute) {

//         this.route.params.subscribe(params => {
//             this.page = parseInt(params.page) ? params.page : 1
//             this.setPage(this.page.pageNumber)
//         })
        
//         this.page.pageNumber = 0;
//         this.page.size = 20;
//     }

//     ngOnInit() {
//         this.setPage({ offset: 0 });
//     }

//     setPage(pageInfo): void {

//         this.page.pageNumber = pageInfo.offset;
//         this.user = JSON.parse(sessionStorage.getItem('userdetails'))

//         if (this.user) {
//             this.dashboardService.getAccountTransactions(this.user, this.page.pageNumber).subscribe(
//                 responseData => {
//                     this.page = (<any>responseData.body).page
//                     this.rows = (<any>responseData.body).content;
//                 }, error => {
//                     console.log(error)
//                 })
//         }
//     }
    
// }

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
  } from '@angular/core';
  import { DashService } from '../../services/dashboard/dash.service';
  import { API, APIDefinition, Columns, Config, DefaultConfig } from 'ngx-easy-table';
  import { takeUntil } from 'rxjs/operators';
  import { Subject } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { User } from 'src/app/model/user.model';
import { Page } from 'src/app/model/page.model';
// import { StringifyOptions } from 'querystring';
  
  interface EventObject {
    event: string;
    value: {
      limit: number
      page: number
      key: string
      order: string
    };
  }
  
  @Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css'],
    providers: [DashboardService],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class GridComponent implements OnInit, OnDestroy {
    @ViewChild('table', { static: true }) table: APIDefinition;
    public columns: Columns[] = [
        { key: 'accountNumber', title: 'Account Number' },
        { key: 'closingBalance', title: 'Closing Balance' },
        { key: 'createDt', title: 'Date' },
        { key: 'transactionAmt', title: 'Amount' },
        { key: 'transactionSummary', title: 'Summary' }
    ];
    private page: Page
    private params : string = '?limit=10'
    private user : User
    public data ;
    public configuration: Config;
    public pagination = {
      limit: 10,
      offset: 0,
      count: -1,
      orderby: "",
      orderdir: ""
    };
    private ngUnsubscribe: Subject<void> = new Subject<void>();
  
    constructor(
      private readonly companyService: DashboardService,
      private readonly cdr: ChangeDetectorRef
    ) {
        
      this.user = JSON.parse(sessionStorage.getItem('userdetails'))
    }
  
    ngOnInit(): void {
      this.configuration = { ...DefaultConfig };
      this.getData(this.params);
    }
  
    ngOnDestroy(): void {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
  
    eventEmitted($event: { event: string; value: any }): void {
        if ($event.event !== 'onClick') {
          this.parseEvent($event);
          console.log($event)
        }
    }
  
    private parseEvent(obj: EventObject): void {
      this.pagination.limit = obj.value.limit ? obj.value.limit : this.pagination.limit;
      this.pagination.offset = obj.value.page ? obj.value.page : this.pagination.offset;
      if(obj.event === 'onOrder') {
        this.pagination.orderby = obj.value.key ? obj.value.key : this.pagination.orderby;
        this.pagination.orderdir = obj.value.order ? obj.value.order : this.pagination.orderdir;
      }
      this.params = '?'
      Object.keys(this.pagination).forEach(el => {
          this.params += el +"="+this.pagination[el]+"&"
      })
      
      this.getData(this.params);
      console.log(this.params);
    }
  
    private getData(params: string): void {
      this.configuration.isLoading = true
      this.companyService
        .getAccountTransactions(params, this.user)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (response) => {
            this.page = <any>response.body
            this.data = this.page.content
            console.log(this.page)
            // ensure this.pagination.count is set only once and contains count of the whole array, not just paginated one
            this.pagination.count =
              this.pagination.count === -1
                ? response
                  ? this.page.totalElements
                  : 0
                : this.pagination.count;
            this.pagination = { ...this.pagination };
            this.configuration.isLoading = false;
            this.cdr.detectChanges();
            // this.setRowStyle();
          },
          (error) => {
            console.error('ERROR: ', error.message);
          }
        );
    }
  
    private setRowStyle(): void {
      this.table.apiEvent({
        type: API.setRowStyle,
        value: { row: 1, attr: 'background', value: '#fd5e5ed4' },
      });
    }


    
  }
  
  