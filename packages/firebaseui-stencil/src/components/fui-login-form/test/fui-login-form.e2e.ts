import { newE2EPage } from '@stencil/core/testing';

describe('fui-login-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fui-login-form></fui-login-form>');

    const element = await page.find('fui-login-form');
    expect(element).toHaveClass('hydrated');
  });
});
