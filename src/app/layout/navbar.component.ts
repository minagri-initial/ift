import { Component, HostListener, OnInit, AfterViewInit, Inject, HostBinding } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Campagne, CampagneService } from '../shared/campagne';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {

    activeCampagneIdMetier = '';

    currentUrl: string;
    isCollapsed = true;

    topNavCollapse = false;

    showIntro = true;

    environment = environment;

    @HostBinding('style.height')
    height = '47px';

    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event: any): void {
        if (window.pageYOffset > 50) {
            this.topNavCollapse = true;
        } else {
            this.topNavCollapse = false || this.currentUrl !== '/';
        }
    }

    constructor( private router: Router,
    private campagneService: CampagneService) {
    }

    ngOnInit() {
        this.campagneService.activeCampagne.subscribe((campagne) => {
            if (campagne) {
                this.activeCampagneIdMetier = campagne.idMetier;
            }
        });
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.currentUrl = event.url;

                this.topNavCollapse = this.currentUrl !== '/';
            }
        });
    }

    ngAfterViewInit() {
        setTimeout(_ => {
            this._setSize();
        });
    }

    hideIntro() {
        this.showIntro = false;
        this.height = '47px';
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this._setSize();
    }

    private _setSize(){
        const bandeauHeight = document.getElementById('bandeau') ? document.getElementById('bandeau').clientHeight : 0;
        this.height = (47 + bandeauHeight) + 'px';
    }
    
    environnementIsProduction() {
        return this.environment.id === 'prod';
    }
}
