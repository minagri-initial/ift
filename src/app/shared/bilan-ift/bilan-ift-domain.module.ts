import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BarChartModule } from '@swimlane/ngx-charts';

import { BilanIftService } from './bilan-ift.service';
import { BilanTableCellComponent } from './bilan-table-cell.component';
import { ShareBilanModalComponent } from './share-bilan-modal.component';
import { UpdateBilanModalComponent } from './update-bilan-modal.component';
import { ParcelleModalComponent } from './parcelle-modal.component';
import { TraitementIftModalComponent } from './traitement-ift-modal.component';
import { ListeParcellesCultiveesComponent } from './liste-parcelles-cultivees.component';
import { SyntheseComponent } from './synthese.component';

import { IftDBService } from '../db/ift-db.service';
import { TraitementIftDomainModule } from '../traitement-ift';

@NgModule({
    declarations: [
        ListeParcellesCultiveesComponent,
        SyntheseComponent,
        BilanTableCellComponent,
        ShareBilanModalComponent,
        UpdateBilanModalComponent,
        ParcelleModalComponent,
        TraitementIftModalComponent
    ],
    exports: [
        ListeParcellesCultiveesComponent,
        SyntheseComponent,
        TraitementIftDomainModule
    ],
    entryComponents: [
        ShareBilanModalComponent,
        UpdateBilanModalComponent,
        ParcelleModalComponent,
        TraitementIftModalComponent
    ],
    imports: [
        TabsModule.forRoot(),
        BsDatepickerModule.forRoot(),
        BarChartModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatMenuModule,
        TraitementIftDomainModule,
    ],
    providers: [
        BilanIftService,
        IftDBService
    ]
})
export class BilanIftDomainModule { }
