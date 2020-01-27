import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
    selector: '[appNumberValidator]',
    providers: [{ provide: NG_VALIDATORS, useExisting: NumberValidatorDirective, multi: true }]
})
export class NumberValidatorDirective implements Validator {
    validate(control: AbstractControl): { [key: string]: any } {
        const pattern = new RegExp(/^[0-9]+([.][0-9]*)?$/);
        const forbidden = control.value && !pattern.test(control.value);
        return forbidden ? { 'numberValidator': { value: control.value } } : null;
    }
}
