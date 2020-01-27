import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

import { SelectModule } from '@initial/angular-library';

import { SHARED_BUSINESS_MODULES } from '../shared/index';
import { ModalModule } from '../shared/modal/modal.module';

import { DosesReferenceRoutingModule } from './doses-reference-routing.module';
import { DosesReferenceComponent } from './doses-reference.component';
import { TypeDosesReferenceComponent } from './type-doses-reference.component';

@NgModule({
    declarations: [
        DosesReferenceComponent,
        TypeDosesReferenceComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        ModalModule,
        ...SHARED_BUSINESS_MODULES,
        MatCardModule,
        MatCheckboxModule,
        MatRadioModule,
        DosesReferenceRoutingModule
    ],
})
export class DosesReferenceRoutedModule { }
