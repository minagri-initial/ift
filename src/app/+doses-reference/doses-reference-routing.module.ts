import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DosesReferenceComponent } from './doses-reference.component';

const routes: Routes = [
    {
        path: '',
        component: DosesReferenceComponent,
    },
    {
        path: ':campagneIdMetier',
        component: DosesReferenceComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DosesReferenceRoutingModule { }
