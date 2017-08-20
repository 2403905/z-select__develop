import { ZSelectPage } from './app.po';

describe('z-select App', () => {
  let page: ZSelectPage;

  beforeEach(() => {
    page = new ZSelectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
