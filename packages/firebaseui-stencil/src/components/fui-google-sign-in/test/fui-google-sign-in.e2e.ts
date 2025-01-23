import { newE2EPage } from '@stencil/core/testing';

describe('fui-google-sign-in', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fui-google-sign-in></fui-google-sign-in>');

    const element = await page.find('fui-google-sign-in');
    expect(element).toHaveClass('hydrated');
  });
});
