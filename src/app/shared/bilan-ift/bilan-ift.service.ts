import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CustomEncoder } from '../http/custom-codec.class';

import { clone } from 'lodash';

import { Segment } from '../traitement-ift';
import { GroupeCulture } from '../culture';
import { Bilan, BilanParcelleCultivee, BilanGroupeCultures } from './bilan.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class BilanIftService {

    private _apiUrl = environment.apiUrl;

    constructor(
        private _http: HttpClient
    ) { 
    }

    get(id: string) {
        return this._http.get(this._apiUrl + '/ift/bilan/verifier/' + id)
            .map(result => result as Bilan);
    }

    getBilan(parcelles) {
        const params = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
        return this._http.post(this._apiUrl + '/ift/bilan', JSON.stringify({ parcellesCultivees: parcelles }), params)
            .map(result => result as Bilan);
    }

    getShareUrl(campagne, parcelles) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder() });
        queryParams = queryParams.set('campagneIdMetier', campagne.idMetier);

        return this._http.post(this._apiUrl + '/ift/bilan/certifie', JSON.stringify({ parcellesCultivees: parcelles }),
            { headers: new HttpHeaders().set('Content-Type', 'application/json'), params: queryParams })
            .map(result => result as { bilan: Bilan, verificationUrl: string });
    }

    getBilanPDF(campagne, titre, parcelles) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder() });
        queryParams = queryParams.set('campagneIdMetier', campagne.idMetier);
        if (titre) {
            queryParams = queryParams.set('titre', titre);
        }

        return this._http.post(this._apiUrl + '/ift/bilan/pdf', JSON.stringify({ parcellesCultivees: parcelles }),
            { headers: new HttpHeaders().set('Content-Type', 'application/json'), params: queryParams, responseType: 'blob' })
            .map(result => result as Blob);
    }

    groupByParcelle(bilan: Bilan) {
        const byParcelle = {};

        bilan.bilanParcelles.forEach(bilanParcelle => {
            let totalParcelle = byParcelle[bilanParcelle.parcelle.nom];

            totalParcelle = clone(bilanParcelle.bilanParSegment);
            totalParcelle.surface = bilanParcelle.bilanParSegment.surface;

            byParcelle[bilanParcelle.parcelle.nom] = totalParcelle;
        });

        return byParcelle;
    }

    groupByCulture(bilan: Bilan) {
        const byCulture = {};

        bilan.bilanGroupesCultures.forEach((bilanGroupeCultures: BilanGroupeCultures) => {
            bilanGroupeCultures.bilanCultures.forEach(bilanCulture => {
                let totalParcelle = byCulture[bilanCulture.culture.libelle];

                totalParcelle = clone(bilanCulture.bilanParSegment);
                totalParcelle.surface = bilanCulture.bilanParSegment.surface;

                byCulture[bilanCulture.culture.libelle] = totalParcelle;
            });
        });

        return byCulture;
    }

}

function precisionRound(number, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}
