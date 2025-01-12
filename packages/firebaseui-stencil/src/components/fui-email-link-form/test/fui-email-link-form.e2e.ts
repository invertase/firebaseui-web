import { newE2EPage } from '@stencil/core/testing';

describe('fui-email-link-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fui-email-link-form></fui-email-link-form>');

    const element = await page.find('fui-email-link-form');
    expect(element).toHaveClass('hydrated');
  });
});
