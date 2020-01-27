import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private metaService: Meta) { }

    ngOnInit() {
        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .subscribe((evt) => {
                window.scrollTo(0, 0);
            });

        this.router.events
            .filter((event) => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map((route) => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            })
            .filter((route) => {
                return route.outlet === 'primary';
            })
            .mergeMap((route) => route.data)
            .subscribe((event) => {
                this.titleService.setTitle(event['title']);

                this.metaService.updateTag(
                    { name: 'description', content: event['meta'] },
                    `name='description'`
                );

                this.metaService.updateTag(
                    { property: 'og:title', content: event['title'] },
                    `property='og:title'`
                );

                this.metaService.updateTag(
                    { property: 'og:description', content: event['meta'] },
                    `property='og:description'`
                );
            });
    }
}
