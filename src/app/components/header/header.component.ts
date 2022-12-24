import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Seo } from 'src/app/model/seo/seo.model';
import { AuthGuard } from 'src/app/routeguards/auth.route';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Input() seo: Seo
    user = new User()
    public isLoggedIn = false;
    public userProfile: KeycloakProfile | null = null;

    constructor(private readonly keycloak: KeycloakService, private readonly authGuard: AuthGuard) {
        this.authGuard = authGuard
        this.user = authGuard.user
    }

    public login() {
        this.keycloak.login();
    }

    public logout() {
        this.keycloak.logout();
    }

}
