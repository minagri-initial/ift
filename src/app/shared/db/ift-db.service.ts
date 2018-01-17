import { Injectable, OnInit } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import { Parcelle } from '../../+bilan-ift/bilan.model';
import { Promise } from 'q';
import { Campagne } from '../campagne';
import * as _ from 'lodash';

PouchDB.plugin(PouchFind);

@Injectable()
export class IftDBService {

    private db;

    constructor() {
        console.log('init pouch');
        this.db = new PouchDB('ift');
        this.db.info(err => {
            if (err) {
                console.error('PouchDB Error', err);
            }
        });

    }

    public saveParcelle(parcelle: Parcelle): Promise<any> {
        return this.db.get(parcelle._id)
            .then((found: Parcelle) => {
                found.traitements = parcelle.traitements;
                return this.db.put(found);
            })
            .catch(() => {
                return this.db.put(parcelle);
            });
    }

    public getParcelles(campagne?: Campagne): Promise<Parcelle[]> {

        return this.db.find({
            selector: { type: Parcelle.DOCUMENT_TYPE }
        })
            .then(res => {
                let parcelles: Parcelle[] = res.docs;
                if (!campagne) {
                    return parcelles;
                } else {
                    parcelles = parcelles.map(p => {
                        const parcelle = Parcelle.parse(p);
                        return parcelle.filterTraitementsByCampagne(campagne);
                    });

                    // Return only parcelles that have traitement for this campagne
                    return parcelles.filter(parcelle => {
                        return parcelle.traitements.length > 0;
                    });
                }

            });
    }

    public deleteParcelle(parcelle: Parcelle): Promise<any> {
        return this.db.remove(parcelle);
    }

}
