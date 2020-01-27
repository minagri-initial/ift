import { Component, OnInit, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    @Input() headerTitle: string;

    visible = false;
    previousFocus;

    constructor(
        private _el: ElementRef
    ) { }

    ngOnInit() { }

    focus(query) {
        const focusedElement = this._el.nativeElement.querySelector(query);
        focusedElement.focus();
    }

    hide() {
        this.visible = false;
        if (this.previousFocus) {
            this.previousFocus.focus();
            this.previousFocus = undefined;
        }
    }

    public showInfo() {
        this.previousFocus = document.activeElement;
        this.visible = true;
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: any) {
        if (event.keyCode === 27) { // ECHAP
            this.hide();
        }
    }

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        if (targetElement.id === 'tooltip-message-overlay') {
            this.hide();
        }
    }
}
