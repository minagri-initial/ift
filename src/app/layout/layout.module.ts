import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { FooterComponent } from './footer.component';
import { NavbarComponent } from './navbar.component';

@NgModule({
    declarations: [
        FooterComponent,
        NavbarComponent
    ],
    exports: [
        FooterComponent,
        NavbarComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        CollapseModule.forRoot(),
        BsDropdownModule.forRoot()
    ],
})
export class LayoutModule { }
