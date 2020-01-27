import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Culture } from './culture.model';
import { NumeroAmm } from '../numero-amm/numero-amm.model';
import { Campagne } from '../campagne/campagne.model';
import { Cible } from '../cible/cible.model';
import { CustomEncoder } from '../http/custom-codec.class';
import { environment } from '../../../environments/environment';

@Injectable()
export class CultureService {

    private _apiUrl = environment.apiUrl;

    constructor(private _http: HttpClient) { }

    query(campagne?: Campagne, numerosAmm?: NumeroAmm[], cible?: Cible, filter?: string, size?: number) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder()});
        if (campagne) {
            queryParams = queryParams.set('campagneIdMetier', campagne.idMetier);
        }
        if (numerosAmm) {
            numerosAmm.forEach(numeroAmm => {
                queryParams = queryParams.append('numeroAmmIdMetier', numeroAmm.idMetier);
            });
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


        return this._http.get(this._apiUrl + '/cultures', { params: queryParams })
            .map(response => response as Culture[]);
    }
}
