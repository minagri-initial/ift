import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../../app.config';
import { Avis } from './avis.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AvisService {

  constructor(
    @Inject(API_URL) private _apiUrl: string,
    private _http: HttpClient
  ) { }

  addAvis(avis: Avis) {
      const params = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this._http.post(this._apiUrl + '/avis', JSON.stringify(avis), params)
      .map((response: Response) => response);
  }

}
