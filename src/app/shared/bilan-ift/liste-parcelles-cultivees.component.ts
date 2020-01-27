import {
    Component, OnInit,
    HostListener, TemplateRef, ViewChild, Input, Output, EventEmitter
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/forkJoin';

import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { BilanParcelleCultivee, ParcelleCultivee, Parcelle, Bilan } from './bilan.model';
import { Campagne } from '../campagne/campagne.model';
import { IftDBService } from '../db/ift-db.service';
import { TraitementIftModalComponent } from './traitement-ift-modal.component';
import { TraitementIft } from '../traitement-ift/traitement-ift.model';
import { ParcelleModalComponent } from './parcelle-modal.component';
import { Culture } from '../culture/culture.model';
import { TitreModalComponent } from '../modal/titre-modal.component';
import { BilanIftService } from './bilan-ift.service';
import { UpdateBilanModalComponent } from './update-bilan-modal.component';
import { ShareBilanModalComponent } from './share-bilan-modal.component';

@Component({
    selector: 'app-liste-parcelles-cultivees',
    templateUrl: './liste-parcelles-cultivees.component.html',
    styleUrls: ['./liste-parcelles-cultivees.component.scss'],
    providers: [DatePipe]
})
export class ListeParcellesCultiveesComponent implements OnInit {

    @Input() bilanParcellesCultivees: BilanParcelleCultivee[];
    @Input() campagne: Campagne;
    @Input() allowUpdate = false;
    @Input() allowDownload = false;

    @Output() onRefreshBilanParcelle: EventEmitter<BilanParcelleCultivee[]> = new EventEmitter();
    @Output() onSelectBilanParcelle: EventEmitter<BilanParcelleCultivee[]> = new EventEmitter();

    traitementModalRef: BsModalRef;
    parcelleModalRef: BsModalRef;

    updateBilanModalRef: BsModalRef;
    loading = false;

    click: boolean[] = [];
    selected: boolean[] = [];

    parcelles: string[] = [];
    cultures: string[] = [];

    downloading = false;
    titrePdfModalRef: BsModalRef;
    shareBilanModalRef: BsModalRef;
    loadingShareUrl = false;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private iftDBService: IftDBService,
        private bilanIftService: BilanIftService,
        private modalService: BsModalService,
        private datePipe: DatePipe) {
    }

    ngOnInit() {
    }

    doShareUrl() {
        if (!this.loadingShareUrl) {

            const bilanUrl = localStorage.getItem('bilan_' + this.campagne.idMetier + '_share_url');
            if (bilanUrl) {
                this.shareBilanModalRef = this.modalService.show(ShareBilanModalComponent, { class: 'modal-lg' });
                this.shareBilanModalRef.content.url = bilanUrl;
            } else {
                this.loadingShareUrl = true;
                const parcelles = [];

                this.bilanParcellesCultivees
                    .filter(bilanParcelleCultivee => bilanParcelleCultivee.selected === true)
                    .forEach(p => parcelles.push(p.parcelleCultivee));
                this.bilanIftService.getShareUrl(this.campagne, parcelles)
                    .subscribe((result: { bilan: Bilan, verificationUrl: string }) => {
                        this.shareBilanModalRef = this.modalService.show(ShareBilanModalComponent, { class: 'modal-lg' });
                        this.shareBilanModalRef.content.url = result.verificationUrl;
                        this.loadingShareUrl = false;
                        localStorage.setItem('bilan_' + this.campagne.idMetier + '_share_url', result.verificationUrl);
                    });
            }
        }
    }

    public removeLocalStorage() {
        localStorage.removeItem('bilan_' + this.campagne.idMetier + '_share_url');
    }

    public copyTraitementParcelle(indexBilan: number, indexTraitement: number) {
        this.traitementModalRef = this.modalService.show(TraitementIftModalComponent, { class: 'modal-lg' });
        const bilanParcelle = this.bilanParcellesCultivees[indexBilan];
        this.traitementModalRef.content.initData(cloneDeep(bilanParcelle.parcelleCultivee.traitements[indexTraitement]), bilanParcelle);
        this.traitementModalRef.content.duplication = true;
        this.traitementModalRef.content.parcelles = this.bilanParcellesCultivees;
        this.traitementModalRef.content.parcelles.map(p =>
            p.libelle = this.getLibelleParcelleCultivee(p)
        );

        const validate: Observable<{ parcelleCultivee: ParcelleCultivee, traitementParcelle: TraitementIft }>
            = this.traitementModalRef.content.validate;

        validate.first().subscribe((res) => {
            this.createTraitementParcelle(res);
            this.removeLocalStorage();
            this.onRefreshBilanParcelle.emit(this.bilanParcellesCultivees);
        });
    }

    private getLibelleParcelleCultivee(bilanParcelleCultivee: BilanParcelleCultivee) {
        return bilanParcelleCultivee.parcelleCultivee.parcelle.nom
            + ' - ' + bilanParcelleCultivee.parcelleCultivee.culture.libelle
            + ' (' + bilanParcelleCultivee.parcelleCultivee.parcelle.surface + ' HA)';
    }

    public deleteTraitementParcelle(indexBilan: number, indexTraitement: number) {
        this.removeTraitementParcelle(indexBilan, indexTraitement)
            .then(() => {
                this.removeLocalStorage();
                this.onRefreshBilanParcelle.emit(this.bilanParcellesCultivees);
            }
            );
    }

    public deleteParcelle(indexBilan: number) {
        const bilanParcelle = this.bilanParcellesCultivees[indexBilan];

        this.bilanParcellesCultivees.splice(indexBilan, 1);
        return this.iftDBService.deleteParcelle(bilanParcelle.parcelleCultivee);
    }

    public removeParcelle(indexBilan: number) {
        this.deleteParcelle(indexBilan).then(() => {
            this.removeLocalStorage();
            this.onRefreshBilanParcelle.emit(this.bilanParcellesCultivees);
        });
    }

    private removeTraitementParcelle(indexBilan: number, indexTraitement: number) {
        const bilanParcelle = this.bilanParcellesCultivees[indexBilan];
        bilanParcelle.parcelleCultivee.traitements.splice(indexTraitement, 1);
        return this.iftDBService.saveParcelle(bilanParcelle.parcelleCultivee);
    }

    public editTraitementParcelle(indexBilan: number, indexTraitement: number) {
        this.traitementModalRef = this.modalService.show(TraitementIftModalComponent, { class: 'modal-lg' });
        const bilanParcelle = this.bilanParcellesCultivees[indexBilan];
        this.traitementModalRef.content.initData(bilanParcelle.parcelleCultivee.traitements[indexTraitement], bilanParcelle);
        this.traitementModalRef.content.parcelles = this.bilanParcellesCultivees;
        this.traitementModalRef.content.parcelles.map(p =>
            p.libelle = this.getLibelleParcelleCultivee(p)
        );

        const validate: Observable<{ parcelleCultivee: ParcelleCultivee, traitementParcelle: TraitementIft }>
            = this.traitementModalRef.content.validate;

        validate.first().subscribe((res) => {
            this.updateTraitementParcelle(indexBilan, indexTraitement, res)
                .then(() => {
                    this.removeLocalStorage();
                    this.onRefreshBilanParcelle.emit(this.bilanParcellesCultivees);
                });
        });
    }

    public editParcelle(indexBilan: number) {
        this.click[indexBilan] = !this.click[indexBilan];

        this.parcelleModalRef = this.modalService.show(ParcelleModalComponent, { class: 'modal-lg' });
        const bilanParcelle = this.bilanParcellesCultivees[indexBilan];
        this.parcelleModalRef.content.initData(bilanParcelle.parcelleCultivee.parcelle.nom,
            bilanParcelle.parcelleCultivee.parcelle.surface,
            bilanParcelle.parcelleCultivee.culture, true);
        this.parcelleModalRef.content.listeParcellesExisting = this.bilanParcellesCultivees
            .filter(p => !(bilanParcelle.parcelleCultivee.parcelle.nom === p.parcelleCultivee.parcelle.nom &&
                bilanParcelle.parcelleCultivee.culture.idMetier === p.parcelleCultivee.culture.idMetier));

        const validate: Observable<{ nom: string, surface: number, culture: Culture }>
            = this.parcelleModalRef.content.validate;

        validate.first().subscribe((res) => {
            this.updateParcelle(indexBilan, res).then(() => {
                this.removeLocalStorage();
                this.onRefreshBilanParcelle.emit(this.bilanParcellesCultivees);
            });
        });
    }

    public copyParcelle(indexBilan: number) {
        this.click[indexBilan] = !this.click[indexBilan];

        this.parcelleModalRef = this.modalService.show(ParcelleModalComponent, { class: 'modal-lg' });
        const bilanParcelle = this.bilanParcellesCultivees[indexBilan];
        this.parcelleModalRef.content.initData(bilanParcelle.parcelleCultivee.parcelle.nom + ' (copie)',
            bilanParcelle.parcelleCultivee.parcelle.surface,
            bilanParcelle.parcelleCultivee.culture, true);
        this.parcelleModalRef.content.listeParcellesExisting = this.bilanParcellesCultivees;
        this.parcelleModalRef.content.duplication = true;
        this.parcelleModalRef.content.parcelleTitle = bilanParcelle.parcelleCultivee.parcelle.nom + ' - ' +
            bilanParcelle.parcelleCultivee.culture.libelle;

        const validate: Observable<{ nom: string, surface: number, culture: Culture }>
            = this.parcelleModalRef.content.validate;

        validate.first().subscribe((res) => {
            const nom = res.nom;
            const surface = res.surface;
            const culture = res.culture;

            const parcelle: Parcelle = new Parcelle(nom, surface);
            const parcelleCultivee = new ParcelleCultivee(this.campagne, parcelle, culture);
            const bilanParcelleCultivee = new BilanParcelleCultivee(parcelleCultivee);
            bilanParcelleCultivee.parcelleCultivee.traitements = [...bilanParcelle.parcelleCultivee.traitements];
            this.bilanParcellesCultivees.push(bilanParcelleCultivee);

            this.iftDBService.saveParcelle(bilanParcelleCultivee.parcelleCultivee)
                .then(() => {
                    this.removeLocalStorage();
                    this.onRefreshBilanParcelle.emit(this.bilanParcellesCultivees);
                });
        });
    }

    public addTraitementParcelle() {
        this.traitementModalRef = this.modalService.show(TraitementIftModalComponent, { class: 'modal-lg' });
        this.traitementModalRef.content.initData(new TraitementIft(this.campagne));
        this.traitementModalRef.content.parcelles = this.bilanParcellesCultivees;
        this.traitementModalRef.content.parcelles.map(p =>
            p.libelle = this.getLibelleParcelleCultivee(p)
        );

        const validate: Observable<{ parcelleCultivee: ParcelleCultivee, traitementParcelle: TraitementIft }>
            = this.traitementModalRef.content.validate;

        validate.first().subscribe((res) => {
            this.createTraitementParcelle(res)
                .then(() => {
                    this.removeLocalStorage();
                    this.onRefreshBilanParcelle.emit(this.bilanParcellesCultivees);
                });

        });
    }

    public addParcelle() {
        this.parcelleModalRef = this.modalService.show(ParcelleModalComponent, { class: 'modal-lg' });
        this.parcelleModalRef.content.listeParcellesExisting = this.bilanParcellesCultivees;

        const validate: Observable<{ nom: string, surface: number, culture: Culture }>
            = this.parcelleModalRef.content.validate;

        validate.first().subscribe((res) => {
            this.createParcelle(res).then(() => {
                this.removeLocalStorage();
                this.onRefreshBilanParcelle.emit(this.bilanParcellesCultivees);
            });
        });
    }

    private createTraitementParcelle(data: { parcelleCultivee, traitementParcelle }) {
        const traitementParcelle = data.traitementParcelle;

        // Find parcelle by campagne, name and culture
        const parcelle: ParcelleCultivee = this.bilanParcellesCultivees.find(p => {
            return p.parcelleCultivee.campagne.idMetier === this.campagne.idMetier
                && p.parcelleCultivee.parcelle.nom === data.parcelleCultivee.parcelle.nom
                && p.parcelleCultivee.culture.idMetier === data.parcelleCultivee.culture.idMetier;
        }).parcelleCultivee;

        parcelle.traitements.push(traitementParcelle);

        return this.iftDBService.saveParcelle(parcelle);
    }

    private createParcelle(data: { nom, surface, culture }) {
        const nom = data.nom;
        const surface = data.surface;
        const culture = data.culture;

        // Find parcelle by campagne, name and culture
        let bilanParcelleCultivee: BilanParcelleCultivee = this.bilanParcellesCultivees.find(p => {
            return p.parcelleCultivee.campagne.idMetier === this.campagne.idMetier && p.parcelleCultivee.parcelle.nom === nom
                && p.parcelleCultivee.culture.idMetier === culture.idMetier;
        });

        if (!bilanParcelleCultivee) {
            const parcelle: Parcelle = new Parcelle(nom, surface);
            const parcelleCultivee = new ParcelleCultivee(this.campagne, parcelle, culture);
            bilanParcelleCultivee = new BilanParcelleCultivee(parcelleCultivee);
            this.bilanParcellesCultivees.push(bilanParcelleCultivee);
        } else {
            bilanParcelleCultivee.parcelleCultivee.parcelle.surface = surface;
        }

        return this.iftDBService.saveParcelle(bilanParcelleCultivee.parcelleCultivee);
    }

    private updateTraitementParcelle(indexBilan: number, indexTraitement: number,
        data: { parcelleCultivee, traitementParcelle }) {
        const bilanParcelle = this.bilanParcellesCultivees[indexBilan];
        const newParcelle = data.parcelleCultivee;
        const newTraitementParcelle = data.traitementParcelle;

        // nomParcelle or culture has been changed
        if (newParcelle.parcelle.nom !== bilanParcelle.parcelleCultivee.parcelle.nom
            || newParcelle.culture.idMetier !== bilanParcelle.parcelleCultivee.culture.idMetier) {
            // Remove traitementParcelle and create a new one
            return this.removeTraitementParcelle(indexBilan, indexTraitement)
                .then(() => this.createTraitementParcelle(data));
        } else {
            bilanParcelle.parcelleCultivee.traitements[indexTraitement] = newTraitementParcelle;
            return this.iftDBService.saveParcelle(bilanParcelle.parcelleCultivee);
        }

    }

    private updateParcelle(indexBilan: number, data: { nom, surface, culture }) {
        const bilanParcelle = this.bilanParcellesCultivees[indexBilan];

        const newNom = data.nom;
        const newSurfaceParcelle = data.surface;
        const newCulture = data.culture;

        if (newNom !== bilanParcelle.parcelleCultivee.parcelle.nom
            || newCulture.idMetier !== bilanParcelle.parcelleCultivee.culture.idMetier) {
            const parcelle: Parcelle = new Parcelle(newNom, newSurfaceParcelle);
            const newParcelleCultivee = new ParcelleCultivee(this.campagne, parcelle, newCulture);
            const newBilanParcelleCultivee = new BilanParcelleCultivee(newParcelleCultivee);
            newParcelleCultivee.traitements = bilanParcelle.parcelleCultivee.traitements;

            // Remove parcelle and create a new one
            return this.deleteParcelle(indexBilan)
                .then(() => this.iftDBService.saveParcelle(newParcelleCultivee)
                    .then(() => {
                        this.bilanParcellesCultivees.splice(indexBilan, 0, newBilanParcelleCultivee);
                        this.removeLocalStorage();
                        this.onRefreshBilanParcelle.emit(this.bilanParcellesCultivees);
                    })
                );
        } else {
            bilanParcelle.parcelleCultivee.parcelle.surface = newSurfaceParcelle;
            return this.iftDBService.saveParcelle(bilanParcelle.parcelleCultivee);
        }
    }

    public getDateTraitement(date: string) {
        return this.datePipe.transform(date, 'dd/MM/yy');
    }

    public downloadBilanPdf() {
        if (!this.downloading) {
            this.titrePdfModalRef = this.modalService.show(TitreModalComponent, { class: 'modal-lg' });

            const validate: Observable<{ titre: string }> = this.titrePdfModalRef.content.validate;

            validate.first().subscribe((res) => {
                this.downloading = true;
                const parcelles = [];
                this.bilanParcellesCultivees
                    .filter(bilanParcelleCultivee => bilanParcelleCultivee.selected === true)
                    .forEach(p => parcelles.push(p.parcelleCultivee));
                this.bilanIftService.getBilanPDF(this.campagne, res.titre, parcelles)
                    .subscribe((data) => {
                        this.downloadFile(data);
                    });
            });
        }
    }

    public downloadFile(data: Blob) {
        const fileName = 'Bilan-IFT-' + Date.now() + '.pdf';

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(data, fileName);
        } else {
            const url = window.URL.createObjectURL(data);

            const anchor = document.createElement('a');
            document.body.appendChild(anchor);
            anchor.download = fileName;
            anchor.href = url;
            anchor.click();
        }
        this.downloading = false;
    }

    updateBilan() {
        this.updateBilanModalRef = this.modalService.show(UpdateBilanModalComponent, { class: 'modal-lg' });
        this.updateBilanModalRef.content.campagneLibelle = this.campagne.libelle;

        const validate: Observable<{}>
            = this.updateBilanModalRef.content.validate;

        validate.first().subscribe((res) => {
            this.loading = true;
            this.iftDBService.getParcelles(this.campagne)
                .then((parcelles: ParcelleCultivee[]) => {

                    // delete previous data
                    const deleteParcellePromises: Array<Promise<any>> = [];
                    parcelles.forEach(
                        p => deleteParcellePromises.push(this.iftDBService.deleteParcelle(p))
                    );

                    Promise.all(deleteParcellePromises)
                        .then(() => {
                            // add new data
                            const saveParcellePromises: Array<Promise<any>> = [];
                            this.bilanParcellesCultivees
                                .forEach(
                                    p => {
                                        p.parcelleCultivee._id = `${ParcelleCultivee.DOCUMENT_TYPE}_
                                ${this.campagne.idMetier}_${p.parcelleCultivee.parcelle.nom}_${p.parcelleCultivee.culture.idMetier}`;
                                        p.parcelleCultivee.campagne = this.campagne;
                                        p.parcelleCultivee.type = ParcelleCultivee.DOCUMENT_TYPE;

                                        saveParcellePromises.push(this.iftDBService.saveParcelle(p.parcelleCultivee));
                                    }
                                );
                            Promise.all(saveParcellePromises).then(
                                (results) => this.router.navigate(['/bilan-ift', this.campagne.idMetier])
                            );
                        })
                        .catch((e) => {
                            console.log(e);
                        });
                });
        });
    }

    newBilan() {
        this.loading = true;
        this.iftDBService.getParcelles(this.campagne)
            .then((parcelles: ParcelleCultivee[]) => {

                // delete previous data
                const deleteParcellePromises: Array<Promise<any>> = [];
                parcelles.forEach(
                    p => deleteParcellePromises.push(this.iftDBService.deleteParcelle(p))
                );

                Promise.all(deleteParcellePromises)
                    .then(() => {
                        this.loading = false;
                        this.bilanParcellesCultivees = [];
                        this.removeLocalStorage();
                        this.onRefreshBilanParcelle.emit(this.bilanParcellesCultivees);
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            });
    }

    refreshBilan(indexBilan) {
        this.removeLocalStorage();
        this.onSelectBilanParcelle.emit(this.bilanParcellesCultivees);
    }

    downloadAsCSV() {
        let csv = '"Parcelle","Surface (HA)","Culture","Date","Produit","Cible","Surface traitée (%)","Dose","Segment","IFT"';
        this.bilanParcellesCultivees
            .filter(bilanParcelleCultivee => bilanParcelleCultivee.selected === true)
            .forEach(bilanParcellesCultivee => {
                bilanParcellesCultivee.parcelleCultivee.traitements.forEach(traitement => {
                    csv += '\n"' + bilanParcellesCultivee.parcelleCultivee.parcelle.nom + '",';
                    csv += bilanParcellesCultivee.parcelleCultivee.parcelle.surface + ',';
                    csv += '"' + bilanParcellesCultivee.parcelleCultivee.culture.libelle + '",';
                    csv += '"' + this.getDateTraitement(traitement.dateTraitement) + '",';
                    csv += '"' + (traitement.produitLibelle ? traitement.produitLibelle :
                        (traitement.numeroAmm ? traitement.numeroAmm.idMetier : '')) + '",';
                    csv += '"' + (traitement.cible ? traitement.cible.libelle : '') + '",';
                    csv += traitement.facteurDeCorrection + ',';
                    csv += '"' + (traitement.dose ? traitement.dose : '') +
                        ' ' + (traitement.dose && traitement.unite ? traitement.unite.libelle : '') + '",';
                    csv += '"' + (traitement.segment ? traitement.segment.libelle : '') + '",';
                    csv += traitement.ift ? traitement.ift.toFixed(2) : '';
                });
            });

        const filename = 'bilan' + this.campagne.idMetier + '.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        const data = encodeURI(csv);

        const fileName = 'Bilan-IFT-' + Date.now() + '.csv';

        if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveOrOpenBlob(data, fileName);
        } else {
            const anchor = document.createElement('a');
            document.body.appendChild(anchor);
            anchor.download = fileName;
            anchor.href = data;
            anchor.click();
        }
    }

}
