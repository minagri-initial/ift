import { Component, OnInit, HostListener, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Gauge } from './gauge';

@Component({
    selector: 'app-gauge',
    templateUrl: './gauge.component.html',
    styleUrls: ['./gauge.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GaugeComponent implements OnInit, OnChanges {

    @Input()
    public percentage = 100;

    private gauge;

    onChanges = new ReplaySubject<SimpleChanges>(1);

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        this.onChanges.next(changes);
    }

    ngOnInit() {

        this.gauge = new Gauge('.chart-gauge');

        this.onChanges.subscribe((changes: SimpleChanges) => {
            // only when inited
            this.gauge.moveTo(this.percentage);
        });
    }


}
