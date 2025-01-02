import { newE2EPage } from '@stencil/core/testing';

describe('fui-input', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<fui-input></fui-input>');

    const element = await page.find('fui-input');
    expect(element).toHaveClass('hydrated');
  });
});
