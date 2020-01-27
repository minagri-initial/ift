import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './+home';
import { MentionsLegalesComponent } from './+mentions-legales';
import { EspacePartenaireComponent } from './+espace-partenaire/espace-partenaire.component';

// Route Configuration
export const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent,
        data: {
            title: 'Atelier de calcul - IFT - Indicateur de Fréquence de Traitements phytopharmaceutiques', // affiche max 70 caractères
            meta: `Atelier de calcul de l'IFT : Calculez votre IFT pour votre bilan phytosanitaire avec l’outil
             certifié du ministère` // affiche max 268 caractères
        }
    },
    {
        path: 'doses-reference',
        loadChildren: 'app/+doses-reference/doses-reference-routed.module#DosesReferenceRoutedModule',
        data: {
            title: 'Doses de référence - IFT - Indicateur de Fréquence de Traitements phytopharmaceutiques',
            meta: 'Rechercher la ou les doses de référence IFT qui correspondent à votre culture, à votre produit ou à votre cible.'
        }
    },
    {
        path: 'bilan-ift',
        loadChildren: 'app/+bilan-ift/bilan-ift-routed.module#BilanIftRoutedModule',
        data: {
            title: 'Bilan IFT - IFT - Indicateur de Fréquence de Traitements phytopharmaceutiques',
            meta: 'Réaliser le bilan d’IFT de votre exploitation agricole ou d’un ensemble de parcelles agricoles.',
        }
    },
    {
        path: 'verifier-bilan-ift',
        loadChildren: 'app/+verifier-bilan/verifier-bilan-routed.module#VerifierBilanRoutedModule',
        data: {
            title: 'Vérifier bilan IFT - IFT - Indicateur de Fréquence de Traitements phytopharmaceutiques',
            meta: 'Afficher les informations contenues dans un bilan calculé par nos services.'
        }
    },
    {
        path: 'traitement-ift',
        loadChildren: 'app/+traitement-ift/traitement-ift-routed.module#TraitementIftRoutedModule',
        data: {
            title: 'IFT de traitement - IFT - Indicateur de Fréquence de Traitements phytopharmaceutiques',
            meta: 'Calculer l’IFT de votre traitement phytopharmaceutique.'
        }
    },
    {
        path: 'verifier-traitement-ift',
        loadChildren: 'app/+verifier-traitement-ift/verifier-traitement-ift-routed.module#VerifierTraitementIftRoutedModule',
        data: {
            title: 'Vérifier un IFT - IFT - Indicateur de Fréquence de Traitements phytopharmaceutiques',
            meta: 'Afficher les informations contenues dans la signature électronique d’un IFT calculé par nos services.'
        }
    },
    {
        path: 'espace-partenaire',
        component: EspacePartenaireComponent,
        data: {
            title: 'Espace partenaire - IFT - Indicateur de Fréquence de Traitements phytopharmaceutiques',
            meta: 'Afficher la documentation interactive pour débuter avec les API REST IFT.'
        }
    },
    {
        path: 'faq',
        loadChildren: 'app/+faq/faq-routed.module#FaqRoutedModule',
        data: {
            title: 'F.A.Q. - IFT - Indicateur de Fréquence de Traitements phytopharmaceutiques',
            meta: 'Foire Aux Questions concernant l\'utilisation de l’Indicateur de Fréquence de Traitements phytopharmaceutiques'
        }
    },
    {
        path: 'fichiers-csv',
        loadChildren: 'app/+fichiers-csv/fichiers-csv-routed.module#FichiersCSVRoutedModule',
        data: {
            title: 'Fichiers CSV - IFT - Indicateur de Fréquence de Traitements phytopharmaceutiques',
            meta: 'Télécharger les fichiers CSV des cultures, des cibles, des produits et des doses de référence.'
        }
    },
    {
        path: 'mentions-legales',
        component: MentionsLegalesComponent,
        data: {
            title: 'Mentions légales - IFT - Indicateur de Fréquence de Traitements phytopharmaceutiques',
            meta: 'Mentions légales concernant l\'utilisation de l’Indicateur de Fréquence de Traitements phytopharmaceutiques'
        }
    }
];

export const appRoutingProviders: any[] = [
];

// Export routes
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
