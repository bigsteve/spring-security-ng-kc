import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactPage } from './pages/contact/contact.page';
import { HomePage } from './pages/home/home.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { AccountPage } from './pages/account/account.page';
import { BalancePage } from './pages/balance/balance.page';
import { NoticesPage } from './pages/notices/notices.page';
import { LoansPage } from './pages/loans/loans.page';
import { CardsPage } from './pages/cards/cards.page';
import { AuthKeyClockGuard } from './routeguards/auth.route';
import { AppConstants } from './constants/app.constants';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomePage},
  { path: 'contact', component: ContactPage},
  { path: 'notices', component: NoticesPage},
  { path: 'dashboard', component: DashboardPage, canActivate: [AuthKeyClockGuard],data: {
    roles: ['USER','ADMIN']
  }},
  { path: AppConstants.ACCOUNT_API_URL, component: AccountPage, canActivate: [AuthKeyClockGuard],data: {
    roles: ['USER']
  }},
  { path: AppConstants.BALANCE_API_URL, component: BalancePage, canActivate: [AuthKeyClockGuard],data: {
    roles: ['USER']
  }},
  { path: AppConstants.LOANS_API_URL, component: LoansPage, canActivate: [AuthKeyClockGuard],data: {
    roles: ['USER','ADMIN']
  }},
  { path: AppConstants.CARDS_API_URL, component: CardsPage, canActivate: [AuthKeyClockGuard],data: {
    roles: ['USER','ADMIN']
  }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
