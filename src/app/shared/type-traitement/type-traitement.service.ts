import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { TypeTraitement } from './type-traitement.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class TypeTraitementService {

    private _apiUrl = environment.apiUrl;

    constructor(private _http: Http) { }

    list() {
        return this._http.get(this._apiUrl + '/types-traitements')
            .map(response => {
                return response.json() as TypeTraitement[];
            });
    }
}
