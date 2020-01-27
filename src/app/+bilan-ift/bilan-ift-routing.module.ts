import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BilanIftComponent } from './bilan-ift.component';

const routes: Routes = [
    {
        path: '',
        component: BilanIftComponent,
    },
    {
        path: ':campagneIdMetier',
        component: BilanIftComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BilanIftRoutingModule { }
