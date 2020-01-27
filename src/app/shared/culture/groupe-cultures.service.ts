import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';

import { GroupeCulture } from './culture.model';
import { environment } from '../../../environments/environment';

import { sortBy } from 'lodash';

@Injectable()
export class GroupeCulturesService {

    private _apiUrl = environment.apiUrl;

    constructor(
        private _http: HttpClient
    ) { }

    list() {
        return this._http.get(this._apiUrl + '/groupes-cultures')
            .map(groupesCultures => {
                return sortBy(groupesCultures, 'idMetier') as GroupeCulture[];
            });
    }
}
