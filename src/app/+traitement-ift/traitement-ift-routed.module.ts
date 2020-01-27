import { NgModule } from '@angular/core';

import { TraitementIftRouteComponent } from './traitement-ift-route.component';
import { TraitementIftDomainModule } from '../shared/traitement-ift';
import { TraitementIftRoutingModule } from './traitement-ift-routing.module';

@NgModule({
    declarations: [
        TraitementIftRouteComponent
    ],
    exports: [
        TraitementIftRouteComponent
    ],
    imports: [
        TraitementIftDomainModule,
        TraitementIftRoutingModule
    ],
})
export class TraitementIftRoutedModule { }
