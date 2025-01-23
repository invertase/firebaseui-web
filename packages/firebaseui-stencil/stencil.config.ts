import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
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
      copy: [
        {
          src: '../src/config.ts',
          dest: 'esm/config.js',
        },
        {
          src: '../src/auth',
          dest: 'esm/auth',
        },
      ],
    },
    { type: 'dist-custom-elements', externalRuntime: false },
    // {
    //   type: 'dist-hydrate-script',
    //   dir: './hydrate',
    // },
    reactOutputTarget({
      // esModules: true,
      // stencilPackageName: 'firebaseui-stencil',
      outDir: '../firebaseui-react/lib/components/stencil-generated',
      // hydrateModule: 'firebaseui-stencil/hydrate',
    }),
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      baseUrl: 'http://localhost:3333',
    },
  ],
  testing: {
    browserHeadless: 'new',
  },
};
