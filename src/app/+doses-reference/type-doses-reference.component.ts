import { Component, OnInit, Input, ViewChild, Inject, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
    selector: 'app-type-doses-reference',
    templateUrl: './type-doses-reference.component.html',
    styleUrls: ['./type-doses-reference.component.scss']
})
export class TypeDosesReferenceComponent implements OnInit {

    @Input()
    parent: FormGroup;

    typeDoseList = [
        {
            libelle: 'Toutes les doses de référence',
            value: 'all'
        },
        {
            libelle: 'A la cible uniquement',
            value: 'cible'
        },
        {
            libelle: 'A la culture uniquement',
            value: 'culture'
        }
    ];

    @ViewChild(ModalComponent) modalComponent: ModalComponent;

    info1 = 'Il existe deux types de doses de référence : les doses de référence à la cible et les doses de référence à la culture.';
    info2 = 'Les doses de référence à la cible sont définies pour chaque produit, culture et cible pouvant être visée par le traitement. Elles correspondent à la plus grande dose homologuée.';
    info3 = 'Les doses de référence à la culture sont définies pour chaque produit et culture. Elles correspondent à la plus petite des doses de référence à la cible définies pour le produit et la culture correspondants.';
    info4 = 'Les doses de référence à la cible permettent de calculer un IFT plus proche de la réalité. Mais elles requièrent un niveau d\'information supplémentaire, à savoir la cible visée par le traitement, qu\'il convient donc de renseigner dans le cahier d\'enregistrement des pratiques.';

    constructor() { }

    ngOnInit() { }

    get typeDosesReference() {
        return this.parent.get('typeDosesReference');
    }

    showInfo() {
        this.modalComponent.showInfo();
    }
}
