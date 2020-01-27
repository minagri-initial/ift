import { NgModule } from '@angular/core';

import { BilanIftDomainModule } from '../shared/bilan-ift';
import { VerifierBilanComponent } from './verifier-bilan.component';
import { VerifierBilanRoutingModule } from './verifier-bilan-routing.module';

@NgModule({
    declarations: [
        VerifierBilanComponent
    ],
    exports: [
        VerifierBilanComponent
    ],
    imports: [
        BilanIftDomainModule,
        VerifierBilanRoutingModule
    ],
})
export class VerifierBilanRoutedModule { }
