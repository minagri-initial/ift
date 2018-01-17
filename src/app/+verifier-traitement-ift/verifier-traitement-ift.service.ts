import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { API_URL } from '../app.config';
import { TraitementIftResult } from '../+traitement-ift/traitement-ift.model';
import { CustomEncoder } from '../shared/http/custom-codec.class';

@Injectable()
export class VerifierTraitementIftService {

    constructor(
        @Inject(API_URL) private _apiUrl: string,
        private _http: HttpClient
    ) { }

    get(signature: string) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder() });

        queryParams = queryParams.set('signature', signature);

        return this._http.get(this._apiUrl + '/ift/traitement/verification-signature/', { params: queryParams })
            .map(result => result as TraitementIftResult);
    }

}
