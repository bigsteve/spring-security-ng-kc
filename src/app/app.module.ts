import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ContactPage } from './pages/contact/contact.page';
import { LoginPage } from './pages/login/login.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { NoticesPage } from './pages/notices/notices.page';
import { AccountPage } from './pages/account/account.page';
import { BalancePage } from './pages/balance/balance.page';
import { LoansPage } from './pages/loans/loans.page';
import { CardsPage } from './pages/cards/cards.page';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { GridComponent } from './components/grid/grid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { ButtonOverviewExampleComponent } from './components/buttons/button-overview-example/button-overview-example.component';
import { ExportButtonsComponent } from './components/export-buttons/export-buttons.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatSortModule } from "@angular/material/sort";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

function initializeKeycloak(keycloak: KeycloakService) {
    return () =>
        keycloak.init({
            config: {
                url: 'http://192.168.80.128:8085/auth',
                realm: 'samplebankdev',
                clientId: 'samplebankpub_ui',
            },
            initOptions: {
                pkceMethod: 'S256',
                redirectUri: 'http://localhost:4200/dashboard'
            }, loadUserProfileAtStartUp: false
        });
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ContactPage,
        LoginPage,
        DashboardPage,
        NoticesPage,
        AccountPage,
        BalancePage,
        LoansPage,
        CardsPage,
        GridComponent,
        ButtonOverviewExampleComponent,
        ExportButtonsComponent
    ],
    exports: [AppComponent],
    imports: [
        CommonModule,
        MatGridListModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatPaginatorModule,
        MatListModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatSortModule,
        MatProgressSpinnerModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        KeycloakAngularModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'XSRF-TOKEN',
            headerName: 'X-XSRF-TOKEN',
        }),
        BrowserAnimationsModule,
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: initializeKeycloak,
            multi: true,
            deps: [KeycloakService],
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
