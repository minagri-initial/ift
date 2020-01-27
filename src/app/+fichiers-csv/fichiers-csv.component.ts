import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormBuilder, Validators, FormGroup, NgModel } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Campagne } from '../shared/campagne/campagne.model';
import { GroupeCulture } from '../shared/culture/culture.model';
import { CampagneService } from '../shared/campagne/campagne.service';
import { GroupeCulturesService } from '../shared/culture/groupe-cultures.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'app-fichiers-csv',
    templateUrl: './fichiers-csv.component.html',
    styleUrls: ['./fichiers-csv.component.scss']
})
export class FichiersCSVComponent implements OnInit, OnDestroy {

    apiUrl: string;
    campagnes: Campagne[];
    groupesCultures: GroupeCulture[];

    formProduits = this.formBuilder.group({
        id: '',
        campagne: [null, Validators.required]
    });

    formDosesReference = this.formBuilder.group({
        id: '',
        campagne: [null, Validators.required],
        groupeCultures: [null, Validators.required]
    });

    constructor(
        private campagneService: CampagneService,
        private groupeCulturesService: GroupeCulturesService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.apiUrl = environment.apiUrl;

        this.campagneService.list().pipe(untilDestroyed(this)).subscribe((campagnes) => {
            this.campagnes = campagnes;
            const activeCampagne = this.campagnes.filter(campagne => campagne.active)[0];
            this.campagneFormProduits.patchValue(activeCampagne);
            this.campagneFormDosesReference.patchValue(activeCampagne);
        });

        this.groupeCulturesService.list().pipe(untilDestroyed(this)).subscribe((groupesCultures) => {
            this.groupesCultures = groupesCultures;
            this.groupeCulturesFormDosesReference.patchValue(this.groupesCultures[0]);
        });
    }

    get campagneFormProduits() {
        return this.formProduits.get('campagne');
    }

    get campagneFormDosesReference() {
        return this.formDosesReference.get('campagne');
    }

    get groupeCulturesFormDosesReference() {
        return this.formDosesReference.get('groupeCultures');
    }

    get produitsUrl() {
        if (this.campagneFormProduits.value) {
            return this.apiUrl + '/produits/' + this.campagneFormProduits.value.idMetier + '/csv';
        } else {
            return '';
        }
    }

    get dosesReferenceUrl() {
        if (this.campagneFormDosesReference.value && this.groupeCulturesFormDosesReference.value) {
            return this.apiUrl + '/doses-reference/' + this.campagneFormDosesReference.value.idMetier + '/'
                + this.groupeCulturesFormDosesReference.value.idMetier + '/csv';
        } else {
            return '';
        }
    }

    ngOnDestroy(){}

}
