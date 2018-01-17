import {
    Component, Input, OnChanges, SimpleChanges,
    ViewChild, Optional, Inject, AfterViewInit
} from '@angular/core';
import { Culture } from './culture.model';
import { CultureService } from './culture.service';
import { Campagne } from '../campagne/campagne.model';
import { NumeroAmm } from '../numero-amm/numero-amm.model';
import { Cible } from '../cible/cible.model';
import { BaseFieldComponent } from '../field/base-field.component';
import { NG_VALUE_ACCESSOR, NgModel, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
    selector: 'app-culture-field',
    templateUrl: './culture-field.component.html',
    styleUrls: ['../field/field.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: CultureFieldComponent, multi: true }
    ]
})
export class CultureFieldComponent extends BaseFieldComponent<Culture> implements OnChanges, AfterViewInit {

    cultures: BehaviorSubject<Culture[]> = new BehaviorSubject([]);
    term: string = null;

    @ViewChild(NgModel) model: NgModel;

    @Input()
    campagne: Campagne;

    @Input()
    numeroAmm: NumeroAmm;

    @Input()
    cible: Cible;

    @Input()
    required = false;

    constructor(
        @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
        @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
        private cultureService: CultureService
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

        this.cultureService.query(this.campagne, this.numeroAmm, this.cible, this.term, 7)
            .subscribe(cultures => {
                this.cultures.next(cultures);
            });
    }

}
