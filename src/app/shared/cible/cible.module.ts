import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectModule, FormGroupModule } from '@initial/angular-library';
import { ModalModule } from '../modal/modal.module';

import { CibleFieldComponent } from './cible-field.component';
import { CibleService } from './cible.service';

@NgModule({
    declarations: [
        CibleFieldComponent
    ],
    exports: [
        CibleFieldComponent
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
        CibleService
    ]
})
export class CibleModule { }
