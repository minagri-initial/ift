import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { API_URL } from '../app.config';
import { Segment } from '../+traitement-ift/index';
import { GroupeCulture } from '../shared/culture/index';
import { Bilan } from './bilan.model';

@Injectable()
export class BilanIftService {

    constructor(
        @Inject(API_URL) private _apiUrl: string,
        private _http: HttpClient
    ) { }

    getBilan(parcelles) {
        const params = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
        return this._http.post(this._apiUrl + '/ift/bilan', JSON.stringify(parcelles), params)
            .map(result => result as Bilan);
    }

}
