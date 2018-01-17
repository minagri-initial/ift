import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_URL } from '../../app.config';
import { Unite } from './unite.model';

@Injectable()
export class UniteService {

    constructor(
        @Inject(API_URL) private _apiUrl: string,
        private _http: Http
      ) { }

    list() {
        return this._http.get(this._apiUrl + '/unites')
        .map(response => {
            return response.json() as Unite[];
        });
    }
}
