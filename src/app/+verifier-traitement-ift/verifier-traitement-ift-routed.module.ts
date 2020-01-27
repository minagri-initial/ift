import { NgModule } from '@angular/core';

import { VerifierTraitementIftComponent } from './verifier-traitement-ift.component';
import { TraitementIftDomainModule } from '../shared/traitement-ift';
import { VerifierTraitementIftRoutingModule } from './verifier-traitement-ift-routing.module';

@NgModule({
    declarations: [
        VerifierTraitementIftComponent
    ],
    exports: [
        VerifierTraitementIftComponent
    ],
    imports: [
        TraitementIftDomainModule,
        VerifierTraitementIftRoutingModule
    ],
})
export class VerifierTraitementIftRoutedModule { }
