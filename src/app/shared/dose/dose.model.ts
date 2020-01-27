import { Unite } from '../unite/unite.model';
import { NumeroAmm } from '../numero-amm/numero-amm.model';
import { Campagne } from '../campagne/campagne.model';
import { Culture } from '../culture/culture.model';
import { Segment } from '../traitement-ift/traitement-ift.model';
import { Cible } from '../cible/cible.model';
import { Produit } from '../numero-amm/produit.model';

export class Dose {
    id: string;
    unite: Unite;
    dose: number;
}

export class DoseReference extends Dose {
    numeroAmm: NumeroAmm;
    campagne: Campagne;
    biocontrole: boolean;
    culture: Culture;
    cible?: Cible;
    segment: Segment;
}

export class ProduitDoseReference extends DoseReference {
    produit: Produit;
    numeroAmm: NumeroAmm;
    campagne: Campagne;
    biocontrole: boolean;
    culture: Culture;
    cible?: Cible;
    segment: Segment;
}
