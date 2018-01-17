import { Component, OnChanges, Input, Output, AfterViewInit, SimpleChanges, ElementRef, EventEmitter, OnInit, Optional, Host } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ControlContainer } from '@angular/forms';
import { latinize, latinizeRegexp } from './select-utils';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import { AfterViewChecked } from '@angular/core/src/metadata/lifecycle_hooks';
import { AbstractControl } from '@angular/forms/src/model';


@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: SelectComponent, multi: true }
    ]
})
export class SelectComponent implements ControlValueAccessor, OnChanges, OnInit, AfterViewChecked {

    term: string;
    _denormalizedRegexp: RegExp;
    _list = [];
    filteredList = [];

    ctrl: AbstractControl;
    parentControl: AbstractControl;
    ctrlSub: Subscription;

    isLoading = false;

    @Input() list: Observable<Array<any>> | Array<any>;
    @Input() optionField: string;
    @Input() optionLimit = 7;
    @Input() name: string;
    @Input() required: boolean;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() filter = true;

    @Output() onTermChanged: EventEmitter<string> = new EventEmitter();
    onTermChangedSubject: Subject<string> = new Subject();
    @Output() onSelected: EventEmitter<string> = new EventEmitter();

    dropdownVisible = false;
    private itemIndex = 0;
    private isDirty = false;

    propagateChange = (_: any) => { };
    propagateTouched = () => { };

    constructor( @Optional() private controlContainer: ControlContainer) {
        this.ctrl = new FormControl('');
    }

    ngOnInit() {
        this.onTermChangedSubject
            .debounceTime(200)
            .distinctUntilChanged()
            .subscribe((term) => {
                this.onTermChanged.emit(term);
            });
    }

    ngAfterViewChecked() {
        if (this.controlContainer && !this.parentControl) {
            this.parentControl = this.controlContainer.control.get(this.name);
            if (this.parentControl) {
                const self = this;
                const origFunc = this.parentControl.markAsPristine;

                this.parentControl.markAsPristine = function () {
                    origFunc.apply(this, arguments);
                    self.ctrl.markAsPristine();
                };

                this.parentControl.markAsDirty = function () {
                    origFunc.apply(this, arguments);
                    self.ctrl.markAsDirty();
                };

                this.parentControl.markAsUntouched = function () {
                    origFunc.apply(this, arguments);
                    self.ctrl.markAsUntouched();
                };

                this.parentControl.markAsTouched = function () {
                    origFunc.apply(this, arguments);
                    self.ctrl.markAsTouched();
                };
            }

        }
    }

    // TODO : if list changed and selection not in list, remove selection
    ngOnChanges(changes: SimpleChanges) {
        if (changes.hasOwnProperty('list')) {
            if (changes.list.currentValue instanceof Observable) {
                (this.list as Observable<Array<any>>).subscribe((newList) => {
                    this.isLoading = false;
                    this._list = newList;
                    this.filteredList = this._list;
                    this.denormalizeRegexp(this.term);
                });
            } else {
                this._list = changes.list.currentValue;
                this.filterList(this.term);

            }

        }
    }

    writeValue(value: any): void {
        this.term = value ? value[this.optionField] : '';
        this.filterList(this.term);
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.propagateTouched = fn;
    }

    public inputElKeyHandler(evt: any) {
        const totalNumItem = this.filteredList.length;

        switch (evt.keyCode) {
            case 8: // Backspace, display auto complete
                this.dropdownVisible = true;
                break;
            case 27: // ESC, hide auto complete
                this.dropdownVisible = false;
                break;

            case 37: // LEFT
            case 38: // UP
                // select the previous li el
                evt.preventDefault();
                this.itemIndex = (totalNumItem + this.itemIndex - 1) % totalNumItem;
                break;

            case 39: // RIGHT
            case 40: // DOWN
                // select the next li el or the first one
                evt.preventDefault();
                this.itemIndex = (totalNumItem + this.itemIndex + 1) % totalNumItem;
                break;

            case 9: // TAB, choose item
                if (this.filteredList.length > 0) {
                    this.selectOne(this.filteredList[this.itemIndex]);
                }
                break;

            case 13: // ENTER, choose it!!

                evt.preventDefault();
                if (this.filteredList.length > 0) {

                    this.selectOne(this.filteredList[this.itemIndex]);
                    // Blur input
                    evt.target.blur();
                }
                break;
            default:
                this.dropdownVisible = true;
        }

    }

    private termChanged(term) {
        this.itemIndex = 0;
        this.isDirty = true;
        this.onTermChangedSubject.next(term);
        this.filterList(term);
    }

    private filterList(term: string) {
        if (this.list instanceof Array && this.filter) {
            this.filteredList = this._list ? this._list.filter((listItem) => this.match(listItem, term))
                .slice(0, this.optionLimit) : [];

            this.denormalizeRegexp(term);

        } else if (this._list && !this.filter) {
            // Data is not filtered
            this.filteredList = this._list;
        }

    }

    private match(item: any, term) {
        const itemField = this.normalize(item[this.optionField]);
        const searchTerm = this.normalize(term);
        return itemField.startsWith(searchTerm) ||
            itemField.includes(' ' + searchTerm);
    }

    private normalize(term: string) {
        return latinize(term).toLowerCase();
    }

    private denormalizeRegexp(term: string) {
        const latinizedRegexp = latinizeRegexp(this.normalize(term));
        this._denormalizedRegexp = new RegExp(`^${latinizedRegexp}|\ ${latinizedRegexp}`, 'gi');
    }

    public selectOne(item) {
        this.unsubscribeTermChanged();
        this.dropdownVisible = false;
        this.isDirty = false;

        // Update the selected term
        this.term = item[this.optionField];
        this.filterList(this.term);
        this.propagateChange(item);
        this.onTermChangedSubject.next(this.term);
        this.onSelected.emit(item);
    }

    public onBlur(event: any) {
        this.unsubscribeTermChanged();
        this.dropdownVisible = false;

        if (this.isDirty) {
            // Check if term exists in the list
            const itemIdx = this.filteredList.findIndex((item) => item[this.optionField] === this.term);

            if (itemIdx < 0) {
                this.term = '';
                this.propagateChange(null);
                this.termChanged(this.term);
                this.onSelected.emit(null);
            } else {
                this.selectOne(this.filteredList[itemIdx]);
            }
        }
        this.propagateTouched();
    }

    public onFocus(event) {
        this.dropdownVisible = true;
        const itemIdx = this.filteredList.findIndex((item) => item[this.optionField] === this.term);
        if (itemIdx >= 0) {
            this.itemIndex = itemIdx;
        }
        this.subscribeTermChanged();
    }

    private subscribeTermChanged() {
        if (!this.ctrlSub) {
            this.ctrlSub = this.ctrl.valueChanges.subscribe((term) => {
                if (this.list && this.list instanceof Observable) {
                    this.isLoading = true;
                }
                this.termChanged(term);
            });
        }
    }

    private unsubscribeTermChanged() {
        if (this.ctrlSub) {
            this.ctrlSub.unsubscribe();
            this.ctrlSub = undefined;
        }
    }

    public highlight(content) {
        if (!this._denormalizedRegexp) {
            return content;
        }
        return content.replace(this._denormalizedRegexp, match => {
            return '<span class="highlight">' + match + '</span>';
        });
    }
}

