import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '../../app.config';
import { Campagne } from './campagne.model';

import * as _ from 'lodash';

@Injectable()
export class CampagneService {

    constructor(
        @Inject(API_URL) private _apiUrl: string,
        private _http: HttpClient
    ) { }

    list() {
        return this._http.get(this._apiUrl + '/campagnes')
            .map(campagnes => {
                return _.sortBy(campagnes, 'idMetier') as Campagne[];
            });
    }

    get(idMetier: string) {
        return this._http.get(this._apiUrl + '/campagnes/' + idMetier)
            .map(response => response as Campagne);
    }
}
