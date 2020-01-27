import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectModule, FormGroupModule } from '@initial/angular-library';
import { ModalModule as BsModalModule } from 'ngx-bootstrap/modal';

import { SHARED_BUSINESS_MODULES } from '../index';
import { ModalModule } from '../modal/modal.module';
import { GaugeModule } from '../gauge/gauge.module';

import { TraitementIftComponent } from './traitement-ift.component';
import { TraitementIftService } from './traitement-ift.service';

@NgModule({
    declarations: [
        TraitementIftComponent
    ],
    exports: [
        TraitementIftComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        FormGroupModule,
        ModalModule,
        GaugeModule,
        ...SHARED_BUSINESS_MODULES
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        FormGroupModule,
        ModalModule,
        GaugeModule,
        ...SHARED_BUSINESS_MODULES
    ],
    providers: [
        TraitementIftService,
    ]
})
export class TraitementIftDomainModule { }
