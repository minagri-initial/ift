import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DoseReferenceService } from '../shared/dose/dose-reference.service';
import { DosesReferenceSearch } from './doses-reference-search.model';
import { Campagne } from '../shared/campagne/campagne.model';
import { Dose, ProduitDoseReference } from '../shared/dose/dose.model';

import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { DoseReference } from '../shared/dose';
import { CampagneService } from '../shared/campagne/campagne.service';

@Component({
    selector: 'app-doses-reference',
    templateUrl: './doses-reference.component.html',
    styleUrls: ['./doses-reference.component.scss']
})
export class DosesReferenceComponent implements OnInit {

    search: DosesReferenceSearch;
    numeroAmmByProduct = true;
    campagnes: Campagne[];
    dosesReference: ProduitDoseReference[] = [];
    biocontroleUniquement = false;
    typeDose = 'all';
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
    searching = false;
    loading = false;

    loadedPage: number = -1;
    page = 0;
    noMoreResults = false;

    constructor(private doseReferenceService: DoseReferenceService,
        private route: ActivatedRoute,
        private router: Router,
        private campagneService: CampagneService) {
    }

    ngOnInit() {
        this.search = new DosesReferenceSearch();

        // Load campagne list first
        this.campagneService.list().subscribe((campagnes) => {
            this.campagnes = campagnes;

            this.route.params.subscribe(params => {
                this.search = new DosesReferenceSearch();

                const campagneIdMetier = params.campagneIdMetier;

                if (!campagneIdMetier) {
                    const activeCampagne = campagnes.find(campagne => campagne.active);
                    this.router.navigate(['/doses-reference', activeCampagne.idMetier]);
                } else {
                    this.search.campagne = campagnes.find(campagne => campagne.idMetier === campagneIdMetier);
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
        return _.findIndex(this.campagnes, this.search.campagne);
    }

    public onSubmit(form: NgForm) {

        if (form.valid) {
            this.page = 0;
            this.loadedPage = -1;
            this.noMoreResults = false;
            this.dosesReference = [];
            this.queryDosesReference();
        }
    }

    public toggleNumeroAmmByProduct(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.search.numeroAmm = null;
        this.search.produit = null;
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
            this.typeDose,
            this.biocontroleUniquement,
            this.search.campagne,
            this.search.culture,
            this.search.numeroAmm,
            this.search.produit,
            this.search.cible)
            .subscribe((doseReferences: ProduitDoseReference[]) => {
                this.dosesReference = this.dosesReference.concat(doseReferences);
                this.searching = false;
                this.loading = false;
                this.loadedPage++;
                if (doseReferences.length === 0) {
                    this.noMoreResults = true;
                }
            });
    }
}
