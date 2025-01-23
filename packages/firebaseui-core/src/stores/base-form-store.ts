import { map, MapStore } from 'nanostores';
import type { BaseFormState, LoginResult } from './types';
import type { FUIConfig } from '../types';

export abstract class BaseFormStore<T extends object> {
  protected readonly config: FUIConfig;
  protected readonly state: MapStore<BaseFormState & T>;

  constructor(config: FUIConfig) {
    this.config = config;
    this.state = map<BaseFormState & T>({
      ...this.getInitialState(),
      isLoading: false,
      error: null,
    });
  }

  public get value() {
    return this.state.get();
  }

  public reset() {
    this.state.set({
      ...this.getInitialState(),
      isLoading: false,
      error: null,
    });
  }

  protected abstract getInitialState(): T;
  public abstract submit(): Promise<LoginResult>;
}
