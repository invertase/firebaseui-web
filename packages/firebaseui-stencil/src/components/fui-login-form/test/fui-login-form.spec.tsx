import { newSpecPage } from '@stencil/core/testing';
import { FuiLoginForm } from '../fui-login-form';

describe('fui-login-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FuiLoginForm],
      html: `<fui-login-form></fui-login-form>`,
    });
    expect(page.root).toEqualHtml(`
      <fui-login-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </fui-login-form>
    `);
  });
});
