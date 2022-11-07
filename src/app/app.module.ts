import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ContactPage } from './pages/contact/contact.page';
import { HomePage } from './pages/home/home.page';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderInterceptor } from './interceptors/loader.interceptor';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { DateRangePicker } from './components/form-elements/date-range-picker/date-range-picker.component';
function initializeKeycloak(keycloak: KeycloakService) {



    return () =>
        keycloak.init({
            config: {
                url: 'https://auth.samplebank.com/auth',
                realm: 'samplebankdev',
                clientId: 'samplebankpub_ui',
            },
            bearerPrefix: 'Bearer',
            initOptions: {
                pkceMethod: 'S256',
                redirectUri: 'https://samplebank.com/myaccount/details',
                onLoad: 'check-sso',
                silentCheckSsoRedirectUri:
                    window.location.origin + '/assets/silent-check-sso.html',
                checkLoginIframe: true,
                checkLoginIframeInterval: 1000
            }, loadUserProfileAtStartUp: false,
        });

        


}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ContactPage,
        HomePage,
        DashboardPage,
        NoticesPage,
        AccountPage,
        BalancePage,
        LoansPage,
        CardsPage,
        GridComponent,
        ButtonOverviewExampleComponent,
        ExportButtonsComponent,
        LoaderComponent,
        DateRangePicker
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
        MatTooltipModule,
        MatDatepickerModule,
        MatNativeDateModule,
        FontAwesomeModule,
        AppRoutingModule,
        BrowserModule,
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
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}

/*

 ng serve --host samplebank.com --disable-host-check

*/