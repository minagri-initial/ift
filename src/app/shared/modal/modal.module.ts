import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule as BsModalModule, BsModalService } from 'ngx-bootstrap/modal';

import { ModalComponent } from './modal.component';
import { TitreModalComponent } from './titre-modal.component';

@NgModule({
    declarations: [
        ModalComponent,
        TitreModalComponent
    ],
    exports: [
        ModalComponent,
        TitreModalComponent,
        BsModalModule
    ],
    entryComponents: [
        TitreModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BsModalModule
    ],
    providers: [
        BsModalService
    ]
})
export class ModalModule { }
