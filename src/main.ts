import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  const noop = () => {};
  console.log = noop;
  console.warn = noop;
  console.info = noop;
  console.debug = noop;

}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {

    if (environment.production) {
      console.error('Application startup error');
    } else {
      console.error(err);
    }
  });