import {browser, by} from 'protractor';

export class ProjectViewDummyRoomPage {

    public navigateTo() {
        browser.get('/room/123456');
    }

    public getLogoBackgroundImage() {
        return browser.$('#logo').getCssValue('background-image');
    }

    public getTitle() {
        return browser.$('#project-name > .project-title > .text').getText();
    }

    // 1-based index
    public chooseTab(n: number) {
        return browser.$(`ul.tab-controls > li:nth-child(${n})`).click();
    }

    public chooseTabChat() {
        this.chooseTab(1);
    }

    public chooseTabAlgorithm() {
        this.chooseTab(3);
    }

    public chooseTabTrack() {
        this.chooseTab(4);
    }

    public readFirstChatMessage() {
        return browser.$('grf-chat grf-chat-message:first-child .message').getText();
    }

    public chooseAlgorithm(abbr: string) {
        return browser.$$('grf-algorithm-picker > form > label > input').filter(input => {
            return input.getAttribute('value').then(value => value == abbr);
        }).first().click();
    }

    public debugTableFirstVarName() {
        return browser.$('grf-debug-table table tr:first-child td:first-child').getText();
    }

}
