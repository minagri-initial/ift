import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Campagne } from '../shared/campagne';
import { CampagneService } from '../shared/campagne/campagne.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    activeCampagneIdMetier = '';

    allTools = true;
    toolsCultivee = false;
    toolsAccompagne = false;
    toolsControle = false;
    toolsDeveloppe = false;

    areToolsOpen = false;

    constructor( private route: ActivatedRoute,
        private campagneService: CampagneService) {
    }

    ngOnInit() {
        this.campagneService.activeCampagne.subscribe((campagne) => {
            if (campagne) {
                this.activeCampagneIdMetier = campagne.idMetier;
            }
        });
    }

    scroll(el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }

    showAllTools() {
        if (this.areToolsOpen || window.matchMedia('(min-width: 768px)').matches) {
            this.allTools = true;
            this.toolsCultivee = false;
            this.toolsAccompagne = false;
            this.toolsControle = false;
            this.toolsDeveloppe = false;
            this.areToolsOpen = false;
        } else {
            this.areToolsOpen = true;
        }
    }

    showToolsCultive() {
        if (this.areToolsOpen || window.matchMedia('(min-width: 768px)').matches) {
            this.allTools = false;
            this.toolsCultivee = true;
            this.toolsAccompagne = false;
            this.toolsControle = false;
            this.toolsDeveloppe = false;
            this.areToolsOpen = false;
        } else {
            this.areToolsOpen = true;
        }
    }

    showToolsAccompagne() {
        if (this.areToolsOpen || window.matchMedia('(min-width: 768px)').matches) {
            this.allTools = false;
            this.toolsCultivee = false;
            this.toolsAccompagne = true;
            this.toolsControle = false;
            this.toolsDeveloppe = false;
            this.areToolsOpen = false;
        } else {
            this.areToolsOpen = true;
        }
    }

    showToolsControle() {
        if (this.areToolsOpen || window.matchMedia('(min-width: 768px)').matches) {
            this.allTools = false;
            this.toolsCultivee = false;
            this.toolsAccompagne = false;
            this.toolsControle = true;
            this.toolsDeveloppe = false;
            this.areToolsOpen = false;
        } else {
            this.areToolsOpen = true;
        }
    }

    showToolsDeveloppe() {
        if (this.areToolsOpen || window.matchMedia('(min-width: 768px)').matches) {
            this.allTools = false;
            this.toolsCultivee = false;
            this.toolsAccompagne = false;
            this.toolsControle = false;
            this.toolsDeveloppe = true;
            this.areToolsOpen = false;
        } else {
            this.areToolsOpen = true;
        }
    }

    showDosesReference() {
        return true && !(this.toolsControle) && !(this.toolsDeveloppe);
    }

    showIftTraitement() {
        return true && !(this.toolsControle) && !(this.toolsDeveloppe);
    }

    showBilanIFT() {
        return true && !(this.toolsDeveloppe);
    }

    showVerifierIFT() {
        return this.allTools || this.toolsControle;
    }

    showDownloadData() {
        return this.allTools || this.toolsAccompagne;
    }

    showConsulterAPI() {
        return this.allTools || this.toolsDeveloppe;
    }

    showAccederCodeSource() {
        return this.allTools || this.toolsDeveloppe;
    }
}
