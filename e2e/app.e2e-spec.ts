import { GrafaroPage } from './app.po';

describe('grafaro App', function() {
  let page: GrafaroPage;

  beforeEach(() => {
    page = new GrafaroPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
