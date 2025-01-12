import { newE2EPage } from '@stencil/core/testing';

describe('fui-phone-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fui-phone-form></fui-phone-form>');

    const element = await page.find('fui-phone-form');
    expect(element).toHaveClass('hydrated');
  });
});
