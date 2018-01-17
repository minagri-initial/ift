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
    selector: 'app-numero-amm-field',
    templateUrl: './numero-amm-field.component.html',
    styleUrls: ['./numero-amm-field.component.scss', '../field/field.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: NumeroAmmFieldComponent, multi: true }
    ]
})
export class NumeroAmmFieldComponent extends BaseFieldComponent<Produit | NumeroAmm> implements OnChanges, AfterViewInit {

    numerosAmm: BehaviorSubject<NumeroAmm[]> = new BehaviorSubject([]);
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
        private numeroAmmService: NumeroAmmService
    ) {
        super(validators, asyncValidators);
    }

    ngAfterViewInit() {
        this.model.valueChanges.subscribe(newValue => {
            const newTerm = newValue ? newValue.idMetier : null;
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

        this.numeroAmmService.query(this.campagne, this.culture, this.cible, this.term, 7)
            .subscribe(numerosAmm => {
                this.numerosAmm.next(numerosAmm);
            });
    }

}
