import { newE2EPage } from '@stencil/core/testing';

describe('fui-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fui-button></fui-button>');

    const element = await page.find('fui-button');
    expect(element).toHaveClass('hydrated');
  });
});
