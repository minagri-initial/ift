import { Component, OnInit, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/first';


import * as _ from 'lodash';
import { BilanIftService } from './bilan-ift.service';
import { Segment, TraitementIftComponent, TraitementIft } from '../+traitement-ift';
import { GroupeCulture, Culture } from '../shared/culture/culture.model';
import { Bilan, BilanParcelle, Parcelle, TraitementParcelle, BilanTraitementParcelle } from './bilan.model';
import { TraitementIftModalComponent } from '../+traitement-ift/traitement-ift-modal.component';
import { IftDBService } from '../shared/db/ift-db.service';
import { Observable } from 'rxjs/Observable';
import { Campagne, CampagneService } from '../shared/campagne';

declare var moment: any;

@Component({
    selector: 'app-bilan-ift',
    templateUrl: './bilan-ift.component.html',
    styleUrls: ['./bilan-ift.component.scss']
})
export class BilanIftComponent implements OnInit {

    traitementModalRef: BsModalRef;

    campagnes: Campagne[];

    bilan: Bilan;

    click: boolean[] = [];

    parcelles: string[] = [];

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

                    this.iftDBService.getParcelles(campagne)
                        .then((parcelles: Parcelle[]) => {
                            this.bilan.bilanParcelles = parcelles as BilanParcelle[];

                            this.refreshBilanParcelle();
                        });

                }
            });
        });
    }

    public refreshBilanParcelle() {

        const parcelles = this.bilan.bilanParcelles;
        this.bilanIftService.getBilan(parcelles).subscribe(
            (response: Bilan) => {
                _.merge(this.bilan, response);

                this.bilan.bilanParcelles.forEach(parcelle => {

                    if (!this.parcelles.includes(parcelle.nom)) {
                        // TODO add fulltext search
                        this.parcelles.push(parcelle.nom);
                    }
                });
            }
        );
    }
    public nextCampagne() {
        this.router.navigate(['/bilan-ift', this.campagnes[this.campagneIndex + 1].idMetier]);
    }

    public previousCampagne() {
        this.router.navigate(['/bilan-ift', this.campagnes[this.campagneIndex - 1].idMetier]);
    }

    public get campagneIndex() {
        return _.findIndex(this.campagnes, this.bilan.campagne);
    }

    public copyTraitementParcelle(indexBilan: number, indexTraitement: number) {
        this.traitementModalRef = this.modalService.show(TraitementIftModalComponent, { class: 'modal-lg' });
        const bilanParcelle = this.bilan.bilanParcelles[indexBilan];
        this.traitementModalRef.content.nomParcelle = bilanParcelle.nom;
        this.traitementModalRef.content.traitement = _.cloneDeep(bilanParcelle.traitements[indexTraitement]);
        this.traitementModalRef.content.parcelles = this.parcelles;

        const validate: Observable<{ nomParcelle: string, traitementParcelle: TraitementParcelle }>
            = this.traitementModalRef.content.validate;

        validate.first().subscribe((res) => {
            this.createTraitementParcelle(res);
            this.refreshBilanParcelle();
        });
    }

    public deleteTraitementParcelle(indexBilan: number, indexTraitement: number) {
        this.removeTraitementParcelle(indexBilan, indexTraitement);
        this.refreshBilanParcelle();
    }

    private removeTraitementParcelle(indexBilan: number, indexTraitement: number) {
        const bilanParcelle = this.bilan.bilanParcelles[indexBilan];
        bilanParcelle.traitements.splice(indexTraitement, 1);

        if (bilanParcelle.traitements.length === 0) {
            // delete bilan parcelle
            this.bilan.bilanParcelles.splice(indexBilan, 1);
            this.iftDBService.deleteParcelle(bilanParcelle);
        } else {
            this.iftDBService.saveParcelle(bilanParcelle);
        }
    }

    public editTraitementParcelle(indexBilan: number, indexTraitement: number) {
        this.traitementModalRef = this.modalService.show(TraitementIftModalComponent, { class: 'modal-lg' });
        const bilanParcelle = this.bilan.bilanParcelles[indexBilan];
        this.traitementModalRef.content.nomParcelle = bilanParcelle.nom;
        this.traitementModalRef.content.traitement = bilanParcelle.traitements[indexTraitement];
        this.traitementModalRef.content.parcelles = this.parcelles;

        const validate: Observable<{ nomParcelle: string, traitementParcelle: TraitementParcelle }>
            = this.traitementModalRef.content.validate;

        validate.first().subscribe((res) => {
            this.updateTraitementParcelle(indexBilan, indexTraitement, res);
            this.refreshBilanParcelle();
        });
    }

    public addTraitementParcelle() {
        this.traitementModalRef = this.modalService.show(TraitementIftModalComponent, { class: 'modal-lg' });
        this.traitementModalRef.content.traitement = new TraitementParcelle(this.bilan.campagne);
        this.traitementModalRef.content.parcelles = this.parcelles;

        const validate: Observable<{ nomParcelle: string, traitementParcelle: TraitementParcelle }>
            = this.traitementModalRef.content.validate;

        validate.first().subscribe((res) => {
            this.createTraitementParcelle(res);
            this.refreshBilanParcelle();
        });
    }

    private createTraitementParcelle(data: { nomParcelle, traitementParcelle }) {
        const nomParcelle = data.nomParcelle;
        const traitementParcelle = data.traitementParcelle;
        const culture = traitementParcelle.iftTraitement.culture;

        // Find parcelle by name and culture
        let parcelle: Parcelle = this.bilan.bilanParcelles.find(p => {
            return p.nom === nomParcelle
                && p.culture.idMetier === culture.idMetier;
        });

        if (!parcelle) {
            parcelle = new Parcelle(nomParcelle, culture);
            parcelle.traitements.push(traitementParcelle);

            this.bilan.bilanParcelles.push(parcelle as BilanParcelle);
        } else {
            parcelle.traitements.push(traitementParcelle);
        }

        this.iftDBService.saveParcelle(parcelle);
    }

    private updateTraitementParcelle(indexBilan: number, indexTraitement: number, data: { nomParcelle, traitementParcelle }) {
        const bilanParcelle = this.bilan.bilanParcelles[indexBilan];
        const newNomParcelle = data.nomParcelle;
        const newTraitementParcelle = data.traitementParcelle;
        const newCulture: Culture = newTraitementParcelle.iftTraitement.culture;

        // nomParcelle or culture has been changed
        if (newNomParcelle !== bilanParcelle.nom || newCulture.idMetier !== bilanParcelle.culture.idMetier) {
            // Remove traitementParcelle and create a new one
            this.removeTraitementParcelle(indexBilan, indexTraitement);
            this.createTraitementParcelle(data);
        } else {
            bilanParcelle.traitements[indexTraitement] = newTraitementParcelle;
            this.iftDBService.saveParcelle(bilanParcelle);
        }

    }

    public getDateTraitement(date: string) {
        moment.locale('fr');
        return moment(date).format('DD/MM/YYYY');
    }
}
