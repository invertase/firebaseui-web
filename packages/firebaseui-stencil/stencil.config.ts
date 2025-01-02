import { Config } from '@stencil/core';
import tailwind, { tailwindGlobal, setPluginConfigurationDefaults, tailwindHMR } from 'stencil-tailwind-plugin';
import tailwindConf from './tailwind.config';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

setPluginConfigurationDefaults({
  tailwindConf,
  tailwindCssPath: './src/styles/global.css',
  postcss: {
    plugins: [tailwindcss(), autoprefixer()],
  },
});

export const config: Config = {
  namespace: 'firebaseui-stencil',
  plugins: [tailwindGlobal(), tailwind(), tailwindHMR()],
  devServer: {
    // Tailwind does not work correctly with HMR
    reloadStrategy: 'pageReload',
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false,
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    browserHeadless: 'new',
  },
};
