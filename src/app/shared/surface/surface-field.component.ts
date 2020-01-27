import { Component, Input, AfterContentInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { TypeTraitement } from '../type-traitement/index';

@Component({
    selector: 'app-surface-field',
    templateUrl: './surface-field.component.html',
    styleUrls: ['./surface-field.component.scss', '../../shared/field/field.component.scss']
})
export class SurfaceFieldComponent implements AfterContentInit {

    @Input() parent: FormGroup;

    sliderValue = 100;

    constructor() { }

    get facteurDeCorrection() {
        return this.parent.get('facteurDeCorrection');
    }

    get surfaceTraitee() {
        return this.parent.get('surfaceTraitee');
    }

    get surfaceTotale() {
        return this.parent.get('surfaceTotale');
    }

    get traitement() {
        return this.parent.get('typeTraitement');
    }

    isTraitementAvantSemis() {
        return this.traitement.value && this.traitement.value.avantSemis;
    }

    ngAfterContentInit() {
        if (this.surfaceTraitee) {
            this.surfaceTraitee.valueChanges
                .subscribe(() => this.dataChanged());
        }

        if (this.surfaceTotale) {
            this.surfaceTotale.valueChanges
                .subscribe(() => this.dataChanged());
        }

        if (this.facteurDeCorrection) {
            this.sliderValue = this.facteurDeCorrection.value;
            this.facteurDeCorrection.valueChanges
                .subscribe(() => this.sliderValue = this.facteurDeCorrection.value);
        }
    }

    public onSliderChange(event: any) {
        this.facteurDeCorrection.patchValue(event.value);
    }

    public isFacteurDeCorrectionEnabled() {
        return this.facteurDeCorrection.enabled;
    }

    public toggleSurfaceTraiteeByPercent(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.surfaceTraitee.patchValue(null);
        if (!this.surfaceTotale.disabled) {
            this.surfaceTotale.patchValue(null);
        }

        if (!this.isFacteurDeCorrectionEnabled()) {
            this.facteurDeCorrection.enable();
        } else {
            this.facteurDeCorrection.disable();
        }
    }

    public dataChanged() {
        if (this.surfaceTotale.value === '0') {
            this.facteurDeCorrection.patchValue(100);
        } else if (this.surfaceTraitee.value && !isNaN(this.surfaceTraitee.value) &&
            this.surfaceTotale.value && !isNaN(this.surfaceTotale.value)) {
            this.facteurDeCorrection.patchValue(+(this.surfaceTraitee.value * 100 / this.surfaceTotale.value).toFixed(2));
        }
    }
}
