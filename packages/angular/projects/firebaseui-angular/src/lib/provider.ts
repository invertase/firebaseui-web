import { Provider, EnvironmentProviders, makeEnvironmentProviders, InjectionToken, Injectable, inject } from '@angular/core';
import { NanostoresService, NANOSTORES } from '@nanostores/angular';
import { FUIConfig, getTranslation, initializeUI, TranslationStrings } from '@firebase-ui/core';
import { map } from 'rxjs/operators';

type Store = ReturnType<typeof initializeUI>;

export const FIREBASE_UI_STORE = new InjectionToken<Store>('firebaseui.store');

let isNanostoresRegistered = false;

export function provideFirebaseUi(uiFactory: () => Store): EnvironmentProviders {
  const providers: Provider[] = [
    { provide: FIREBASE_UI_STORE, useFactory: uiFactory }
  ];

  if (!isNanostoresRegistered) {
    providers.push({ provide: NANOSTORES, useClass: NanostoresService });
    isNanostoresRegistered = true;
  }

  return makeEnvironmentProviders(providers);
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseUi {
  private store = inject(FIREBASE_UI_STORE);
  private nanostores = inject<NanostoresService>(NANOSTORES);

  config() {
    return this.nanostores.useStore(this.store);
  }

  translation<T extends keyof Required<TranslationStrings>>(
    category: T,
    key: keyof Required<TranslationStrings>[T]
  ) {
    const foo = this.config().pipe(
      map(config => getTranslation(category, key, config.translations))
    );

    return foo;
  }
}