import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './shared/interceptor/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
     provideClientHydration(),
     provideAnimationsAsync(),
     provideHttpClient(withFetch(),
     withInterceptors([authInterceptor]),
    ),
  ]
  // providers: [
  //   provideRouter(routes),
  //   provideClientHydration(),
  //   provideAnimationsAsync(),
  //   provideHttpClient(withInterceptors([authInterceptor])),
  //   // provideHttpClient(withInterceptors([authInterceptor])),
  //   importProvidersFrom(BrowserAnimationsModule),
  // ],
};
