import { Component, Input, Output, EventEmitter, OnInit, ViewChild, Optional, Inject } from '@angular/core';
import { Traitement } from './traitement.model';
import { TraitementService } from './traitement.service';
import { BaseFieldComponent } from '../field/base-field.component';
import { NG_VALUE_ACCESSOR, NgModel, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';

@Component({
    selector: 'app-traitement-field',
    templateUrl: './traitement-field.component.html',
    styleUrls: ['../field/field.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: TraitementFieldComponent, multi: true }
    ]
})
export class TraitementFieldComponent extends BaseFieldComponent<Traitement> implements OnInit {

    traitements: Traitement[];

    @ViewChild(NgModel) model: NgModel;

    @Input()
    required = false;

    constructor(
        @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
        @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>,
        private traitementService: TraitementService
    ) {
        super(validators, asyncValidators);
    }

    ngOnInit() {

        this.traitementService.list()
            .subscribe(traitements => {
                this.traitements = traitements;
            });
    }

}
