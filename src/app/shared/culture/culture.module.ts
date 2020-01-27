import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectModule, FormGroupModule } from '@initial/angular-library';
import { ModalModule } from '../modal/modal.module';

import { CultureFieldComponent } from './culture-field.component';
import { CultureService } from './culture.service';
import { GroupeCulturesService } from './groupe-cultures.service';

@NgModule({
    declarations: [
        CultureFieldComponent
    ],
    exports: [
        CultureFieldComponent
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
        CultureService,
        GroupeCulturesService
    ]
})
export class CultureModule { }
