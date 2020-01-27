import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep, merge } from 'lodash';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { frLocale } from 'ngx-bootstrap/locale';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';
import { ModalComponent } from '../modal/modal.component';
import { TraitementIft } from '../traitement-ift/traitement-ift.model';
import { BilanParcelleCultivee, ParcelleCultivee } from './bilan.model';


defineLocale('fr', frLocale);

@Component({
    selector: 'app-modal-content',
    templateUrl: './traitement-ift-modal.component.html',
    styleUrls: ['./traitement-ift-modal.component.scss']
})
export class TraitementIftModalComponent implements OnInit {

    dateTouched = false;
    duplication = false;

    dataInitialised = false;

    form = this.formBuilder.group({
        id: '',
        parcelleCultivee: [null, Validators.required],
        date: [null, Validators.required],
        campagne: [null, Validators.required],
        culture: [{ value: null, disabled: true }, Validators.required],
        numeroAmm: null,
        produit: null,
        cible: null,
        typeTraitement: [null, Validators.required],
        dose: null,
        unite: null,
        volumeDeBouillie: null,
        facteurDeCorrection: 100,
        surfaceTraitee: null,
        surfaceTotale: [{ value: null, disabled: true }],
        commentaire: null
    });

    datePickerConfig: Partial<BsDatepickerConfig>;

    parcelles: any[] = [];

    @ViewChild(ModalComponent) modalComponent: ModalComponent;

    validate: Subject<{ parcelleCultivee: ParcelleCultivee, traitementParcelle: TraitementIft }> = new Subject();

    constructor(public bsModalRef: BsModalRef,
        private localeService: BsLocaleService,
        private formBuilder: FormBuilder) { }

    get parcelleCultivee() {
        return this.form.get('parcelleCultivee');
    }

    get date() {
        return this.form.get('date');
    }

    ngOnInit() {
        this.localeService.use('fr');
        this.datePickerConfig = Object.assign({},
            { showWeekNumbers: false, containerClass: 'theme-primary', dateInputFormat: 'DD/MM/YYYY' });
    }

    initData(traitement: TraitementIft, bilanParcelleCultivee?: BilanParcelleCultivee) {
        let parcelle = null;
        if (bilanParcelleCultivee) {
            parcelle = cloneDeep(bilanParcelleCultivee);
            parcelle.libelle = bilanParcelleCultivee.parcelleCultivee.parcelle.nom
                + ' - ' + bilanParcelleCultivee.parcelleCultivee.culture.libelle
                + ' (' + bilanParcelleCultivee.parcelleCultivee.parcelle.surface + ' HA)';
        }

        let produit;
        if (traitement.produit) {
            produit = traitement.produit;
        } else if (traitement.produitLibelle) {
            produit = { libelle: traitement.produitLibelle };
        }

        this.form.patchValue({
            parcelleCultivee: parcelle,
            date: traitement.dateTraitement ? new Date(traitement.dateTraitement) : undefined,
            campagne: traitement.campagne,
            culture: traitement.culture,
            numeroAmm: traitement.numeroAmm,
            produit: produit,
            cible: traitement.cible,
            typeTraitement: traitement.typeTraitement,
            dose: traitement.dose,
            unite: traitement.unite,
            volumeDeBouillie: traitement.volumeDeBouillie,
            facteurDeCorrection: traitement.facteurDeCorrection,
            surfaceTraitee: null,
            surfaceTotale: null,
            commentaire: traitement.commentaire
        });
        this.dataInitialised = true;

        this.parcelleCultivee.valueChanges.subscribe((val) => {
            if (val) {
                this.onParcelleSelected(val);
            }
        });
    }

    submit() {
        if (!this.form.invalid) {

            const produit = this.form.get('produit').value;
            const traitementParcelle: TraitementIft = merge(this.form.value,
                { culture: this.form.get('culture').value },
                { produitLibelle: produit ? produit.libelle : '' },
                { dateTraitement: new Date(this.date.value.setMinutes(-this.date.value.getTimezoneOffset())).toISOString() });

            delete traitementParcelle['parcelleCultivee'];

            this.validate.next({
                parcelleCultivee: this.parcelleCultivee.value.parcelleCultivee,
                traitementParcelle: traitementParcelle
            });
            this.bsModalRef.hide();
        } else {
            this.dateTouched = true;
            this.markFormGroupTouched(this.form);
        }
    }

    markFormGroupTouched(parent: FormGroup) {
        (<any>Object).keys(parent.controls).map(x => parent.controls[x])
            .forEach(control => {
                control.markAsTouched();

                if (control.controls) {
                    control.controls.forEach(c => this.markFormGroupTouched(c));
                }
            });
    }

    onParcelleSelected(item) {
        this.form.get('culture').patchValue(item.parcelleCultivee.culture);
        this.form.get('surfaceTotale').patchValue(item.parcelleCultivee.parcelle.surface);
    }

    onDateHidden($event: Event) {
        this.dateTouched = true;
    }

    showDateTraitementInfo() {
        this.modalComponent.showInfo();
    }

}
