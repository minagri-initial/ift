import { Injectable, OnInit } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ParcelleCultivee } from '../bilan-ift/bilan.model';
import { Campagne } from '../campagne';
import { UpdateDbModalComponent } from './update-db-modal.component';

PouchDB.plugin(PouchFind);

@Injectable()
export class IftDBService {

    private db;

    private numeroDeVersion = '1.0';
    private dbReady = new ReplaySubject();

    bsModalRef: BsModalRef;

    constructor(private modalService: BsModalService) {
        console.log('init pouch');
        this.db = new PouchDB('ift');
        this.db.info(err => {
            if (err) {
                console.error('PouchDB Error', err);
            }
        });

        this.db.get('version_' + this.numeroDeVersion).then((found) => {
            // pouch up to date
            this.dbReady.next(true);
        }).catch(() => {
            console.log('update pouch');
            this.db.allDocs().then((result) => {
                if (result.rows.filter(row => !row.id.includes('version_')).length > 0) {
                    this.bsModalRef = this.modalService.show(UpdateDbModalComponent);
                }
                return Promise.all(result.rows.map((row) => {
                    return this.db.remove(row.id, row.value.rev);
                }));
            }).then(() => {
                this.dbReady.next(true);
                const version = {
                    _id: 'version_' + this.numeroDeVersion,
                    numeroDeVersion: this.numeroDeVersion
                };
                this.db.put(version);
            }).catch((err) => { console.log(err); });
        });
    }

    public saveParcelle(parcelleCultivee: ParcelleCultivee): Promise<any> {
        localStorage.removeItem('bilan_' + parcelleCultivee.campagne.idMetier + '_share_url');
        return this.db.get(parcelleCultivee._id)
            .then((found: ParcelleCultivee) => {
                found.traitements = parcelleCultivee.traitements;
                found.parcelle.surface = parcelleCultivee.parcelle.surface;
                return this.db.put(found);
            })
            .catch(() => {
                return this.db.put(parcelleCultivee);
            });
    }

    public getParcelles(campagne?: Campagne): Promise<ParcelleCultivee[]> {
        return new Promise((resolve, reject) => {
            this.dbReady.mergeMap(() => fromPromise(this._getParcelles(campagne)))
                .subscribe((res) => {
                    resolve(res);
                }, (err) => {
                    reject(err);
                });

        });
    }

    private _getParcelles(campagne?: Campagne): Promise<ParcelleCultivee[]> {
        return this.db.find({
            selector: { type: ParcelleCultivee.DOCUMENT_TYPE }
        })
            .then(res => {
                const parcelles: ParcelleCultivee[] = res.docs;

                if (!campagne) {
                    return parcelles;
                } else {
                    // Return only parcelles that have traitement for this campagne
                    const p = parcelles.filter(parcelle => {
                        return parcelle.campagne.idMetier === campagne.idMetier;
                    });
                    p.forEach(parcelle => parcelle.traitements.sort(function (a, b) {
                        return new Date(a.dateTraitement).getTime() - new Date(b.dateTraitement).getTime();
                    }));
                    return p;
                }

            });
    }

    public deleteParcelle(parcelle: ParcelleCultivee): Promise<any> {
        return this.db.get(parcelle._id)
            .then((found: ParcelleCultivee) => {
                this.db.remove(found);
            });
    }

}
