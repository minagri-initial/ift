import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Avis } from './avis.model';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class AvisService {

  private _apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  addAvis(avis: Avis) {
      const params = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this._http.post(this._apiUrl + '/avis', JSON.stringify(avis), params)
      .map((response: Response) => response);
  }

}
