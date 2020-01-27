import { Campagne } from '../campagne';
import { Culture } from '../culture';
import { Cible } from '../cible';
import { TypeTraitement } from '../type-traitement';
import { NumeroAmm, Produit } from '../numero-amm';
import { Unite } from '../unite';

export class TraitementIft {
    campagne: Campagne;
    culture: Culture;
    produit: Produit;
    numeroAmm: NumeroAmm;
    cible: Cible;
    typeTraitement: TypeTraitement;
    dose: number;
    unite: Unite;
    volumeDeBouillie: number;
    facteurDeCorrection = 100;
    dateTraitement: string;
    produitLibelle: string;
    commentaire: string;

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
    id: string;
    iftTraitement: TraitementIftResult;
    signature: string;
}

export class TraitementIftResult {
    campagne: Campagne;
    culture: Culture;
    produit: Produit;
    numeroAmm: NumeroAmm;
    cible: Cible;
    typeTraitement: TypeTraitement;
    dose: number;
    unite: Unite;
    volumeDeBouillie: number;
    facteurDeCorrection = 100;
    dateTraitement: string;
    produitLibelle: string;
    commentaire: string;

    ift: number;
    segment: Segment;
    avertissement: {
        id: string,
        idMetier: string,
        libelle: string
    };
    doseReference: number;
    uniteDoseReference: Unite;

    dateCreation: string;
}


