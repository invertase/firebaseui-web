import { newSpecPage } from '@stencil/core/testing';
import { FuiEmailForm } from '../fui-email-form';

describe('fui-email-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FuiEmailForm],
      html: `<fui-email-form></fui-email-form>`,
    });
    expect(page.root).toEqualHtml(`
      <fui-email-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </fui-email-form>
    `);
  });
});
