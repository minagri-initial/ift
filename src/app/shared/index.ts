import { CampagneService } from './campagne';
import { CultureService, CultureFieldComponent } from './culture';
import { NumeroAmmFieldComponent, ProduitFieldComponent, ProduitService, NumeroAmmService } from './numero-amm';
import { CibleFieldComponent, CibleService } from './cible';
import { TraitementFieldComponent, TraitementService } from './traitement';
import { SelectComponent } from './select';
import { SurfaceFieldComponent } from './surface';
import { DoseReferenceService } from './dose';
import { UniteService } from './unite';
import { AvisComponent, AvisService } from './avis';
import { StarSliderComponent } from './star-slider/star-slider.component';
import { GaugeComponent } from './gauge/gauge.component';

export const SHARED_COMPONENTS = [
    CultureFieldComponent,
    NumeroAmmFieldComponent,
    ProduitFieldComponent,
    CibleFieldComponent,
    TraitementFieldComponent,
    SelectComponent,
    SurfaceFieldComponent,
    AvisComponent,
    StarSliderComponent,
    GaugeComponent
];

export const SHARED_SERVICES = [
    CultureService,
    ProduitService,
    NumeroAmmService,
    CibleService,
    CampagneService,
    UniteService,
    TraitementService,
    DoseReferenceService,
    AvisService
];
