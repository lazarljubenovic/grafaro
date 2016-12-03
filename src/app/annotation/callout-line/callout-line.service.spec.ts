/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {CalloutLineService} from "./callout-line.service";

interface Point {
    x: number;
    y: number;
}

interface Rectangle {
    topLeft: Point;
    bottomRight: Point;
}

describe('Service: CalloutLine', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CalloutLineService]
        });
    });

    const rectangle: Rectangle = {
        topLeft: {x: 10, y: 20},
        bottomRight: {x: 100, y: 120},
    };

    it('should expand and collapse a rectangle', inject([CalloutLineService],
        (service: CalloutLineService) => {
            const margin: number = 2;
            const expandedRectangle: Rectangle = {
                topLeft: {x: 8, y: 18},
                bottomRight: {x: 102, y: 122},
            };
            const collapsedRectangle: Rectangle = {
                topLeft: {x: 12, y: 22},
                bottomRight: {x: 98, y: 118},
            };
            expect(service.expandRectangle(rectangle, margin))
                .toEqual(expandedRectangle);
            expect(service.expandRectangle(rectangle, -margin))
                .toEqual(collapsedRectangle);
        }));

    it('should find closest exit point', inject([CalloutLineService],
        (service: CalloutLineService) => {

        }));
});
