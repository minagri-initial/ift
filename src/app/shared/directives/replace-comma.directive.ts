import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[appReplaceComma]'
})
export class ReplaceCommaDirective {

    constructor(private el: ElementRef, private control: NgControl) { }

    @HostListener('input', ['$event']) onEvent($event) {
        const input = this.el.nativeElement.value.replace(',', '.');
        this.control.control.setValue(input);
    }
}
