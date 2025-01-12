import { newSpecPage } from '@stencil/core/testing';
import { FuiForgotPasswordForm } from '../fui-forgot-password-form';

describe('fui-forgot-password-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FuiForgotPasswordForm],
      html: `<fui-forgot-password-form></fui-forgot-password-form>`,
    });
    expect(page.root).toEqualHtml(`
      <fui-forgot-password-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </fui-forgot-password-form>
    `);
  });
});
