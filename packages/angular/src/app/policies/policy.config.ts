import { InjectionToken } from '@angular/core';

export interface PolicyConfig {
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;
}

export const POLICY_CONFIG = new InjectionToken<PolicyConfig>('PolicyConfig');
