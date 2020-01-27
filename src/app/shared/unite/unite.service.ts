import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { Unite } from './unite.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class UniteService {

    private _apiUrl = environment.apiUrl;

    constructor(private _http: Http) { }

    list() {
        return this._http.get(this._apiUrl + '/unites')
        .map(response => {
            return response.json() as Unite[];
        });
    }
}
