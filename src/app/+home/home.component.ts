import { Component, Inject, OnInit } from '@angular/core';
import { SWAGGER_URL } from '../app.config';
import { ActivatedRoute } from '@angular/router';
import { Campagne } from '../shared/campagne';
import { CampagneService } from '../shared/campagne/campagne.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    campagne: Campagne;

    constructor(@Inject(SWAGGER_URL) public swaggerUrl: string,
        private route: ActivatedRoute,
        private campagneService: CampagneService) {
    }

    ngOnInit() {
        this.campagneService.list().subscribe((campagnes) => {
            this.campagne = campagnes[campagnes.length - 1];
        });
    }

    scroll(el) {
        el.scrollIntoView({behavior: 'smooth'});
    }
}
