import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-star-slider',
    templateUrl: './star-slider.component.html',
    styleUrls: ['./star-slider.component.scss']
})
export class StarSliderComponent implements OnInit {

    @Input() id: string;
    @Input() title: string;
    @Output() change = new EventEmitter<number>();

    nbEtoilesSelectionnees = 0;
    max = 5;
    fakeArray = new Array(this.max);

    constructor() { }

    ngOnInit() {
    }

    rate(value: number) {

        if (value <= this.max && value > 0) {
            this.nbEtoilesSelectionnees = value;
            this.change.emit(this.nbEtoilesSelectionnees);
        }
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: any) {
        if (event.keyCode === 37 || event.keyCode === 38) { // LEFT || UP
            this.rate(this.nbEtoilesSelectionnees - 1);
        } else if (event.keyCode === 39 || event.keyCode === 40) { // RIGHT || DOWN
            this.rate(this.nbEtoilesSelectionnees + 1);
        }
    }

}
