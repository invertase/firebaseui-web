import { newSpecPage } from '@stencil/core/testing';
import { FuiPhoneForm } from '../fui-phone-form';

describe('fui-phone-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FuiPhoneForm],
      html: `<fui-phone-form></fui-phone-form>`,
    });
    expect(page.root).toEqualHtml(`
      <fui-phone-form>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </fui-phone-form>
    `);
  });
});
