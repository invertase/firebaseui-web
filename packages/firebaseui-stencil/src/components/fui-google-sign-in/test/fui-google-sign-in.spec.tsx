import { newSpecPage } from '@stencil/core/testing';
import { FuiGoogleSignIn } from '../fui-google-sign-in';

describe('fui-google-sign-in', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FuiGoogleSignIn],
      html: `<fui-google-sign-in></fui-google-sign-in>`,
    });
    expect(page.root).toEqualHtml(`
      <fui-google-sign-in>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </fui-google-sign-in>
    `);
  });
});
