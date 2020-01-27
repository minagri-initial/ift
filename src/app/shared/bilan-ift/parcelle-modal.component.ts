import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, Validators, FormGroup, NgModel } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

import { ParcelleCultivee, BilanParcelleCultivee } from './bilan.model';
import { Culture } from '../culture/culture.model';
import { CultureFieldComponent } from '../culture/culture-field.component';

@Component({
    selector: 'app-parcelle-modal-content',
    templateUrl: './parcelle-modal.component.html',
    styleUrls: ['./parcelle-modal.component.scss']
})
export class ParcelleModalComponent implements OnInit {

    duplication = false;
    parcelleTitle: string;

    form = this.formBuilder.group({
        id: '',
        nom: [null, Validators.required],
        surface: [null, Validators.required],
        culture: [null, Validators.required]
    });

    validate: Subject<{ nom: string, surface: number, culture: Culture }> = new Subject();

    listeParcellesExisting: BilanParcelleCultivee[];
    existing = false;

    constructor(public bsModalRef: BsModalRef,
        private formBuilder: FormBuilder) { }

    ngOnInit() {

        this.nom.valueChanges.subscribe((val) => {
            this.checkExisting();
        });

        this.cultureParcelle.valueChanges.subscribe((val) => {
            this.checkExisting();
        });
    }

    get nom() {
        return this.form.get('nom');
    }

    get surface() {
        return this.form.get('surface');
    }

    get cultureParcelle() {
        return this.form.get('culture');
    }

    initData(nom: string, surface: number, culture: Culture, cultureReadonly?: boolean) {
        this.form.patchValue({
            nom: nom,
            surface: surface,
            culture: culture
        });
        if (cultureReadonly) {
            this.cultureParcelle.disable();
        }
    }

    checkExisting() {
        this.existing = this.cultureParcelle.value && this.listeParcellesExisting && this.listeParcellesExisting.some(bilan => {
            return bilan.parcelleCultivee.parcelle.nom === this.nom.value &&
                bilan.parcelleCultivee.culture.idMetier === this.cultureParcelle.value.idMetier;
        });
    }

    submit() {
        if (!this.form.invalid) {
            this.checkExisting();
            if (!this.existing) {
                this.validate.next({
                    nom: this.nom.value,
                    surface: this.surface.value,
                    culture: this.cultureParcelle.value
                });
                this.bsModalRef.hide();
            }
        } else {
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


}
