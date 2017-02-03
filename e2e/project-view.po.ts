import {browser, by} from 'protractor';

function chunk<Type>(arr: Type[], len: number) {
    const chunks = [];
    let i = 0;
    const n = arr.length;
    while (i < n) {
        chunks.push(arr.slice(i, i += len));
    }
    return chunks;
}

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

    public chooseTabMatrix() {
        this.chooseTab(2);
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

    public getMatrix(withHeadings: boolean = false) {
        const element = browser.$('grf-matrix table');
        const row = element.all(by.tagName('tr'));
        const cells = row.all(by.tagName('td'));
        return cells.map(elm => elm.getText())
            .then(values => {
                const length = values.length;
                let matrix = chunk<string>(values, Math.sqrt(length));
                if (withHeadings) {
                    return matrix;
                } else {
                    return matrix.slice(1).map(row => row.slice(1));
                }
            });
    }

    public selectToolFromToolbar(index: number) {
        return browser.$$('grf-toolbar ul li').get(index).click();
    }

    public clickOnCanvas(x: number = 0, y: number = 0) {
        const canvas = browser.element(by.tagName('canvas'));
        return browser.actions()
            .mouseMove(<any>canvas, {x, y})
            .click()
            .perform();
    }

}
