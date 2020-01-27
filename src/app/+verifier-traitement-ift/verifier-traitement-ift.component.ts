import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm, AbstractControl } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';

import { Campagne } from '../shared/campagne';
import { Culture } from '../shared/culture';
import { NumeroAmm, Produit } from '../shared/numero-amm';
import { Cible } from '../shared/cible';
import { TypeTraitement } from '../shared/type-traitement';
import { Unite } from '../shared/unite';
import { DoseReferenceService } from '../shared/dose';
import { Dose } from '../shared/dose/dose.model';
import { TraitementIftResult, SignedTraitementIft, TraitementIft, TraitementIftService } from '../shared/traitement-ift';

@Component({
    selector: 'app-verifier-traitement-ift',
    templateUrl: './verifier-traitement-ift.component.html',
    styleUrls: ['./verifier-traitement-ift.component.scss']
})
export class VerifierTraitementIftComponent implements OnInit {

    traitementIftResult: TraitementIftResult;
    id: string;
    loadFromUrl = false;
    error: string;

    constructor(
        private traitementIftService: TraitementIftService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.route.params
            .subscribe(params => {
                if (params.id) {
                    this.id = params.id;
                    this.getTraitementIft();
                }
            });
    }

    public getTraitementIft() {
        this.traitementIftService.get(this.id)
            .subscribe(
                (result: TraitementIftResult) => {
                    this.traitementIftResult = result;
                    this.error = undefined;
                },
                (error) => {
                    this.error = JSON.parse(error.error).message;
                    this.traitementIftResult = undefined;
                }
            );
    }

    public getPercentage(value) {
        if (value <= 2) {
            return value / 2;
        } else {
            return 1;
        }
    }
}

