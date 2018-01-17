import { Campagne } from '../shared/campagne';
import { Culture } from '../shared/culture';
import { Cible } from '../shared/cible';
import { Traitement } from '../shared/traitement';
import { NumeroAmm, Produit } from '../shared/numero-amm';
import { Unite } from '../shared/unite';

export class TraitementIft {
    campagne: Campagne;
    culture: Culture;
    produit: Produit;
    numeroAmm: NumeroAmm;
    cible: Cible;
    traitement: Traitement;
    dose: number;
    unite: Unite;
    volumeDeBouillie = 1000;
    facteurDeCorrection = 100;

    constructor(campagne: Campagne) {
        this.campagne = campagne;
    }

}

export class Segment {
    id: string;
    idMetier: string;
    libelle: string;
    description: string;
}

export class SignedTraitementIft {
    iftTraitement: TraitementIftResult;
    signature: string;
}

export class TraitementIftResult {
    ift: number;
    segment: Segment;
    avertissement: {
        id: string,
        idMetier: string,
        libelle: string
    };
    campagne: Campagne;
    culture: Culture;
    numeroAmm: NumeroAmm;
    cible: Cible;
    traitement: Traitement;
    dose: number;
    unite: Unite;
    volumeDeBouillie: number;
    facteurDeCorrection = 100;
    dateCreation: string;
}


