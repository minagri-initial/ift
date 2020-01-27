import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FichiersCSVComponent } from './fichiers-csv.component';

const routes: Routes = [
    {
        path: '',
        component: FichiersCSVComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FichiersCSVRoutingModule { }
