import { Component, Input, Output, EventEmitter, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TypeTraitement } from './type-traitement.model';
import { TypeTraitementService } from './type-traitement.service';
import { Subscription } from 'rxjs/Subscription';
import { ModalComponent } from '../modal/modal.component';
import { hasRequiredField } from '../field/field.validator';

@Component({
    selector: 'app-type-traitement-field',
    templateUrl: './type-traitement-field.component.html',
    styleUrls: ['../field/field.component.scss']
})
export class TypeTraitementFieldComponent implements OnInit, OnDestroy {

    @Input() parent: FormGroup;

    @ViewChild(ModalComponent) modalComponent: ModalComponent;
    info = 'Soyez aussi précis que possible dans la description du type de traitement réalisé.';

    traitements: TypeTraitement[];
    subscription: Subscription;

    constructor(private traitementService: TypeTraitementService) { }

    get traitement() {
        return this.parent.get('typeTraitement');
    }

    public isRequired() {
        return hasRequiredField(this.traitement);
    }

    ngOnInit() {
        this.subscription = this.traitementService.list()
            .subscribe(traitements => {
                this.traitements = traitements;
            });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    showInfo() {
        this.modalComponent.showInfo();
    }

}
