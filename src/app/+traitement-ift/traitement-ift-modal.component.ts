import { Component, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { fr } from 'ngx-bootstrap/locale';

import { Parcelle, TraitementParcelle } from '../+bilan-ift/bilan.model';
import { Subject } from 'rxjs/Subject';
import { TraitementIftComponent } from './traitement-ift.component';
defineLocale('fr', fr);

@Component({
    selector: 'app-modal-content',
    templateUrl: './traitement-ift-modal.component.html',
    styleUrls: ['./traitement-ift-modal.component.scss']
})
export class TraitementIftModalComponent implements OnInit {

    nomParcelle: string;
    set traitement(value: TraitementParcelle){

        this.traitementParcelle = _.cloneDeep(value);
        this.date = new Date(this.traitementParcelle.date);
    }
    traitementParcelle: TraitementParcelle;
    date: Date;

    @ViewChild('traitementIft')
    traitementIftComp: TraitementIftComponent;

    datePickerConfig: Partial<BsDatepickerConfig>;

    parcelles: string[] = [];

    validate: Subject<{ nomParcelle: string, traitementParcelle: TraitementParcelle }> = new Subject();

    constructor(public bsModalRef: BsModalRef,
        private localeService: BsLocaleService) { }

    ngOnInit() {
        this.localeService.use('fr');
        this.datePickerConfig = Object.assign({}, { showWeekNumbers: false, containerClass: 'theme-primary' });
    }

    submit() {
        this.traitementParcelle.iftTraitement = this.traitementIftComp.traitementIft;
        this.traitementParcelle.date = this.date.toISOString();
        this.validate.next({
            nomParcelle: this.nomParcelle,
            traitementParcelle: this.traitementParcelle
        });
        this.bsModalRef.hide();
    }


}
