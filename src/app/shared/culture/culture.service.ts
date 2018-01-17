import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { API_URL } from '../../app.config';
import { Culture } from './culture.model';
import { NumeroAmm } from '../numero-amm/numero-amm.model';
import { Campagne } from '../campagne/campagne.model';
import { Cible } from '../cible/cible.model';
import { CustomEncoder } from '../http/custom-codec.class';

@Injectable()
export class CultureService {

    constructor(
        @Inject(API_URL) private _apiUrl: string,
        private _http: HttpClient
      ) { }

    query(campagne?: Campagne, numeroAmm?: NumeroAmm, cible?: Cible, filter?: string, size?: number) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder()});
        if (campagne) {
            queryParams = queryParams.set('campagneIdMetier', campagne.idMetier);
        }
        if (numeroAmm) {
            queryParams = queryParams.set('numeroAmmIdMetier', numeroAmm.idMetier);
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
