import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NumberValidatorDirective } from './number-validator.directive';
import { ReplaceCommaDirective } from './replace-comma.directive';

@NgModule({
    declarations: [
        NumberValidatorDirective,
        ReplaceCommaDirective
    ],
    exports: [
        NumberValidatorDirective,
        ReplaceCommaDirective
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
})
export class DirectivesModule { }
