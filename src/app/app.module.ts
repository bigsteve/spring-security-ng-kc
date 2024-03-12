import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
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
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


import { DateRangePicker } from './components/form-elements/date-range-picker/date-range-picker.component';
import { HighlightDirective } from './directives/highlight.directive';
import { PaginatorDirective } from './directives/paginator.directive';
import { LoadsPage } from './pages/loads/loads.page';
import { CrudComponent } from './components/crud/crud/crud.component';
import { FormComponent } from './components/crud/form/form.component';
import { environment } from 'src/environments/environment';
function initializeKeycloak(keycloak: KeycloakService) {

// // load previous tokens, saved after successful login of keycloak success callback
// const token = localStorage.getItem('kc_token');
// const refreshToken = localStorage.getItem('kc_refreshToken');
// // pass to keycloak init
// keycloak.init({ onLoad: 'login-required', token, refreshToken }).then(
// success=>{
//   localStorage.setItem('kc_token', keycloak.token);
//   localStorage.setItem('kc_refreshToken', keycloak.refreshToken);
//   //load your app from here
// });

    return () =>
        keycloak.init({
            config: {
                url: environment.authUrl,
                realm: environment.authRealm,
                clientId: environment.authClientId,
            },
            bearerPrefix: 'Bearer',
            initOptions: {
                pkceMethod: 'S256',
                redirectUri: environment.frontEndUrl + '/myaccount/details',
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
        DateRangePicker,
        HighlightDirective,
        PaginatorDirective,
        LoadsPage,
        CrudComponent,
        FormComponent
    ],
    exports: [
        AppComponent,
        PaginatorDirective,
        MatDialogModule],
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
        ReactiveFormsModule,
        FontAwesomeModule,
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        MatDialogModule,
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
            deps: [KeycloakService]
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
 ng serve --host samplebank.com --ssl --port 443
 ng serve --host samplebank.com --disable-host-check --ssl --port 443
 ng serve --configuration production --host samplebank.com --disable-host-check --ssl --port 443
*/