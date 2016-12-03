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

    public expandRectangle(rectangle: Rectangle, margin: number): Rectangle {
        return {
            topLeft: {
                x: rectangle.topLeft.x - margin,
                y: rectangle.topLeft.y - margin
            },
            bottomRight: {
                x: rectangle.bottomRight.x + margin,
                y: rectangle.bottomRight.y + margin,
            },
        };
    }

    public getAllExitPoints(point: Point, rectangle: Rectangle): Point[] {
        return [
            {x: point.x, y: rectangle.topLeft.y},
            {x: rectangle.bottomRight.x, y: point.y},
            {x: point.x, y: rectangle.bottomRight.y},
            {x: rectangle.topLeft.x, y: point.y},
        ];
    }

    public getClosestExitPoint(point: Point, rectangle: Rectangle): Point {
        const exitPoints: Point[] = this.getAllExitPoints(point, rectangle);
        let closestPoint = exitPoints[0];
        let minDistance = this.geometryService.getDistanceBetween(closestPoint, point);
        for (const exitPoint of exitPoints.slice(1)) {
            const thisDistance: number = this.geometryService.getDistanceBetween(exitPoint, point);
            if (thisDistance < minDistance) {
                minDistance = thisDistance;
                closestPoint = exitPoint;
            }
        }
        return closestPoint;
    }

    public getPoints(from: Point, // annotation
                     to: Point, // snippet
                     dangerZone: Rectangle,
                     margin: number = 12): Point[] {
        const expandedDangerZone: Rectangle = this.expandRectangle(dangerZone, margin);
        const exitPoint: Point = this.getClosestExitPoint(to, expandedDangerZone);

        const midPoint1: Point = {x: exitPoint.x, y: from.y};
        const midPoint2: Point = {x: from.x, y: exitPoint.y};

        const midPoint: Point =
            this.geometryService.isInRectangle(midPoint2, expandedDangerZone) ?
                midPoint1 :
                midPoint2;

        return [from, midPoint, exitPoint, to];
    }

    constructor(@Inject(GeometryService) public geometryService: GeometryService) {
    }

}
