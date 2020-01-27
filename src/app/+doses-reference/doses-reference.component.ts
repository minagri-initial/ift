import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DoseReferenceService } from '../shared/dose/dose-reference.service';
import { DosesReferenceSearch } from './doses-reference-search.model';
import { Campagne } from '../shared/campagne/campagne.model';
import { Dose, ProduitDoseReference } from '../shared/dose/dose.model';

import { findIndex } from 'lodash';
import { Form, NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DoseReference } from '../shared/dose';
import { CampagneService } from '../shared/campagne/campagne.service';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
    selector: 'app-doses-reference',
    templateUrl: './doses-reference.component.html',
    styleUrls: ['./doses-reference.component.scss']
})
export class DosesReferenceComponent implements OnInit {

    form: FormGroup = this.formBuilder.group({
        id: '',
        campagne: [null, Validators.required],
        culture: this.formBuilder.group({
            culture: null,
        }),
        numeroAmm: this.formBuilder.group({
            numeroAmm: null,
        }),
        produit: this.formBuilder.group({
            produit: null,
        }),
        cible: this.formBuilder.group({
            cible: null,
        }),
        typeDosesReference: 'all',
        biocontroleUniquement: false
    });

    get campagne() {
        return this.form.get('campagne');
    }

    get biocontroleUniquement() {
        return this.form.get('biocontroleUniquement');
    }

    numeroAmmByProduct = true;
    campagnes: Campagne[];
    dosesReference: ProduitDoseReference[] = [];
    searching = false;
    loading = false;

    loadedPage = -1;
    page = 0;
    noMoreResults = false;
    noResults = false;

    infoCible1 = `Renseigner la cible visée par le traitement permet d\'utiliser
        une dose de référence plus appropriée pour le calcul de l\'IFT.
        Pour retrouver le nom correspondant à la cible, vous pouvez en première
        approche lancer la recherche sans renseigner de cibles puis sélectionner
        la cible correspondante à votre traitement.`;

    infoCible2 = `Si plusieurs cibles ont été simultanément traitées, il conviendra
        de retenir la cible qui a été déterminante dans le choix de la dose appliquée.
        Si la cible du traitement n\'est pas connue ni renseignée dans le cahier
        d\'enregistrement des pratiques, alors il convient de retenir la dose « à la culture ».`;

    @ViewChild(ModalComponent) modalComponent: ModalComponent;

    constructor(private doseReferenceService: DoseReferenceService,
        private route: ActivatedRoute,
        private router: Router,
        private campagneService: CampagneService,
        private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        // Load campagne list first
        this.campagneService.list().subscribe((campagnes) => {
            this.campagnes = campagnes;

            this.route.params.subscribe(params => {
                const campagneIdMetier = params.campagneIdMetier;

                if (!campagneIdMetier) {
                    const activeCampagne = campagnes.find(campagne => campagne.active);
                    this.router.navigate(['/doses-reference', activeCampagne.idMetier]);
                } else {
                    const activeCampagne = campagnes.find(campagne => campagne.idMetier === campagneIdMetier);
                    this.form.patchValue({
                        campagne: activeCampagne
                    });
                }
            });
        });

    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event: any): void {
        const scrollableDiv = document.getElementById('router-outlet');

        if (scrollableDiv) {
            const position = $event.target as HTMLSpanElement;

            const footer = document.getElementById('footer');
            const footerOffset = footer.offsetTop + footer.clientHeight;
            const pageOffset = position['scrollingElement'].scrollTop + position['scrollingElement'].clientHeight;

            if (pageOffset > (footerOffset * 2 / 3) && this.page === this.loadedPage && !this.noMoreResults) {
                this.page++;
                this.queryDosesReference();
            }
        }
    }

    public nextCampagne() {
        this.router.navigate(['/doses-reference', this.campagnes[this.campagneIndex + 1].idMetier]);
    }

    public previousCampagne() {
        this.router.navigate(['/doses-reference', this.campagnes[this.campagneIndex - 1].idMetier]);
    }

    public get campagneIndex() {
        return findIndex(this.campagnes, this.form.value.campagne);
    }

    public onSubmit() {
        if (this.form.valid) {
            this.page = 0;
            this.loadedPage = -1;
            this.noMoreResults = false;
            this.noResults = false;
            this.dosesReference = [];
            this.queryDosesReference();
        }
    }

    public toggleNumeroAmmByProduct(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.form.value.numeroAmm = null;
        this.form.value.produit = null;
        this.numeroAmmByProduct = !this.numeroAmmByProduct;

    }

    public queryDosesReference() {
        if (this.page === 0) {
            this.searching = true;
        } else {
            this.loading = true;
        }

        this.doseReferenceService.query(
            this.page,
            this.form.value.typeDosesReference,
            this.form.value.biocontroleUniquement,
            this.form.value.campagne,
            this.form.get('culture').value.culture,
            this.form.get('numeroAmm').value.numeroAmm,
            this.form.get('produit').value.produit,
            this.form.get('cible').value.cible)
            .subscribe((doseReferences: ProduitDoseReference[]) => {
                this.dosesReference = this.dosesReference.concat(doseReferences);
                this.searching = false;
                this.loading = false;
                this.loadedPage++;
                if (doseReferences.length === 0) {
                    this.noMoreResults = true;
                    if (this.page === 0) {
                        this.noResults = true;
                    }
                }
            }, err => {
                this.searching = false;
                this.loading = false;
                if (this.page === 0) {
                    this.dosesReference = [];
                    this.noResults = true;
                }
            });
    }

    showInfo() {
        this.modalComponent.showInfo();
    }
}
