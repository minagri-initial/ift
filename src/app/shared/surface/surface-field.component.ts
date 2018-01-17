import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, Optional, Inject } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { BaseFieldComponent } from '../field/base-field.component';
import { NG_VALUE_ACCESSOR, NgModel, NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Traitement } from '../traitement/index';

@Component({
    selector: 'app-surface-field',
    templateUrl: './surface-field.component.html',
    styleUrls: ['./surface-field.component.scss', '../../shared/field/field.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: SurfaceFieldComponent, multi: true }
    ]
})
export class SurfaceFieldComponent extends BaseFieldComponent<number> {

    surfaceTraiteeByPercent = true;

    @ViewChild(NgModel) model: NgModel;
    @Input() traitement: Traitement;

    surfaceTraitee;
    surfaceTotale;

    constructor(
        @Optional() @Inject(NG_VALIDATORS) validators: Array<any>,
        @Optional() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: Array<any>
    ) {
        super(validators, asyncValidators);
    }

    public onSliderChange(event: any) {
        let surface = event;
        if (event.value) {
            surface = event.value;
        }
        this.value = surface;
    }

    public toggleSurfaceTraiteeByPercent(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.surfaceTraitee = null;
        this.surfaceTotale = null;
        this.surfaceTraiteeByPercent = !this.surfaceTraiteeByPercent;
    }

    public dataChanged(event: Event) {
        if (this.surfaceTraitee && this.surfaceTotale) {
            this.value = this.surfaceTraitee * 100 / this.surfaceTotale;
        }
    }
}
