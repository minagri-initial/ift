import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, NgForm, FormGroup, FormBuilder, Validators, AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/of';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { isEqual } from 'lodash';

import { TraitementIft, TraitementIftResult, SignedTraitementIft } from './traitement-ift.model';
import { TraitementIftService } from './traitement-ift.service';
import { Campagne, CampagneService } from '../campagne';
import { Culture } from '../culture';
import { NumeroAmm, Produit, ProduitService } from '../numero-amm';
import { Cible } from '../cible';
import { TypeTraitement } from '../type-traitement';
import { Unite, UniteService } from '../unite';
import { DoseReferenceService, Dose } from '../dose';
import { ModalComponent } from '../modal/modal.component';
import { TitreModalComponent } from '../modal/titre-modal.component';
import { QRCodeService } from '../qr-code/qr-code.service';
import { TypeTraitementFieldComponent } from '../type-traitement/type-traitement-field.component';

const FRONTEND_URL_VERIFIER = `${window.location.origin}/verifier-traitement-ift`;

@Component({
    selector: 'app-traitement-ift',
    templateUrl: './traitement-ift.component.html',
    styleUrls: ['./traitement-ift.component.scss'],
})
export class TraitementIftComponent implements OnInit, AfterContentInit, OnDestroy {

    @Input() withSignature = false;

    @Input() parent: FormGroup;

    traitementIftResult: TraitementIftResult;
    signature: string;
    qrcode;
    doseReference: Dose;

    // List of numeroAMM displayed to the user when multiple numeroAMM exists for the same product and campagne.
    numerosAmm: NumeroAmm[] = null;

    // List of numeroAMM used to filter cultures and cibles. Can the one selected or more if multiple numeroAmm are valid for a product
    _numerosAmm: NumeroAmm[] = null;

    unites;

    numeroAmmByProduct = true;

    subscription: Subscription;

    @ViewChild(ModalComponent) modalComponent: ModalComponent;
    infoDoseAppliquee = `Il est recommandé de renseigner la dose appliquée dans la même unité
     que la dose de référence qui s'affiche ci-dessous. Si vous utilisez une unité qui ne peut
     être convertie à l'aide du volume de bouillie appliqué dans la même unité que la dose de
     référence, alors l'IFT sera par défaut à 1.`;
    infoSeveralNumerosAmm = `Ce produit est associé à plusieurs numéros d'AMM. Veuillez sélectionner
     le numéro d'AMM correspondant au produit que vous avez utilisé. Cette information figure sur
     l'emballage ou la fiche produit.`;
    infoCommentaire = `Vous avez la possibilité d'insérer un commentaire à votre traitement. Vous pouvez par
     exemple indiquer le nom et/ou le numéro d'AMM du produit utilisé si vous ne l'avez pas retrouvé dans la
     liste des produits, préciser s'il s'agissait d'un traitement obligatoire, ou bien si le traitement visait
     plusieurs cibles.`;
    modalIsDoseAppliquee = true;
    modalIsSeveralNumerosAmm = true;
    modalIsCommentaire = true;

    downloading = false;

    titreModalRef: BsModalRef;

    constructor(
        private uniteService: UniteService,
        private produitService: ProduitService,
        private doseReferenceService: DoseReferenceService,
        private traitementIftService: TraitementIftService,
        private qrCodeService: QRCodeService,
        private modalService: BsModalService,
        private formBuilder: FormBuilder
    ) { }

    get campagne() { return this.parent.get('campagne'); }
    get culture() { return this.parent.get('culture'); }
    get typeTraitement() { return this.parent.get('typeTraitement'); }
    get numeroAmm() { return this.parent.get('numeroAmm'); }
    get produit() { return this.parent.get('produit'); }
    get cible() { return this.parent.get('cible'); }
    get dose() { return this.parent.get('dose'); }
    get unite() { return this.parent.get('unite'); }
    get volumeDeBouillie() { return this.parent.get('volumeDeBouillie'); }
    get facteurDeCorrection() { return this.parent.get('facteurDeCorrection'); }
    get commentaire() { return this.parent.get('commentaire'); }

    ngOnInit() {
        this.uniteService.list().subscribe((unites) => {
            this.unites = unites;
        });
    }

    ngAfterContentInit() {
        if (this.produit.value && this.produit.value.libelle) {
            this.produitChanged(this.produit.value);
        }

        this.culture.valueChanges.subscribe(val => {
            this.cultureChanged();
        });

        this.typeTraitement.valueChanges.subscribe(val => {
            this.typeTraitementChanged();
        });

        this.produit.valueChanges.subscribe(val => {
            this.produitChanged(val);
        });

        this.numeroAmm.valueChanges.subscribe(val => {
            this.numeroAmmChanged(val);
        });

        this.cible.valueChanges.subscribe(val => {
            this.cibleChanged();
        });

        this.unite.valueChanges.subscribe(val => {
            this.uniteChanged();
        });

        this.numeroAmmByProduct = this.numeroAmm.value && !this.produit.value ? false : true;

        this.onUpdate();
        this.updateDoseReference()
            .then(() => {
                this.subscribeToChanges();
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
            this.subscription = this.parent.valueChanges
                .debounceTime(500)
                .distinctUntilChanged((a, b) => {
                    return isEqual(a, b);
                })
                .subscribe(values => {
                    this.onUpdate();
                });

        }
    }


    public onUpdate() {
        if (!this.parent.invalid) {
            this.traitementIftService.compute(this.getTraitementIft())
                .subscribe((result: TraitementIftResult) => {
                    this.traitementIftResult = result;
                    this.signature = undefined;
                    this.qrcode = undefined;
                }, (err) => {
                    console.error(err);
                });
        }
    }

    private getTraitementIft() {
        return {
            campagne: this.campagne.value,
            culture: this.culture.value,
            numeroAmm: this.numeroAmm.value,
            cible: this.cible.value,
            produit: this.produit.value,
            typeTraitement: this.typeTraitement.value,
            dose: this.dose.value,
            unite: this.unite.value,
            volumeDeBouillie: this.volumeDeBouillie.value,
            facteurDeCorrection: this.facteurDeCorrection.value,
            dateTraitement: null,
            produitLibelle: this.produit.value ? this.produit.value.libelle : null,
            commentaire: this.commentaire.value
        };
    }

    public cultureChanged() {
        setTimeout(() => {
            this._updateNumeroAmm()
                .subscribe(() => {
                    this.updateDoseReference();
                });
        });

    }

    public cibleChanged() {
        setTimeout(() => {
            this._updateNumeroAmm()
                .subscribe(() => {
                    this.updateDoseReference();
                });
        });
    }

    public produitChanged(produit: Produit) {
        if (produit) {
            this.numerosAmm = null;
            this._updateNumeroAmm()
                .subscribe(numerosAmm => {
                    if (numerosAmm.length === 1) {
                        this.updateDoseReference();
                    }
                });
        } else {
            this.numeroAmm.patchValue(null);
            this.numerosAmm = null;
            this._numerosAmm = null;
            this.doseReference = undefined;
        }
    }

    private _updateNumeroAmm() {
        if (this.produit.value) {

            // Retrieve NumeroAmm
            return this.produitService.getNumeroAmm(this.campagne.value,
                this.produit.value,
                this.culture.value,
                this.cible.value)
                .do((numerosAmm) => {
                    if (numerosAmm.length === 1) {
                        this.numeroAmm.patchValue(numerosAmm[0]);
                        this.numerosAmm = null;
                        this._numerosAmm = numerosAmm;
                    } else if (numerosAmm.length > 1) {
                        this.numerosAmm = numerosAmm;
                        this._numerosAmm = numerosAmm;
                        // The selected numeroAmm is not in the list anymore
                        if (this.numeroAmm.value
                            && !this.numerosAmm.find(numeroAmm => numeroAmm.idMetier === this.numeroAmm.value.idMetier)) {
                            this.numeroAmm.patchValue(null);
                        }
                    }
                });
        }

        return Observable.of([]);
    }

    public numeroAmmChanged(selected) {
        if (selected) {
            this._numerosAmm = [selected];
        } else {
            this._numerosAmm = null;
        }

        this.updateDoseReference();
    }

    public updateDoseReference() {
        return new Promise((resolve, reject) => {

            if (this.culture.value && this.numeroAmm.value) {
                this.doseReferenceService.get(this.campagne.value, this.culture.value,
                    this.numeroAmm.value, this.cible.value)
                    .subscribe((doseReference) => {
                        if (doseReference && !isEqual(this.doseReference, doseReference)) {
                            this.doseReference = doseReference;
                            this.unite.patchValue(doseReference.unite);
                        }
                        resolve();
                    }, error => {
                        this.doseReference = undefined;
                        reject();
                    });
            } else {
                this.doseReference = undefined;
                resolve();
            }
        });
    }

    public differentUnite() {
        return this.doseReference && !isEqual(this.doseReference.unite, this.unite.value);
    }

    public isTraitementAvantSemis() {
        return this.typeTraitement.value && this.typeTraitement.value.avantSemis === true;
    }

    public volumeDeBouillieNeeded() {
        return this.unite.value &&
            this.unite.value.uniteDeConversion &&
            this.doseReference &&
            this.unite.value.uniteDeConversion.unite === this.doseReference.unite.idMetier;
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

        this.numeroAmm.patchValue(null);
        this.produit.patchValue(null);
        this.numerosAmm = null;
        this._numerosAmm = null;
        this.numeroAmmByProduct = !this.numeroAmmByProduct;
        this.updateDoseReference();
    }

    public resetForm() {
        const campagne = this.campagne.value;
        this.parent.reset({
            campagne: campagne,
            facteurDeCorrection: 100
        });
        this.parent.get('facteurDeCorrection').enable();
        this.numeroAmmByProduct = true;
        this.traitementIftResult = null;
        this.doseReference = null;
        this.numerosAmm = null;
        this._numerosAmm = null;
        this.signature = null;
        this.qrcode = null;

        window.scrollTo(0, 0);
    }

    showInfoDoseAppliquee() {
        this.modalIsDoseAppliquee = true;
        this.modalIsSeveralNumerosAmm = false;
        this.modalIsCommentaire = false;
        this.modalComponent.showInfo();
    }

    showSeveralNumerosAmmInfo() {
        this.modalIsDoseAppliquee = false;
        this.modalIsSeveralNumerosAmm = true;
        this.modalIsCommentaire = false;
        this.modalComponent.showInfo();
    }

    showCommentaire() {
        this.modalIsDoseAppliquee = false;
        this.modalIsSeveralNumerosAmm = false;
        this.modalIsCommentaire = true;
        this.modalComponent.showInfo();
    }

    private typeTraitementChanged() {
        if (this.isTraitementAvantSemis()) {
            this.cible.patchValue(null);
            this.dose.patchValue(null);
            this.numeroAmm.patchValue(null);
            this.produit.patchValue(null);
            this.unite.patchValue(null);
            this.volumeDeBouillie.patchValue(null);
            this.doseReference = undefined;
        }
    }

    private uniteChanged() {
        if (this.volumeDeBouillieNeeded()) {
            this.volumeDeBouillie.patchValue(1000);
        } else {
            this.volumeDeBouillie.patchValue(null);
        }
    }

    public downloadSignedIft() {
        if (!this.downloading && this.traitementIftResult) {
            if (this.parent.valid) {
                this.titreModalRef = this.modalService.show(TitreModalComponent, { class: 'modal-lg' });

                const validate: Observable<{ titre: string }> = this.titreModalRef.content.validate;

                validate.first().subscribe((res) => {
                    this.downloading = true;
                    this.traitementIftService.downloadSignedIftUrl(res.titre, this.getTraitementIft())
                        .subscribe((data) => {
                            this.downloadFile(data);
                        });
                });
            }
        }
    }

    public downloadFile(data: Blob) {

        const fileName = 'IFT-' + Date.now() + '.pdf';

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(data, fileName);
        } else {
            const url = window.URL.createObjectURL(data);

            const anchor = document.createElement('a');
            document.body.appendChild(anchor);
            anchor.download = fileName;
            anchor.href = url;
            anchor.click();
        }
        this.downloading = false;
    }
}
