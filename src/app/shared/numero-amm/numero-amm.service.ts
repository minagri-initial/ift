import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { NumeroAmm } from './numero-amm.model';
import { Campagne } from '../campagne/campagne.model';
import { Culture } from '../culture/culture.model';
import { Cible } from '../cible/cible.model';
import { CustomEncoder } from '../http/custom-codec.class';
import { environment } from '../../../environments/environment';

@Injectable()
export class NumeroAmmService {

    private _apiUrl = environment.apiUrl;

    constructor(private _http: HttpClient) { }

    query(campagne?: Campagne, culture?: Culture, cible?: Cible, filter?: string, size?: number) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder()});
        if (campagne) {
            queryParams = queryParams.set('campagneIdMetier', campagne.idMetier);
        }
        if (culture) {
            queryParams = queryParams.set('cultureIdMetier', culture.idMetier);
        }
        if (cible) {
            queryParams = queryParams.set('cibleIdMetier', cible.idMetier);
        }
        if (filter) {
            queryParams = queryParams.set('filtre', filter);
        }
        if (size) {
            queryParams = queryParams.set('size', size.toString());
        }

        return this._http.get(this._apiUrl + '/numeros-amm', { params: queryParams })
            .map(result => result as NumeroAmm[]);
    }
}
