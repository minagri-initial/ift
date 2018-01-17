import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './+home';
import { DosesReferenceComponent } from './+doses-reference';
import { TraitementIftRouteComponent } from './+traitement-ift';
import { MentionsLegalesComponent } from './+mentions-legales';
import { VerifierTraitementIftComponent } from './+verifier-traitement-ift/verifier-traitement-ift.component';
import { BilanIftComponent } from './+bilan-ift/bilan-ift.component';
import { EspacePartenaireComponent } from './+espace-partenaire/espace-partenaire.component';

// Route Configuration
export const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'doses-reference',
        component: DosesReferenceComponent
    },
    {
        path: 'doses-reference/:campagneIdMetier',
        component: DosesReferenceComponent,
    },
    {
        path: 'bilan-ift',
        component: BilanIftComponent
    },
    {
        path: 'bilan-ift/:campagneIdMetier',
        component: BilanIftComponent,
    },
    {
        path: 'traitement-ift',
        component: TraitementIftRouteComponent
    },
    {
        path: 'traitement-ift/:campagneIdMetier',
        component: TraitementIftRouteComponent,
    },
    {
        path: 'verifier-traitement-ift',
        component: VerifierTraitementIftComponent
    },
    {
        path: 'espace-partenaire',
        component: EspacePartenaireComponent
    },
    {
        path: 'mentions-legales',
        component: MentionsLegalesComponent
    }
];

export const appRoutingProviders: any[] = [
];

// Export routes
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
