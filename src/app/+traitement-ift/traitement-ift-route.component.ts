import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, NgForm, AbstractControl } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

import { TraitementIft, TraitementIftResult, SignedTraitementIft } from './traitement-ift.model';
import { TraitementIftService } from './traitement-ift.service';
import { Campagne, CampagneService } from '../shared/campagne';
import { Culture } from '../shared/culture';
import { NumeroAmm, Produit, ProduitService } from '../shared/numero-amm';
import { Cible } from '../shared/cible';
import { Traitement } from '../shared/traitement';
import { Unite, UniteService } from '../shared/unite';
import { DoseReferenceService, Dose } from '../shared/dose';

@Component({
    selector: 'app-traitement-ift-route',
    templateUrl: './traitement-ift-route.component.html',
})
export class TraitementIftRouteComponent implements OnInit {

    traitement: TraitementIft;
    campagne: Campagne;
    campagnes;

    constructor(
        private campagneService: CampagneService,
        private route: ActivatedRoute,
        private router: Router
    ) {    }

    ngOnInit() {

        // Load campagne list first
        this.campagneService.list().subscribe((campagnes) => {
            this.campagnes = campagnes;

            this.route.params.subscribe(params => {

                const campagneIdMetier = params.campagneIdMetier;

                if (!campagneIdMetier) {
                    const activeCampagne = campagnes.find(campagne => campagne.active);
                    this.router.navigate(['/traitement-ift', activeCampagne.idMetier]);
                } else {
                    this.campagne = campagnes.find(c => c.idMetier === campagneIdMetier);
                    this.traitement = new TraitementIft(this.campagne);
                }
            });
        });

    }

    public nextCampagne() {
        this.router.navigate(['/traitement-ift', this.campagnes[this.campagneIndex + 1].idMetier]);
    }

    public previousCampagne() {
        this.router.navigate(['/traitement-ift', this.campagnes[this.campagneIndex - 1].idMetier]);
    }

    public get campagneIndex() {
        return _.findIndex(this.campagnes, this.campagne);
    }

}

