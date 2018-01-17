import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { API_URL } from '../app.config';
import { TraitementIft, TraitementIftResult, SignedTraitementIft } from './traitement-ift.model';
import { CustomEncoder } from '../shared/http/custom-codec.class';

@Injectable()
export class TraitementIftService {

    constructor(
        @Inject(API_URL) private _apiUrl: string,
        private _http: HttpClient
    ) { }

    get(traitementIft: TraitementIft) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder()});

        queryParams = queryParams.set('campagneIdMetier', traitementIft.campagne.idMetier);
        if (traitementIft.numeroAmm) {
            queryParams = queryParams.set('numeroAmmIdMetier', traitementIft.numeroAmm.idMetier);
        }
        if (traitementIft.culture) {
            queryParams = queryParams.set('cultureIdMetier', traitementIft.culture.idMetier);
        }
        if (traitementIft.cible) {
            queryParams = queryParams.set('cibleIdMetier', traitementIft.cible.idMetier);
        }
        queryParams = queryParams.set('traitementIdMetier', traitementIft.traitement.idMetier);
        if (traitementIft.unite) {
            queryParams = queryParams.set('uniteIdMetier', traitementIft.unite.idMetier);
        }
        if (traitementIft.dose) {
            queryParams = queryParams.set('dose', traitementIft.dose.toString());
        }
        if (traitementIft.volumeDeBouillie) {
            queryParams = queryParams.set('volumeDeBouillie', traitementIft.volumeDeBouillie.toString());
        }
        if (traitementIft.facteurDeCorrection) {
            queryParams = queryParams.set('facteurDeCorrection', traitementIft.facteurDeCorrection.toString());
        }

        return this._http.get(this._apiUrl + '/ift/traitement', { params: queryParams })
            .map(result => result as TraitementIftResult);
    }

    getSigned(traitementIft: TraitementIft) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder()});

        queryParams = queryParams.set('campagneIdMetier', traitementIft.campagne.idMetier);
        queryParams = queryParams.set('numeroAmmIdMetier', traitementIft.numeroAmm.idMetier);
        queryParams = queryParams.set('cultureIdMetier', traitementIft.culture.idMetier);
        if (traitementIft.cible) {
            queryParams = queryParams.set('cibleIdMetier', traitementIft.cible.idMetier);
        }
        queryParams = queryParams.set('traitementIdMetier', traitementIft.traitement.idMetier);
        if (traitementIft.unite) {
            queryParams = queryParams.set('uniteIdMetier', traitementIft.unite.idMetier);
        }
        if (traitementIft.dose) {
            queryParams = queryParams.set('dose', traitementIft.dose.toString());
        }
        if (traitementIft.volumeDeBouillie) {
            queryParams = queryParams.set('volumeDeBouillie', traitementIft.volumeDeBouillie.toString());
        }
        if (traitementIft.facteurDeCorrection) {
            queryParams = queryParams.set('facteurDeCorrection', traitementIft.facteurDeCorrection.toString());
        }

        return this._http.get(this._apiUrl + '/ift/traitement/certifie', { params: queryParams })
            .map(result => result as SignedTraitementIft);
    }

}
