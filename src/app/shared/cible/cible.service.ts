import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { API_URL } from '../../app.config';
import { Cible } from './cible.model';
import { NumeroAmm } from '../numero-amm/numero-amm.model';
import { Campagne } from '../campagne/campagne.model';
import { Culture } from '../culture/culture.model';
import { CustomEncoder } from '../http/custom-codec.class';

@Injectable()
export class CibleService {

    constructor(
        @Inject(API_URL) private _apiUrl: string,
        private _http: HttpClient
      ) { }

    query(campagne?: Campagne, culture?: Culture, numeroAmm?: NumeroAmm, filter?: string, size?: number) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder()});

        if (campagne) {
            queryParams = queryParams.set('campagneIdMetier', campagne.idMetier);
        }
        if (culture) {
            queryParams = queryParams.set('cultureIdMetier', culture.idMetier);
        }
        if (numeroAmm) {
            queryParams = queryParams.set('numeroAmmIdMetier', numeroAmm.idMetier);
        }
        if (filter) {
            queryParams = queryParams.set('filtre', filter);
        }
        if (size) {
            queryParams = queryParams.set('size', size.toString());
        }

        return this._http.get(this._apiUrl + '/cibles', { params: queryParams })
            .map(response => response as Cible[]);
    }
}
