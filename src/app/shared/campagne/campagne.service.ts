import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

import { Campagne } from './campagne.model';

import { sortBy } from 'lodash';
import { environment } from '../../../environments/environment';

@Injectable()
export class CampagneService {

    private _apiUrl = environment.apiUrl;
	private _activeCampagne: BehaviorSubject<Campagne> = new BehaviorSubject(undefined);
	
    constructor(private _http: HttpClient) {
		this.getActiveCampagne();
    }

    get activeCampagne(): Observable<Campagne> {
        return this._activeCampagne.asObservable();
    }

    list() {
        return this._http.get(this._apiUrl + '/campagnes')
            .map(campagnes => {
                return sortBy(campagnes, 'idMetier') as Campagne[];
            });
    }

    get(idMetier: string) {
        return this._http.get(this._apiUrl + '/campagnes/' + idMetier)
            .map(response => response as Campagne);
    }

    private getActiveCampagne() {
        this._http.get(this._apiUrl + '/campagnes/courante')
            .map(response => response as Campagne)
            .subscribe((result: Campagne) => {
                this._activeCampagne.next(result);
            });
    }
}
