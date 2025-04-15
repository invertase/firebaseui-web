// src/app/policies/providePolicies.ts
import { Provider } from '@angular/core';
import { POLICY_CONFIG, PolicyConfig } from './policy.config';

export function providePolicies(): Provider {
  return {
    provide: POLICY_CONFIG,
    useValue: {
      termsOfServiceUrl: 'https://yourdomain.com/terms',
      privacyPolicyUrl: 'https://yourdomain.com/privacy',
    } satisfies PolicyConfig,
  };
}
