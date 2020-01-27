import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GaugeComponent } from './gauge.component';

@NgModule({
    declarations: [
        GaugeComponent
    ],
    exports: [
        GaugeComponent
    ],
})
export class GaugeModule { }
