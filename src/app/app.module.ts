import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';

import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material';
import { MatRadioModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';

import { environment } from '../environments/environment';
import { API_URL, API_SEGMENT, SWAGGER_URL, SWAGGER_SEGMENT } from './app.config';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routes';
import { FooterComponent, NavbarComponent } from './layout';
import { HomeComponent } from './+home';
import { DosesReferenceComponent } from './+doses-reference';
import { TraitementIftComponent, TraitementIftRouteComponent, TraitementIftModalComponent, TraitementIftService } from './+traitement-ift';
import { MentionsLegalesComponent } from './+mentions-legales';

import { SHARED_COMPONENTS, SHARED_SERVICES} from './shared';
import { VerifierTraitementIftComponent } from './+verifier-traitement-ift/verifier-traitement-ift.component';
import { VerifierTraitementIftService } from './+verifier-traitement-ift/verifier-traitement-ift.service';
import { BilanIftComponent, BilanIftService } from './+bilan-ift';
import { EspacePartenaireComponent } from './+espace-partenaire/espace-partenaire.component';
import { IftDBService } from './shared/db/ift-db.service';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        NavbarComponent,
        HomeComponent,
        DosesReferenceComponent,
        TraitementIftComponent,
        TraitementIftRouteComponent,
        TraitementIftModalComponent,
        BilanIftComponent,
        VerifierTraitementIftComponent,
        MentionsLegalesComponent,
        EspacePartenaireComponent,
        ...SHARED_COMPONENTS
    ],
    entryComponents: [
        TraitementIftModalComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        HttpClientModule,
        routing,
        MatSliderModule,
        MatCardModule,
        MatCheckboxModule,
        MatRadioModule,
        MatButtonModule,
        CollapseModule.forRoot(),
        BsDropdownModule.forRoot(),
        TypeaheadModule.forRoot(),
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot()
    ],
    providers: [
        appRoutingProviders,
        { provide: API_URL, useValue: environment.backendUrl },
        { provide: SWAGGER_URL, useValue: environment.swaggerUrl},
        ...SHARED_SERVICES,
        TraitementIftService,
        BilanIftService,
        IftDBService,
        VerifierTraitementIftService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
