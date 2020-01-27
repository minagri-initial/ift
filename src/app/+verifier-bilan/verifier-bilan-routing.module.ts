import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifierBilanComponent } from './verifier-bilan.component';

const routes: Routes = [
    {
        path: ':id',
        component: VerifierBilanComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifierBilanRoutingModule { }
