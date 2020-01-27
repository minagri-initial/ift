import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TraitementIftRouteComponent } from './traitement-ift-route.component';

const routes: Routes = [
    {
        path: '',
        component: TraitementIftRouteComponent
    },
    {
        path: ':campagneIdMetier',
        component: TraitementIftRouteComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraitementIftRoutingModule { }
