import { newE2EPage } from '@stencil/core/testing';

describe('fui-forgot-password-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fui-forgot-password-form></fui-forgot-password-form>');

    const element = await page.find('fui-forgot-password-form');
    expect(element).toHaveClass('hydrated');
  });
});
