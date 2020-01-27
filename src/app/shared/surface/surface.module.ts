import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormGroupModule } from '@initial/angular-library';
import { MatSliderModule } from '@angular/material/slider';

import { SurfaceFieldComponent } from './surface-field.component';
import { DirectivesModule } from '../directives/directives.modules';

@NgModule({
    declarations: [
        SurfaceFieldComponent
    ],
    exports: [
        SurfaceFieldComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FormGroupModule,
        MatSliderModule,
        DirectivesModule
    ],
})
export class SurfaceModule { }
