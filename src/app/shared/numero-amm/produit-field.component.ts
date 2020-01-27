import {
    Component, Input, Output, EventEmitter, OnInit, AfterContentInit,
    OnDestroy, ViewChild, Optional, Inject
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

import { Produit } from './produit.model';
import { ProduitService } from './produit.service';
import { ModalComponent } from '../modal/modal.component';
import { hasRequiredField } from '../field/field.validator';

import { Messages } from '../messages';

@Component({
    selector: 'app-produit-field',
    templateUrl: './produit-field.component.html',
    styleUrls: ['./produit-field.component.scss', '../field/field.component.scss']
})
export class ProduitFieldComponent implements OnInit, AfterContentInit, OnDestroy {

    @Input() parent: FormGroup;

    searchProduits = new EventEmitter<string>();
    produits: Produit[];
    term: string;
    msg = Messages;
    subscription: Subscription;

    @ViewChild(ModalComponent) modalComponent: ModalComponent;
    info1 = `Vérifiez tout d'abord si le produit pour lequel vous cherchez à calculer
     l'IFT est bien un produit phytopharmaceutique. La base Ephy de l'Anses peut vous aider
      en ce sens. Il est rappelé que les adjuvants n'entrent pas en compte dans le calcul
       de l'IFT.`;
    info2 = `Essayez également de rechercher le produit par son numéro d'AMM en cliquant
     sur « Votre produit n'est pas dans la liste ?». Le numéro d'AMM est une information
      figurant sur l'emballage ou la fiche du produit.`;
    info3 = `Si vous ne retrouvez toujours pas le produit, il est toujours possible de poursuivre
    la saisie des informations relatives au calcul de l'IFT du traitement, en précisant notamment dans
    le champ « commentaire » le nom et/ou le numéro d'AMM du produit utilisé. Le produit étant absent
    du référentiel de calcul, l'IFT du traitement sera à 1, le cas échéant, corrigé par le pourcentage
    de surface traitée.`;

    constructor(private produitService: ProduitService) { }

    get produit() {
        return this.parent.get('produit');
    }

    public isRequired() {
        return hasRequiredField(this.produit);
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
        this.refreshProduits();

        this.searchProduits
            .distinctUntilChanged()
            .debounceTime(200)
            .subscribe(term => {
                this.term = term;
                return this.getProduits(term);
            });
    }

    ngAfterContentInit() {
        if (this.campagne) {
            this.campagne.valueChanges
                .subscribe(() => this.refreshProduits());
        }

        if (this.culture) {
            this.culture.valueChanges
                .subscribe(() => this.refreshProduits());
        }

        if (this.cible) {
            this.cible.valueChanges
                .subscribe(() => this.refreshProduits());
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    refreshProduits() {
        this.getProduits(this.term);
    }

    getProduits(filter?: string) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.produitService.query(
            this.campagne ? this.campagne.value : null, this.culture ? this.culture.value : null,
            this.cible ? this.cible.value : null, filter, 7)
            .subscribe((res: Produit[]) => {
                this.produits = res;
            }, err => {
                this.produits = [];
            });
    }

    showInfo() {
        this.modalComponent.showInfo();
    }

}
