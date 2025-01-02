import { newSpecPage } from '@stencil/core/testing';
import { FuiButton } from '../fui-button';

describe('fui-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FuiButton],
      html: `<fui-button></fui-button>`,
    });
    expect(page.root).toEqualHtml(`
      <fui-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </fui-button>
    `);
  });
});
