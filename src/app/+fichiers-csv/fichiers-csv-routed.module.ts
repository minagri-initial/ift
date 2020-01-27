import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule, FormGroupModule } from '@initial/angular-library';

import { FichiersCSVComponent } from './fichiers-csv.component';
import { FichiersCSVRoutingModule } from './fichiers-csv-routing.module';
import { CampagneModule } from '../shared/campagne/campagne.module';
import { CultureModule } from '../shared/culture/culture.module';

@NgModule({
    declarations: [
        FichiersCSVComponent
    ],
    exports: [
        FichiersCSVComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FichiersCSVRoutingModule,
        CampagneModule,
        CultureModule,
        FormsModule,
        ReactiveFormsModule,
        SelectModule,
        FormGroupModule,
    ],
})
export class FichiersCSVRoutedModule { }
