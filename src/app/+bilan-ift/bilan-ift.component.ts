import { Component, OnInit, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';
import { merge, findIndex } from 'lodash';

import { BilanIftService } from '../shared/bilan-ift';
import { Bilan, BilanParcelleCultivee, ParcelleCultivee, BilanParcelle, Parcelle } from '../shared/bilan-ift';
import { TraitementIftModalComponent, ParcelleModalComponent } from '../shared/bilan-ift';

import { Segment, TraitementIftComponent, TraitementIft } from '../shared/traitement-ift';
import { GroupeCulture, Culture } from '../shared/culture/culture.model';
import { IftDBService } from '../shared/db/ift-db.service';
import { Campagne, CampagneService } from '../shared/campagne';
import { ModalComponent } from '../shared/modal/modal.component';
import { TitreModalComponent } from '../shared/modal/titre-modal.component';

@Component({
    selector: 'app-bilan-ift',
    templateUrl: './bilan-ift.component.html',
    styleUrls: ['./bilan-ift.component.scss']
})
export class BilanIftComponent implements OnInit {

    campagnes: Campagne[];
    bilan: Bilan;
    selectedBilan: Bilan;

    @ViewChild(ModalComponent) modalComponent: ModalComponent;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private campagneService: CampagneService,
        private bilanIftService: BilanIftService,
        private iftDBService: IftDBService,
        private modalService: BsModalService) {
    }

    ngOnInit() {

        // Load campagne list first
        this.campagneService.list().subscribe((campagnes) => {
            this.campagnes = campagnes;

            this.route.params.subscribe(params => {
                const campagneIdMetier = params.campagneIdMetier;

                if (!campagneIdMetier) {
                    const activeCampagne = campagnes.find(campagne => campagne.active);
                    this.router.navigate(['/bilan-ift', activeCampagne.idMetier]);
                } else {
                    const campagne = campagnes.find(c => c.idMetier === campagneIdMetier);

                    this.bilan = new Bilan(campagne);
                    this.selectedBilan = new Bilan(campagne);

                    this.iftDBService.getParcelles(campagne)
                        .then((parcelles: ParcelleCultivee[]) => {
                            this.bilan.bilanParcellesCultivees = [];
                            parcelles.forEach(parcelle => this.bilan.bilanParcellesCultivees.push(new BilanParcelleCultivee(parcelle)));

                            this.getBilan(parcelles, false);
                        });

                }
            });
        });
    }

    public refreshBilanParcelle(bilanParcelles: Array<BilanParcelleCultivee>) {
        const parcelles = [];
        bilanParcelles.forEach(bilanParcelle => parcelles.push(bilanParcelle.parcelleCultivee));

        this.getBilan(parcelles, false);
    }

    public refreshSelectedBilanParcelle(bilanParcelles: Array<BilanParcelleCultivee>) {
        const parcelles = [];
        bilanParcelles.forEach(bilanParcelle => {
            if (bilanParcelle.selected === true) {
                parcelles.push(bilanParcelle.parcelleCultivee);
            }
        });

        this.getBilan(parcelles, true);
    }

    public getBilan(parcelles: ParcelleCultivee[], selectedOnly: boolean) {
        if (parcelles && parcelles.length > 0) {

            parcelles.forEach(parcelle => parcelle.traitements.sort(function (a, b) {
                return new Date(a.dateTraitement).getTime() - new Date(b.dateTraitement).getTime();
            }));
            this.bilanIftService.getBilan(parcelles).subscribe(
                (response: Bilan) => {
                    if (selectedOnly === false) {
                        merge(this.bilan, response);
                        this.bilan = { ...this.bilan }; // For change detection
                    }
                    this.selectedBilan = response;
                }
            );
        } else {
            if (selectedOnly === false) {
                this.bilan = new Bilan(this.bilan.campagne);
            }
            this.selectedBilan = new Bilan(this.bilan.campagne);
        }
    }

    public nextCampagne() {
        this.router.navigate(['/bilan-ift', this.campagnes[this.campagneIndex + 1].idMetier]);
    }

    public previousCampagne() {
        this.router.navigate(['/bilan-ift', this.campagnes[this.campagneIndex - 1].idMetier]);
    }

    public get campagneIndex() {
        return findIndex(this.campagnes, this.bilan.campagne);
    }

    showInfo() {
        this.modalComponent.showInfo();
    }
}
