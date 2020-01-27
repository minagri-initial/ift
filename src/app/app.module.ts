import { BrowserModule, Title, Meta } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MatSnackBarModule } from '@angular/material/snack-bar';
//Import matSliderModule is required on a non lazy loaded module to get slide animation
//@see https://github.com/angular/material2/issues/4595
import { MatSliderModule } from '@angular/material/slider';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routes';
import { FooterComponent, NavbarComponent } from './layout';
import { HomeComponent } from './+home';
import { MentionsLegalesComponent } from './+mentions-legales';

import { SelectModule, FormGroupModule } from '@initial/angular-library';

import { SHARED_COMPONENTS, SHARED_SERVICES } from './shared';
import { EspacePartenaireComponent } from './+espace-partenaire/espace-partenaire.component';

import { SHARED_ENTRY_COMPONENTS } from './shared/index';
import { NetworkErrorInterceptorService } from './shared/http/network-error-interceptor.service';

import { AvisModule } from './shared/avis/avis.module';
import { LayoutModule } from './layout/layout.module';
import { CampagneService } from './shared/campagne/campagne.service';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MentionsLegalesComponent,
        EspacePartenaireComponent,
        ...SHARED_COMPONENTS
    ],
    entryComponents: [
        ...SHARED_ENTRY_COMPONENTS
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpModule,
        HttpClientModule,
        ServiceWorkerModule.register('/ift/ngsw-worker.js', { enabled: environment.production }),
        routing,
        LayoutModule,
        AvisModule,
        MatSnackBarModule,
        MatSliderModule
    ],
    providers: [
        Title,
        Meta,
        appRoutingProviders,
        { provide: HTTP_INTERCEPTORS, useClass: NetworkErrorInterceptorService, multi: true },
        CampagneService,
        ...SHARED_SERVICES,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
