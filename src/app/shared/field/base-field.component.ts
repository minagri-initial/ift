import { ControlValueAccessor, NgModel } from '@angular/forms';
import { validate, ValidatorArray, AsyncValidatorArray } from './field.validator';
import { Observable } from 'rxjs/Observable';
import { HostBinding } from '@angular/core';


export abstract class BaseFieldComponent<T> implements ControlValueAccessor {
    private innerValue: T;

    @HostBinding('class') classes = 'form-field';

    protected abstract model: NgModel;

    private changed = new Array<(value: T) => void>();
    private touched = new Array<() => void>();

    constructor(
        private validators: ValidatorArray,
        private asyncValidators: AsyncValidatorArray) {
    }

    get value(): T {
        return this.innerValue;
    }


    set value(value: T) {
        if (this.innerValue !== value) {
            this.innerValue = value;
            this.changed.forEach(f => f(value));
        }
        this.touch();
    }


    touch() {
        this.touched.forEach(f => f());
    }


    writeValue(value: T) {
        this.innerValue = value;
    }


    registerOnChange(fn: (value: T) => void) {
        this.changed.push(fn);
    }


    registerOnTouched(fn: () => void) {
        this.touched.push(fn);
    }

    validate() {
        return validate(this.validators, this.asyncValidators)(this.model.control);
    }

    protected get invalid(): Observable<boolean> {
        return this.validate().map(v => Object.keys(v || {}).length > 0);
    }

}
