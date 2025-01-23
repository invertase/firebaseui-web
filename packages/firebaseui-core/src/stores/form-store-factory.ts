import type { LoginType, FormStoreType } from './types';
import type { FUIConfig } from '../types';
import { EmailFormStore } from './email-form-store';
import { PhoneFormStore } from './phone-form-store';
import { EmailLinkFormStore } from './email-link-form-store';
import { atom } from 'nanostores';

export class FormStoreFactory {
  private readonly config: FUIConfig;
  private readonly stores: Map<LoginType, FormStoreType> = new Map();
  private readonly activeLoginType = atom<LoginType>('email');

  constructor(config: FUIConfig) {
    this.config = config;
  }

  public getStore<T extends FormStoreType>(type: LoginType): T {
    if (!this.stores.has(type)) {
      this.stores.set(type, this.createStore(type));
    }
    return this.stores.get(type) as T;
  }

  public setActiveLoginType(type: LoginType) {
    this.activeLoginType.set(type);
    // Reset the previous store if it exists
    const currentStore = this.stores.get(type);
    if (currentStore) {
      currentStore.reset();
    }
  }

  public get activeType() {
    return this.activeLoginType.get();
  }

  private createStore(type: LoginType): FormStoreType {
    switch (type) {
      case 'email':
        return new EmailFormStore(this.config);
      case 'phone':
        return new PhoneFormStore(this.config);
      case 'emailLink':
        return new EmailLinkFormStore(this.config);
      default:
        throw new Error(`Store type ${type} not implemented`);
    }
  }

  public reset() {
    this.stores.forEach((store) => store.reset());
  }
}
