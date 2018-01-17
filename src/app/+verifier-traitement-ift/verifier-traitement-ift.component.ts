import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm, AbstractControl } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import * as _ from 'lodash';

import { Campagne } from '../shared/campagne';
import { Culture } from '../shared/culture';
import { NumeroAmm, Produit } from '../shared/numero-amm';
import { Cible } from '../shared/cible';
import { Traitement } from '../shared/traitement';
import { Unite } from '../shared/unite';
import { DoseReferenceService } from '../shared/dose';
import { Dose } from '../shared/dose/dose.model';
import { VerifierTraitementIftService } from './verifier-traitement-ift.service';
import { TraitementIftResult } from '../+traitement-ift/traitement-ift.model';

declare var moment: any;

@Component({
    selector: 'app-verifier-traitement-ift',
    templateUrl: './verifier-traitement-ift.component.html',
    styleUrls: ['./verifier-traitement-ift.component.scss']
})
export class VerifierTraitementIftComponent implements OnInit {

    traitementIftResult: TraitementIftResult;
    signature: string;
    error: string;

    constructor(
        private verifierTraitementIftService: VerifierTraitementIftService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
    }

    public onSubmit(form: NgForm) {
        // Mark all field as touched to apply css errors
        _.values(form.controls).forEach((control: AbstractControl) => {
            control.markAsTouched();
        });

        if (form.valid) {
            this.verifierTraitementIftService.get(this.signature)
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
    }

    public isTraitementAvantSemis() {
        return this.traitementIftResult.traitement && this.traitementIftResult.traitement.avantSemis === true;
    }

    public getDateCreationSignature() {
        moment.locale('fr');
        return moment(this.traitementIftResult.dateCreation).format('DD/MM/YYYY à HH:mm');
    }
}

