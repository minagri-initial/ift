import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, Optional, Inject, ViewChild } from '@angular/core';
import { Culture } from '../culture/culture.model';
import { Campagne } from '../campagne/campagne.model';
import { NumeroAmm } from '../numero-amm';
import { Cible } from './cible.model';
import { CibleService } from './cible.service';
import { BaseFieldComponent } from '../field/base-field.component';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, NG_ASYNC_VALIDATORS, NgModel } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'app-cible-field',
    templateUrl: './cible-field.component.html',
    styleUrls: ['../field/field.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: CibleFieldComponent, multi: true }
    ]
})
export class CibleFieldComponent extends BaseFieldComponent<Culture> implements OnChanges, AfterViewInit {

    cibles: BehaviorSubject<Cible[]> = new BehaviorSubject([]);
    term: string = null;

    @ViewChild(NgModel) model: NgModel;

    @Input()
    campagne: Campagne;

    @Input()
    culture: Culture;

    @Input()
    numeroAmm: NumeroAmm;

    constructor(
        @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
        @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
        private cibleService: CibleService
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

    refreshList() {
        this.cibleService.query(this.campagne, this.culture, this.numeroAmm, this.term, 7)
            .subscribe(cibles => {
                this.cibles.next(cibles);
            });
    }

}
