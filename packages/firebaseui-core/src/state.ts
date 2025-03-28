import { atom } from "nanostores";

export type FirebaseUIState = 'idle' | 'signing-in' | 'signing-out' | 'linking';

export const $state = atom<FirebaseUIState>('idle');

