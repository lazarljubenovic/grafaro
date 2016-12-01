/* tslint:disable:no-unused-variable */
import {PopupPositionPipe} from "./popup-position.pipe";


xdescribe('Pipe: PopupPosition', () => {

    let dummyElement = document.createElement('div');
    dummyElement.style.top = '40px';
    dummyElement.style.left = '10px';
    dummyElement.style.right = '30px';
    dummyElement.style.bottom = '100px';
    const rect = dummyElement.getBoundingClientRect();
    console.log(rect.top, rect.left, rect.right, rect.bottom);
    const pipe = new PopupPositionPipe();

    it(`should get top center of the element`, () => {
        expect(pipe.transform(dummyElement)).toEqual({x: 20, y: 40});
    });

});
