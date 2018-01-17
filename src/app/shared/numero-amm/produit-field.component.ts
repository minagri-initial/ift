import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, Optional, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Produit } from './produit.model';
import { NumeroAmm } from './numero-amm.model';
import { ProduitService } from './produit.service';
import { NumeroAmmService } from './numero-amm.service';
import { Culture } from '../culture/culture.model';
import { Campagne } from '../campagne/campagne.model';
import { Cible } from '../cible/cible.model';
import { BaseFieldComponent } from '../field/base-field.component';
import { NG_VALUE_ACCESSOR, NgModel, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { select } from 'd3';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'app-produit-field',
    templateUrl: './produit-field.component.html',
    styleUrls: ['./produit-field.component.scss', '../field/field.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: ProduitFieldComponent, multi: true }
    ]
})
export class ProduitFieldComponent extends BaseFieldComponent<Produit | NumeroAmm> implements OnChanges, AfterViewInit {

    produits: BehaviorSubject<Produit[]> = new BehaviorSubject([]);
    term: string = null;

    @ViewChild(NgModel) model: NgModel;

    @Input()
    campagne: Campagne;

    @Input()
    culture: Culture;

    @Input()
    cible: Cible;

    @Input()
    required = false;

    constructor(
        @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
        @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
        private produitService: ProduitService
    ) {
        super(validators, asyncValidators);
    }

    ngAfterViewInit() {
        this.model.valueChanges.subscribe(newValue => {
            const newTerm = newValue ? newValue.libelle : null;
            this.termChanged(newTerm);
        });
    }

    ngOnChanges(changes: SimpleChanges) {

        this.refreshList();
    }

    termChanged(term) {

        if (this.term !== term) {
            this.term = term;
            this.refreshList();
        }
    }

    public refreshList() {

        this.produitService.query(this.campagne, this.culture, this.cible, this.term, 7)
            .subscribe(produits => {
                this.produits.next(produits);
            });
    }

}
