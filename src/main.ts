import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppInjector } from './app/app-injector.service';

import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWXxfcnVXQmBeUUx2Xko=');

if (environment.production) {
  enableProdMode();
  if(window){
    window.console.log=function(){};
   }  
}

  platformBrowserDynamic().bootstrapModule(AppModule).then((moduleRef) => {
    AppInjector.setInjector(moduleRef.injector);
}).catch(err => console.error(err));       

