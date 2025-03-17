import {
  Provider,
  EnvironmentProviders,
  makeEnvironmentProviders,
  InjectionToken,
  Injectable,
  inject,
} from '@angular/core';
import { NanostoresService, NANOSTORES } from '@nanostores/angular';
import {
  FUIConfig,
  getTranslation,
  initializeUI,
  TranslationStrings,
} from '@firebase-ui/core';
import { map } from 'rxjs/operators';

type Store = ReturnType<typeof initializeUI>;

const FIREBASE_UI_STORE = new InjectionToken<Store>('firebaseui.store');

export function provideFirebaseUI(
  uiFactory: () => Store
): EnvironmentProviders {
  const providers: Provider[] = [
    // TODO: This should depend on the FirebaseAuth provider via deps,
    // see https://github.com/angular/angularfire/blob/35e0a9859299010488852b1826e4083abe56528f/src/firestore/firestore.module.ts#L76
    { provide: FIREBASE_UI_STORE, useFactory: uiFactory },
    { provide: NANOSTORES, useClass: NanostoresService },
  ];

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
    return this.config().pipe(
      map((config) => getTranslation(category, key, config.translations))
    );
  }
}
