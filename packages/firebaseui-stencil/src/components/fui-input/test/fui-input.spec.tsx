import { newSpecPage } from '@stencil/core/testing';
import { FuiInput } from '../fui-input';

describe('fui-input', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FuiInput],
      html: `<fui-input></fui-input>`,
    });
    expect(page.root).toEqualHtml(`
      <fui-input>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </fui-input>
    `);
  });
});
