import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as browserUpdate from 'browser-update';

browserUpdate({
    notify: { i: -5, f: -4, o: -4, s: -1, c: -4 },
    insecure: true,
    api: 5
});

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
