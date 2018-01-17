import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Campagne, CampagneService } from '../shared/campagne';
import { SWAGGER_URL } from '../app.config';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    currentUrl: string;
    isCollapsed = true;

    topNavCollapse = false;

    showIntro = true;

    environmentName = '';
    environmentId = '';
    productionUrl = '';

    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event: any): void {
        if (window.pageYOffset > 50) {
            this.topNavCollapse = true;
        } else {
            this.topNavCollapse = false || this.currentUrl !== '/';
        }
    }

    constructor( @Inject(SWAGGER_URL) public swaggerUrl: string,
        private router: Router) {
        this.environmentName = environment.name;
        this.environmentId = environment.id;
        this.productionUrl = environment.productionUrl;
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentUrl = event.url;

                this.topNavCollapse = this.currentUrl !== '/';
            }
        });
    }

    hideIntro() {
        this.showIntro = false;
    }

    environnementIsProduction() {
        return this.environmentId === 'prod';
    }
}
