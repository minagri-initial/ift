import {
    Component, Input, EventEmitter, OnInit, AfterContentInit,
    OnDestroy, ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

import { NumeroAmm } from './numero-amm.model';
import { NumeroAmmService } from './numero-amm.service';
import { hasRequiredField } from '../field/field.validator';

import { Messages } from '../messages';

@Component({
    selector: 'app-numero-amm-field',
    templateUrl: './numero-amm-field.component.html',
    styleUrls: ['./numero-amm-field.component.scss', '../field/field.component.scss']
})
export class NumeroAmmFieldComponent implements OnInit, AfterContentInit, OnDestroy {

    @Input() parent: FormGroup;

    searchNumerosAmm = new EventEmitter<string>();
    numerosAmm: NumeroAmm[];
    term: string;
    msg = Messages;
    subscription: Subscription;

    constructor(private numeroAmmService: NumeroAmmService) { }

    get numeroAmm() {
        return this.parent.get('numeroAmm');
    }

    public isRequired() {
        return hasRequiredField(this.numeroAmm);
    }

    get campagne() {
        return this.parent.get('campagne');
    }

    get culture() {
        return this.parent.get('culture');
    }

    get cible() {
        return this.parent.get('cible');
    }

    ngOnInit() {
        this.refreshNumerosAmm();

        this.searchNumerosAmm
            .distinctUntilChanged()
            .debounceTime(200)
            .subscribe(term => {
                this.term = term;
                this.getNumerosAmm(term);
            });
    }

    ngAfterContentInit() {
        if (this.campagne) {
            this.campagne.valueChanges
                .subscribe(() => this.refreshNumerosAmm());
        }

        if (this.culture) {
            this.culture.valueChanges
                .subscribe(() => this.refreshNumerosAmm());
        }

        if (this.cible) {
            this.cible.valueChanges
                .subscribe(() => this.refreshNumerosAmm());
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    refreshNumerosAmm() {
        this.getNumerosAmm(this.term);
    }

    getNumerosAmm(filter?: string) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.numeroAmmService.query(
            this.campagne ? this.campagne.value : null, this.culture ? this.culture.value : null,
            this.cible ? this.cible.value : null, filter, 7)
            .subscribe((res: NumeroAmm[]) => {
                this.numerosAmm = res;
            }, err => {
                this.numerosAmm = [];
            });
    }

}
