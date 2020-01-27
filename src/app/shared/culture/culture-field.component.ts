import {
    Component, Input, ViewChild, OnInit, OnChanges, SimpleChanges,
    AfterContentInit, EventEmitter, OnDestroy
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

import { Culture } from './culture.model';
import { CultureService } from './culture.service';
import { ModalComponent } from '../modal/modal.component';
import { hasRequiredField } from '../field/field.validator';

import { Messages } from '../messages';
import { NumeroAmm } from '../numero-amm/numero-amm.model';

@Component({
    selector: 'app-culture-field',
    templateUrl: './culture-field.component.html',
    styleUrls: ['../field/field.component.scss']
})
export class CultureFieldComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {

    @Input() parent: FormGroup;
    @Input() numerosAmm: NumeroAmm[];

    searchCultures = new EventEmitter<string>();
    cultures: Culture[];
    subscription: Subscription;
    term: string;
    msg = Messages;

    @ViewChild(ModalComponent) modalComponent: ModalComponent;
    info1 = 'Votre culture n\'est pas présente ? Regardez les noms commençant par « autres ».';
    info2 = `Vous pouvez également consulter la liste des cultures sur lesquelles sont définies
        les doses de référence avant de faire votre recherche.`;

    constructor(private cultureService: CultureService) { }

    get culture() {
        return this.parent.get('culture');
    }

    public isRequired() {
        return hasRequiredField(this.culture);
    }

    get campagne() {
        return this.parent.get('campagne');
    }

    get cible() {
        return this.parent.get('cible');
    }

    ngOnInit() {
        this.refreshCultures();

        this.searchCultures
            .distinctUntilChanged()
            .debounceTime(200)
            .subscribe(term => {
                this.term = term;
                this.getCultures(term);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.refreshCultures();
    }

    ngAfterContentInit() {
        if (this.campagne) {
            this.campagne.valueChanges
                .subscribe(() => this.refreshCultures());
        }

        if (this.cible) {
            this.cible.valueChanges
                .subscribe(() => this.refreshCultures());
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    refreshCultures() {
        this.getCultures(this.term);
    }

    getCultures(filter?: string) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.cultureService.query(
            this.campagne ? this.campagne.value : null, this.numerosAmm, this.cible ? this.cible.value : null, filter, 7)
            .subscribe((res: Culture[]) => {
                this.cultures = res;
            }, err => {
                this.cultures = [];
            });
    }

    showInfo() {
        this.modalComponent.showInfo();
    }

}
