import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BilanIftComponent } from './bilan-ift.component';
import { BilanIftRoutingModule } from './bilan-ift-routing.module';
import { BilanIftDomainModule } from '../shared/bilan-ift/bilan-ift-domain.module';


@NgModule({
    declarations: [
        BilanIftComponent,
    ],
    exports: [
        BilanIftComponent,
    ],
    imports: [
        BilanIftDomainModule,
        BilanIftRoutingModule
    ]
})
export class BilanIftRoutedModule { }
