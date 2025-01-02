import { JSXBase } from '@stencil/core/internal';

declare global {
  interface InputHTMLAttributes<T> extends JSXBase.InputHTMLAttributes<T> {}
}
