import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectModule, FormGroupModule } from '@initial/angular-library';
import { ModalModule } from '../modal/modal.module';

import { TypeTraitementFieldComponent } from './type-traitement-field.component';
import { TypeTraitementService } from './type-traitement.service';

@NgModule({
    declarations: [
        TypeTraitementFieldComponent
    ],
    exports: [
        TypeTraitementFieldComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        FormGroupModule,
        ModalModule
    ],
    providers: [
        TypeTraitementService
    ]
})
export class TypeTraitementModule { }
