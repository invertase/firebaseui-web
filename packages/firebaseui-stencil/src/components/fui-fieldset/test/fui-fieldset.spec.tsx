import { newSpecPage } from '@stencil/core/testing';
import { FuiFieldset } from '../fui-fieldset';

describe('fui-fieldset', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FuiFieldset],
      html: `<fui-fieldset></fui-fieldset>`,
    });
    expect(page.root).toEqualHtml(`
      <fui-fieldset>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </fui-fieldset>
    `);
  });
});
