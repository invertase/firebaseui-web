import { newE2EPage } from '@stencil/core/testing';

describe('fui-fieldset', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fui-fieldset></fui-fieldset>');

    const element = await page.find('fui-fieldset');
    expect(element).toHaveClass('hydrated');
  });
});
