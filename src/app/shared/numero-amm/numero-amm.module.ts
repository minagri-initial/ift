import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectModule, FormGroupModule } from '@initial/angular-library';
import { ModalModule } from '../modal/modal.module';

import { NumeroAmmFieldComponent } from './numero-amm-field.component';
import { NumeroAmmService } from './numero-amm.service';
import { ProduitFieldComponent } from './produit-field.component';
import { ProduitService } from './produit.service';

@NgModule({
    declarations: [
        NumeroAmmFieldComponent,
        ProduitFieldComponent
    ],
    exports: [
        NumeroAmmFieldComponent,
        ProduitFieldComponent
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
        NumeroAmmService,
        ProduitService
    ]
})
export class NumeroAmmModule { }
