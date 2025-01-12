import { newE2EPage } from '@stencil/core/testing';

describe('fui-email-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fui-email-form></fui-email-form>');

    const element = await page.find('fui-email-form');
    expect(element).toHaveClass('hydrated');
  });
});
