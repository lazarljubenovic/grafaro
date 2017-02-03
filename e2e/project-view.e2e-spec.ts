import {ProjectViewDummyRoomPage} from './project-view.po';
import {browser} from 'protractor';

describe(`Project View`, function () {

    let page: ProjectViewDummyRoomPage;

    beforeEach(() => {
        page = new ProjectViewDummyRoomPage();
        page.navigateTo();
        browser.ignoreSynchronization = true;
    });

    it(`should have logo`, () => {
        expect(page.getLogoBackgroundImage()).toContain(`assets/logo.svg`);
    });

    it(`should have title 'Untitled'`, () => {
        expect(page.getTitle()).toBe('Untitled');
    });

    it(`chat should have first message "Hello World"`, () => {
        page.chooseTabChat();
        expect(page.readFirstChatMessage()).toEqual('Hello World!');
    });

    it(`should choose a few algorithms`, () => {
        page.chooseTabAlgorithm();
        page.chooseAlgorithm('dsp');
        expect(page.debugTableFirstVarName()).toEqual('Q');
        page.chooseAlgorithm('dfs');
        expect(page.debugTableFirstVarName()).toEqual('currentNode');
        page.chooseAlgorithm('bfs');
        expect(page.debugTableFirstVarName()).toEqual('currentNode');
    });

    it(`should have initial matrix`, () => {
        page.chooseTabMatrix();
        const actual = page.getMatrix();
        const expected = [
            ['0', '1', '2', '0', '0'],
            ['0', '0', '0', '0', '4'],
            ['0', '0', '0', '1', '0'],
            ['0', '0', '0', '0', '0'],
            ['2', '0', '0', '0', '0'],
        ];
        expect(actual).toEqual(expected);
    });

});
