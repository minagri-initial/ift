import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifierTraitementIftComponent } from './verifier-traitement-ift.component';

const routes: Routes = [
    {
        path: '',
        component: VerifierTraitementIftComponent
    },
    {
        path: ':id',
        component: VerifierTraitementIftComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifierTraitementIftRoutingModule { }
