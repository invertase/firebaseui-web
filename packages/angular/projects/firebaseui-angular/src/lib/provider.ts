import {
  Provider,
  EnvironmentProviders,
  makeEnvironmentProviders,
  InjectionToken,
  Injectable,
  inject,
} from '@angular/core';
import {
  getTranslation,
  initializeUI,
  TranslationStrings,
} from '@firebase-ui/core';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { Store } from 'nanostores';

type FUIStore = ReturnType<typeof initializeUI>;

const FIREBASE_UI_STORE = new InjectionToken<FUIStore>('firebaseui.store');

export function provideFirebaseUI(
  uiFactory: () => FUIStore
): EnvironmentProviders {
  const providers: Provider[] = [
    // TODO: This should depend on the FirebaseAuth provider via deps,
    // see https://github.com/angular/angularfire/blob/35e0a9859299010488852b1826e4083abe56528f/src/firestore/firestore.module.ts#L76
    { provide: FIREBASE_UI_STORE, useFactory: uiFactory },
  ];

  return makeEnvironmentProviders(providers);
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseUi {
  private store = inject(FIREBASE_UI_STORE);
  private destroyed$: ReplaySubject<void> = new ReplaySubject(1);

  config() {
    return this.useStore(this.store);
  }

  translation<T extends keyof Required<TranslationStrings>>(
    category: T,
    key: keyof Required<TranslationStrings>[T]
  ) {
    return this.config().pipe(
      map((config) => getTranslation(category, key, config.translations))
    );
  }

  useStore<T>(store: Store<T>): Observable<T> {
    return new Observable<T>((sub) => {
      sub.next(store.get());
      return store.subscribe((value) => sub.next(value));
    }).pipe(distinctUntilChanged(), takeUntil(this.destroyed$));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
