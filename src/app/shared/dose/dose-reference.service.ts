import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { API_URL } from '../../app.config';
import { Campagne } from '../campagne/campagne.model';
import { Culture } from '../culture/culture.model';
import { Cible } from '../cible/cible.model';
import { NumeroAmm } from '../numero-amm/numero-amm.model';
import { Dose, DoseReference, ProduitDoseReference } from './dose.model';
import { Produit } from '../numero-amm/produit.model';
import { CustomEncoder } from '../http/custom-codec.class';

@Injectable()
export class DoseReferenceService {

    constructor(
        @Inject(API_URL) private _apiUrl: string,
        private _http: HttpClient
    ) { }

    get(campagne: Campagne, culture: Culture, numeroAmm: NumeroAmm, cible: Cible) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder()});

        queryParams = queryParams.set('campagneIdMetier', campagne.idMetier);
        queryParams = queryParams.set('cultureIdMetier', culture.idMetier);
        queryParams = queryParams.set('numeroAmmIdMetier', numeroAmm.idMetier);

        if (cible) {
            queryParams = queryParams.set('cibleIdMetier', cible.idMetier);
        }else {
            queryParams = queryParams.set('type', 'culture');
        }
        return this._http.get(this._apiUrl + '/doses-reference', { params: queryParams })
            .map((response: DoseReference[]) => response.length > 0 ? response[0] : null);
    }

    query(page: number, typeDose: string, biocontrole: boolean, campagne: Campagne,
          culture?: Culture, numeroAmm?: NumeroAmm, produit?: Produit, cible?: Cible) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder()});
        const queryUrl = '/produits-doses-reference';

        queryParams = queryParams.set('page', page.toString());

        if (typeDose !== 'all') {
            queryParams = queryParams.set('type', typeDose);
        }

        if (biocontrole === true) {
            queryParams = queryParams.set('biocontrole', 'true');
        }

        if (campagne) {
            queryParams = queryParams.set('campagneIdMetier', campagne.idMetier);
        }

        if (culture) {
            queryParams = queryParams.set('cultureIdMetier', culture.idMetier);
        }

        if (numeroAmm) {
            queryParams = queryParams.set('numeroAmmIdMetier', numeroAmm.idMetier);
        }

        if (produit) {
            queryParams = queryParams.set('produitLibelle', produit.libelle);
        }

        if (cible) {
            queryParams = queryParams.set('cibleIdMetier', cible.idMetier);
        }
        return this._http.get(this._apiUrl + queryUrl, { params: queryParams })
            .map(response => response as ProduitDoseReference[]);
    }

}
