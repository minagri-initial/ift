import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { TraitementIft, TraitementIftResult, SignedTraitementIft } from './traitement-ift.model';
import { CustomEncoder } from '../http/custom-codec.class';
import { environment } from '../../../environments/environment';


@Injectable()
export class TraitementIftService {

    private _apiUrl = environment.apiUrl;

    constructor(private _http: HttpClient) { }

    get(id: string) {
        return this._http.get(this._apiUrl + '/ift/traitement/certifie/' + id)
            .map(result => result as TraitementIftResult);
    }

    compute(traitementIft: TraitementIft) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder() });

        queryParams = queryParams.set('campagneIdMetier', traitementIft.campagne.idMetier);
        if (traitementIft.numeroAmm) {
            queryParams = queryParams.set('numeroAmmIdMetier', traitementIft.numeroAmm.idMetier);
        }
        queryParams = queryParams.set('cultureIdMetier', traitementIft.culture.idMetier);
        if (traitementIft.cible) {
            queryParams = queryParams.set('cibleIdMetier', traitementIft.cible.idMetier);
        }
        queryParams = queryParams.set('typeTraitementIdMetier', traitementIft.typeTraitement.idMetier);
        if (traitementIft.unite) {
            queryParams = queryParams.set('uniteIdMetier', traitementIft.unite.idMetier);
        }
        if (traitementIft.dose) {
            queryParams = queryParams.set('dose', traitementIft.dose.toString());
        }
        if (traitementIft.volumeDeBouillie) {
            queryParams = queryParams.set('volumeDeBouillie', traitementIft.volumeDeBouillie.toString());
        }
        if (traitementIft.facteurDeCorrection) {
            queryParams = queryParams.set('facteurDeCorrection', traitementIft.facteurDeCorrection.toString());
        }

        return this._http.get(this._apiUrl + '/ift/traitement', { params: queryParams })
            .map(result => result as TraitementIftResult);
    }

    computeSigned(traitementIft: TraitementIft) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder() });

        queryParams = queryParams.set('campagneIdMetier', traitementIft.campagne.idMetier);
        if (traitementIft.numeroAmm) {
            queryParams = queryParams.set('numeroAmmIdMetier', traitementIft.numeroAmm.idMetier);
        }
        queryParams = queryParams.set('cultureIdMetier', traitementIft.culture.idMetier);
        if (traitementIft.cible) {
            queryParams = queryParams.set('cibleIdMetier', traitementIft.cible.idMetier);
        }
        queryParams = queryParams.set('typeTraitementIdMetier', traitementIft.typeTraitement.idMetier);
        if (traitementIft.unite) {
            queryParams = queryParams.set('uniteIdMetier', traitementIft.unite.idMetier);
        }
        if (traitementIft.dose) {
            queryParams = queryParams.set('dose', traitementIft.dose.toString());
        }
        if (traitementIft.volumeDeBouillie) {
            queryParams = queryParams.set('volumeDeBouillie', traitementIft.volumeDeBouillie.toString());
        }
        if (traitementIft.facteurDeCorrection) {
            queryParams = queryParams.set('facteurDeCorrection', traitementIft.facteurDeCorrection.toString());
        }
        if (traitementIft.produit) {
            queryParams = queryParams.set('produitLibelle', traitementIft.produit.libelle);
        }
        if (traitementIft.commentaire) {
            queryParams = queryParams.set('commentaire', traitementIft.commentaire);
        }

        return this._http.get(this._apiUrl + '/ift/traitement/certifie', { params: queryParams })
            .map(result => result as SignedTraitementIft);
    }

    downloadSignedIftUrl(titre: string, traitementIft: TraitementIft) {
        let queryParams = new HttpParams({ encoder: new CustomEncoder() });

        if (titre) {
            queryParams = queryParams.set('titre', titre);
        }

        queryParams = queryParams.set('campagneIdMetier', traitementIft.campagne.idMetier);
        if (traitementIft.numeroAmm) {
            queryParams = queryParams.set('numeroAmmIdMetier', traitementIft.numeroAmm.idMetier);
        }
        queryParams = queryParams.set('cultureIdMetier', traitementIft.culture.idMetier);
        if (traitementIft.cible) {
            queryParams = queryParams.set('cibleIdMetier', traitementIft.cible.idMetier);
        }
        queryParams = queryParams.set('typeTraitementIdMetier', traitementIft.typeTraitement.idMetier);
        if (traitementIft.unite) {
            queryParams = queryParams.set('uniteIdMetier', traitementIft.unite.idMetier);
        }
        if (traitementIft.dose) {
            queryParams = queryParams.set('dose', traitementIft.dose.toString());
        }
        if (traitementIft.volumeDeBouillie) {
            queryParams = queryParams.set('volumeDeBouillie', traitementIft.volumeDeBouillie.toString());
        }
        if (traitementIft.facteurDeCorrection) {
            queryParams = queryParams.set('facteurDeCorrection', traitementIft.facteurDeCorrection.toString());
        }
        if (traitementIft.produit) {
            queryParams = queryParams.set('produitLibelle', traitementIft.produit.libelle);
        }
        if (traitementIft.commentaire) {
            queryParams = queryParams.set('commentaire', traitementIft.commentaire);
        }

        return this._http.get(this._apiUrl + '/ift/traitement/certifie/pdf', { responseType: 'blob', params: queryParams })
            .map(result => result as Blob);
    }

}
