import {Injectable, Inject} from "@angular/core";
import {GeometryService} from "../geometry.service";

interface Point {
    x: number;
    y: number;
}

export interface Rectangle {
    topLeft: Point;
    bottomRight: Point;
}

@Injectable()
export class CalloutLineService {

    public getPoints(annotationPoint: Point,
                     snippetPoint: Point,
                     dangerZone: Rectangle,
                     margin: number = 12): Point[] {
        const expandedDangerZone = this.geometryService.expandRectangle(dangerZone, margin);
        const exitPoint = this.geometryService
            .getClosestExitPoint(snippetPoint, expandedDangerZone);

        const midPoint1: Point = {x: exitPoint.x, y: annotationPoint.y};
        const midPoint2: Point = {x: annotationPoint.x, y: exitPoint.y};

        const midPoint: Point =
            this.geometryService.isInRectangle(midPoint2, expandedDangerZone) ?
                midPoint1 :
                midPoint2;

        return [annotationPoint, midPoint, exitPoint, snippetPoint];
    }

    constructor(@Inject(GeometryService) public geometryService: GeometryService) {
    }

}
