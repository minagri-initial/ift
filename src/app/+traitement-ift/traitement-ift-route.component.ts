import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormBuilder, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { Subscription } from 'rxjs/Subscription';
import { findIndex } from 'lodash';

import { TraitementIft, TraitementIftResult, SignedTraitementIft, TraitementIftService } from '../shared/traitement-ift';
import { Campagne, CampagneService } from '../shared/campagne';
import { Culture } from '../shared/culture';
import { NumeroAmm, Produit, ProduitService } from '../shared/numero-amm';
import { Cible } from '../shared/cible';
import { Unite, UniteService } from '../shared/unite';
import { DoseReferenceService, Dose } from '../shared/dose';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
    selector: 'app-traitement-ift-route',
    templateUrl: './traitement-ift-route.component.html',
    styleUrls: ['./traitement-ift-route.component.scss']
})
export class TraitementIftRouteComponent implements OnInit {

    traitement: TraitementIft;
    campagne: Campagne;
    campagnes;

    @ViewChild(ModalComponent) modalComponent: ModalComponent;

    form = this.formBuilder.group({
        id: '',
        campagne: [null, Validators.required],
        culture: [null, Validators.required],
        numeroAmm: null,
        produit: null,
        cible: null,
        typeTraitement: [null, Validators.required],
        dose: null,
        unite: null,
        volumeDeBouillie: null,
        facteurDeCorrection: 100,
        surfaceTraitee: null,
        surfaceTotale: null,
        commentaire: null
    });

    constructor(
        private campagneService: CampagneService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
    }

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
                    this.form.reset({
                        campagne: this.campagne,
                        facteurDeCorrection: 100
                    });
                    this.form.get('facteurDeCorrection').enable();
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
        return findIndex(this.campagnes, this.campagne);
    }

    showInfo() {
        this.modalComponent.showInfo();
    }

}

