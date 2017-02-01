import {browser} from 'protractor';

export class Homepage {

    public navigateTo() {
        return browser.get('/');
    }

    public getLogoBackgroundImage() {
        return browser.$('#logo').getCssValue('background-image');
    }

}
