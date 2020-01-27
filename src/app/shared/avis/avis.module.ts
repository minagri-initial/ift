import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from '@initial/angular-library';
import { ModalModule } from '../modal/modal.module';

import { AvisComponent } from './avis.component';
import { AvisService } from './avis.service';
import { StarSliderComponent } from './star-slider.component';

@NgModule({
    declarations: [
        AvisComponent,
        StarSliderComponent
    ],
    exports: [
        AvisComponent,
        StarSliderComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        ModalModule
    ],
    providers: [
        AvisService
    ]
})
export class AvisModule { }
