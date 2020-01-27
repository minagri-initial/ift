import { DoseReferenceService } from './dose';
import { UniteService } from './unite';
import { QRCodeService } from './qr-code/qr-code.service';
import { UpdateDbModalComponent } from './db/update-db-modal.component';

import { CampagneModule } from './campagne/campagne.module';
import { CultureModule } from './culture/culture.module';
import { CibleModule } from './cible/cible.module';
import { NumeroAmmModule } from './numero-amm/numero-amm.module';
import { TypeTraitementModule } from './type-traitement/type-traitement.module';
import { SurfaceModule } from './surface/surface.module';
import { DirectivesModule } from './directives/directives.modules';

export const SHARED_BUSINESS_MODULES = [
    CampagneModule,
    CultureModule,
    CibleModule,
    NumeroAmmModule,
    TypeTraitementModule,
    SurfaceModule,
    DirectivesModule
];

export const SHARED_COMPONENTS = [
    UpdateDbModalComponent
];

export const SHARED_ENTRY_COMPONENTS = [
    UpdateDbModalComponent
];

export const SHARED_SERVICES = [
    UniteService,
    DoseReferenceService,
    QRCodeService
];
