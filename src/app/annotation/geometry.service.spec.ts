/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {GeometryService} from './geometry.service';

interface Point {
    x: number;
    y: number;
}

interface Rectangle {
    topLeft: Point;
    bottomRight: Point;
}

describe('Service: Geometry', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GeometryService]
        });
    });

    it('should ...', inject([GeometryService], (service: GeometryService) => {
        expect(service).toBeTruthy();
    }));

    const rectangle: Rectangle = {
        topLeft: {x: 10, y: 20},
        bottomRight: {x: 100, y: 120},
    };

    it('should expand and collapse a rectangle', inject([GeometryService],
        (service: GeometryService) => {
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
});
