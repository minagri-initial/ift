import { Culture } from '../shared/culture/culture.model';
import { TraitementIft } from '../+traitement-ift';
import { Campagne } from '../shared/campagne';

export class Bilan {
    campagne: Campagne;
    bilanParcelles: BilanParcelle[] = [];
    total: TotalBilan;

    constructor(campagne: Campagne) {
        this.campagne = campagne;
    }
}

export class Parcelle {
    static DOCUMENT_TYPE = 'parcelle';
    _id: string;
    type = Parcelle.DOCUMENT_TYPE;
    nom: string;
    culture: Culture;
    traitements: TraitementParcelle[] = [];

    constructor(nom: string, culture: Culture) {
        this._id = `${this.type}_${nom}_${culture.idMetier}`;
        this.nom = nom;
        this.culture = culture;
    }

    static parse(parcellePojo: any) {
        const parcelle = new Parcelle(parcellePojo.nom, parcellePojo.culture as Culture);
        return Object.assign(parcelle, parcellePojo);
    }

    //TODO : move to ift-db.service.ts and remove parse method
    public filterTraitementsByCampagne(campagne: Campagne) {
        const parcelle = Object.assign({}, this);
        parcelle.traitements = parcelle.traitements.filter(traitement => {
            return traitement.iftTraitement.campagne.idMetier === campagne.idMetier;
        });

        return parcelle;
    }


}

export class BilanParcelle extends Parcelle {
    traitements: BilanTraitementParcelle[];
    total: TotalBilan;

}

export class TraitementParcelle {
    date: string;
    iftTraitement: TraitementIft;

    constructor(campagne: Campagne) {
        this.iftTraitement = new TraitementIft(campagne);
    }
}

export class BilanTraitementParcelle extends TraitementParcelle {
    total: TotalBilan;
}

export class TotalBilan {
    herbicide: number;
    horsHerbicide: number;
}
