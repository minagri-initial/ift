import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, NgForm, AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
    selector: 'app-traitement-ift',
    templateUrl: './traitement-ift.component.html',
    styleUrls: ['./traitement-ift.component.scss'],
})
export class TraitementIftComponent implements OnInit, OnDestroy {

    @Input()
    set traitement(value: TraitementIft) {
        if (value) {
            this.initForm(value);
            this.updateDoseReference()
                .then(() => {
                    this.subscribeToChanges();
                });
        }
    }

    @Input()
    withSignature = false;

    traitementIft: TraitementIft;
    traitementIftResult: TraitementIftResult;
    signature: string;
    doseReference: Dose;
    numerosAmm: NumeroAmm[] = null;

    unites;

    numeroAmmByProduct = true;

    subscription: Subscription;

    @ViewChild('iftForm') form: NgForm;

    constructor(
        private uniteService: UniteService,
        private produitService: ProduitService,
        private doseReferenceService: DoseReferenceService,
        private traitementIftService: TraitementIftService,
    ) {
    }


    ngOnInit() {

        this.uniteService.list().subscribe((unites) => {
            this.unites = unites;
        });

    }

    ngOnDestroy() {
        this.unsubscribeToChanges();
    }

    public unsubscribeToChanges() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public subscribeToChanges() {
        if (!this.subscription) {
            this.subscription = this.form.control.valueChanges
                .debounceTime(500)
                .distinctUntilChanged((a, b) => {
                    return _.isEqual(a, b);
                })
                .subscribe(values => {
                    this.onUpdate();
                });
        }
    }

    public generateSignatureElectronique() {
        if (this.traitementIftResult) {
            if (this.form.valid && !this.signature) {
                this.traitementIftService.getSigned(this.traitementIft)
                    .subscribe((result: SignedTraitementIft) => {
                        this.traitementIftResult = result.iftTraitement;
                        this.signature = result.signature;
                    });
            }
        }
    }

    public onUpdate() {

        if (this.form.valid) {
            this.traitementIftService.get(this.traitementIft)
                .subscribe((result: TraitementIftResult) => {
                    this.traitementIftResult = result;
                    this.signature = undefined;
                }, (err) => {
                    console.error(err);
                });
        }
    }

    public updateNumeroAmm(selected) {

        if (selected) {
            this.numerosAmm = null;
            // Retrieve NumeroAmm
            this.produitService.getNumeroAmm(this.traitementIft.campagne, selected)
                .subscribe(numerosAmm => {
                    if (numerosAmm.length === 1) {
                        this.traitementIft.numeroAmm = numerosAmm[0];
                        this.updateDoseReference();
                    } else if (numerosAmm.length > 1) {
                        this.numerosAmm = numerosAmm;
                        // The selected numeroAmm is not in the list anymore
                        if (this.traitementIft.numeroAmm
                            && !this.numerosAmm.find(numeroAmm => numeroAmm.idMetier === this.traitementIft.numeroAmm.idMetier)) {
                            this.traitementIft.numeroAmm = null;
                        }
                    }
                });
        } else {
            this.traitementIft.numeroAmm = null;
            this.numerosAmm = null;
        }
    }

    public updateDoseReference() {

        return new Promise((resolve, reject) => {

            if (this.traitementIft.culture && this.traitementIft.numeroAmm) {
                this.doseReferenceService.get(this.traitementIft.campagne, this.traitementIft.culture,
                    this.traitementIft.numeroAmm, this.traitementIft.cible)
                    .subscribe((doseReference) => {
                        if (doseReference) {
                            this.doseReference = doseReference;
                            this.traitementIft.unite = doseReference.unite;
                        }
                        resolve();
                    }, error => {
                        this.doseReference = undefined;
                        this.traitementIftResult = undefined;
                        reject();
                    });
            } else {
                this.doseReference = undefined;
                this.traitementIftResult = undefined;
                resolve();
            }
        });
    }

    public differentUnite() {
        return this.doseReference && !_.isEqual(this.doseReference.unite, this.traitementIft.unite);
    }

    public isTraitementAvantSemis() {
        return this.traitementIft.traitement && this.traitementIft.traitement.avantSemis === true;
    }

    public volumeDeBouillieNeeded() {
        return this.traitementIft.unite &&
            this.traitementIft.unite.uniteDeConversion &&
            this.doseReference &&
            this.traitementIft.unite.uniteDeConversion.unite === this.doseReference.unite.idMetier;
    }

    public getPercentage(value) {
        if (value <= 2) {
            return value / 2;
        } else {
            return 1;
        }
    }

    public toggleNumeroAmmByProduct(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.traitementIft.numeroAmm = null;
        this.traitementIft.produit = null;
        this.numerosAmm = null;
        this.numeroAmmByProduct = !this.numeroAmmByProduct;
        this.updateDoseReference();
    }

    public initForm(traitement: TraitementIft) {
        this.numeroAmmByProduct = traitement && traitement.numeroAmm && !traitement.produit ? false : true;
        this.traitementIft = traitement;

        this.traitementIftResult = null;
        this.doseReference = null;
        this.numerosAmm = null;
        this.signature = null;

        this.form.resetForm();
    }
}

