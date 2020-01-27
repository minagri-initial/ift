import {
    Component, Input, EventEmitter, OnInit, OnChanges, SimpleChanges,
    AfterContentInit, OnDestroy, ViewChild
} from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { Subscription } from 'rxjs/Subscription';
import { Cible } from './cible.model';
import { CibleService } from './cible.service';
import { ModalComponent } from '../modal/modal.component';
import { hasRequiredField } from '../field/field.validator';

import { Messages } from '../messages';
import { NumeroAmm } from '../numero-amm/numero-amm.model';

@Component({
    selector: 'app-cible-field',
    templateUrl: './cible-field.component.html',
    styleUrls: ['../field/field.component.scss']
})
export class CibleFieldComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {

    @Input() parent: FormGroup;
    @Input() numerosAmm: NumeroAmm[];

    searchCibles = new EventEmitter<string>();
    cibles: Cible[];
    term: string;
    msg = Messages;
    subscription: Subscription;

    @ViewChild(ModalComponent) modalComponent: ModalComponent;

    @Input() info = `Renseigner la cible visée par le traitement permet d\'utiliser
     une dose de référence plus appropriée pour le calcul de l\'IFT.
     Si plusieurs cibles ont été simultanément traitées, il conviendra de
     retenir la cible qui a été déterminante dans le choix de la dose appliquée.`;
    @Input() info2;

    constructor(private cibleService: CibleService) { }

    get cible() {
        return this.parent.get('cible');
    }

    public isRequired() {
        return hasRequiredField(this.cible);
    }

    get campagne() {
        return this.parent.get('campagne');
    }

    get culture() {
        return this.parent.get('culture');
    }

    ngOnInit() {
        this.refreshCibles();

        this.searchCibles
            .distinctUntilChanged()
            .debounceTime(200)
            .subscribe(term => {
                this.term = term;
                this.getCibles(term);
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        this.refreshCibles();
    }

    ngAfterContentInit() {
        if (this.campagne) {
            this.campagne.valueChanges
                .subscribe(() => this.refreshCibles());
        }

        if (this.culture) {
            this.culture.valueChanges
                .subscribe(() => this.refreshCibles());
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    refreshCibles() {
        this.getCibles(this.term);
    }

    getCibles(filter?: string) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.cibleService.query(
            this.campagne ? this.campagne.value : null, this.culture ? this.culture.value : null, this.numerosAmm, filter, 7)
            .subscribe((res: Cible[]) => {
                this.cibles = res;
            }, err => {
                this.cibles = [];
            });
    }

    showInfo() {
        this.modalComponent.showInfo();
    }

}
