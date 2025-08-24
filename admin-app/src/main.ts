import 'zone.js';  // Required for Angular
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Use bootstrapModule for NgModule-based apps
console.log('🚀 Starting Angular app...');
platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => console.log('✅ Angular app started successfully'))
  .catch((err: any) => {
    console.error('❌ Angular bootstrap failed:', err);
    document.body.innerHTML = '<h1>Angular Bootstrap Error</h1><pre>' + err.message + '</pre>';
  });