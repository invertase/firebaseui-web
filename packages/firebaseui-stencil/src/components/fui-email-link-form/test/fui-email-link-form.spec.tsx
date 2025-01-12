import { newSpecPage } from '@stencil/core/testing';
import { FuiEmailLinkForm } from '../fui-email-link-form';

describe('fui-email-link-form', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [FuiEmailLinkForm],
      html: `<fui-email-link-form></fui-email-link-form>`,
    });
    expect(page.root).toEqualHtml(`
      <fui-email-link-form>
        <mock:shadow-root>
          <div class="space-y-6">
            <fui-fieldset class="mb-4" inputid="email" label="Email" required="true">
              <fui-input></fui-input>
            </fui-fieldset>
          </div>
        </mock:shadow-root>
      </fui-email-link-form>
    `);
  });
});
