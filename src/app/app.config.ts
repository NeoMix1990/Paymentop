import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router'

import { routes } from './app.routes'
import { provideMaterialConfig } from './material.provider'
import { provideHttpClient } from '@angular/common/http'

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideMaterialConfig(),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({ onSameUrlNavigation: 'reload', paramsInheritanceStrategy: 'always' }),
    ),
  ],
}
