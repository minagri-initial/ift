import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_URL } from '../../app.config';
import { Traitement } from './traitement.model';

@Injectable()
export class TraitementService {

    constructor(
        @Inject(API_URL) private _apiUrl: string,
        private _http: Http
      ) { }

    list() {
        return this._http.get(this._apiUrl + '/traitements')
        .map(response => {
            return response.json() as Traitement[];
        });
    }
}
