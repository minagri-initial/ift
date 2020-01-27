import { Culture, GroupeCulture } from '../culture/culture.model';
import { TraitementIft } from '../traitement-ift';
import { Campagne } from '../campagne';
import { TraitementIftResult } from '../traitement-ift/traitement-ift.model';

export class Bilan {
    campagne: Campagne;
    bilanParcellesCultivees: BilanParcelleCultivee[] = [];
    bilanGroupesCultures: BilanGroupeCultures[] = [];
    bilanParcelles: BilanParcelle[] = [];
    bilanParSegment: BilanParSegment;

    constructor(campagne: Campagne) {
        this.campagne = campagne;
    }
}

export class ParcelleCultivee {
    static DOCUMENT_TYPE = 'parcelle';
    _id: string;
    type = ParcelleCultivee.DOCUMENT_TYPE;
    parcelle: Parcelle;
    culture: Culture;
    campagne: Campagne;
    traitements: TraitementIftResult[] = [];

    constructor(campagne: Campagne, parcelle: Parcelle, culture: Culture) {
        this._id = `${this.type}_${campagne.idMetier}_${parcelle.nom}_${culture.idMetier}`;
        this.parcelle = parcelle;
        this.culture = culture;
        this.campagne = campagne;
    }
}

export class Parcelle {
    nom: string;
    surface: number;

    constructor(nom: string, surface: number) {
        this.nom = nom;
        this.surface = surface;
    }
}

export class BilanParcelleCultivee {
    parcelleCultivee: ParcelleCultivee;
    bilanParSegment: BilanParSegment;
    selected = true;

    constructor(parcelleCultivee: ParcelleCultivee) {
        this.parcelleCultivee = parcelleCultivee;
    }
}

export class BilanGroupeCultures {
    groupeCultures: GroupeCulture;
    bilanCultures: BilanCulture[] = [];
    bilanParSegment: BilanParSegment;
}

export class BilanCulture {
    culture: Culture;
    bilanParSegment: BilanParSegment;
}

export class BilanParcelle {
    parcelle: Parcelle;
    bilanParSegment: BilanParSegment;
}

export class BilanParSegment {
    herbicide: number;
    biocontrole: number;
    insecticidesAcaricides: number;
    fongicidesBactericides: number;
    autres: number;
    semences: number;
    total: number;
    surface: number;
}
