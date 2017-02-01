import {Homepage} from './app.po';

describe(`grafaro App`, function () {

    let page: Homepage;

    beforeEach(() => {
        page = new Homepage();
        page.navigateTo();
    });

    it(`should have logo`, () => {
        expect(page.getLogoBackgroundImage()).toContain(`assets/logo.svg`);
    });

});
