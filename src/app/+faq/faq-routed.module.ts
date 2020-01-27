import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatExpansionModule } from '@angular/material/expansion';

import { FaqComponent } from './faq.component';
import { FaqRoutingModule } from './faq-routing.module';

@NgModule({
    declarations: [
        FaqComponent
    ],
    exports: [
        FaqComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatExpansionModule,
        FaqRoutingModule
    ],
})
export class FaqRoutedModule { }
