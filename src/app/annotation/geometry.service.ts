import {Injectable} from "@angular/core";
import {Rectangle} from "./callout-line/callout-line.service";

interface Point {
    x: number;
    y: number;
}

@Injectable()
export class GeometryService {

    public getLineAngle(a: Point, b: Point): number {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.atan2(dy, dx);
    }

    public getDistanceBetween(a: Point, b: Point): number {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public toDegrees(radians: number): number {
        return radians * 180 / Math.PI;
    }

    public toRadians(degrees: number): number {
        return degrees * Math.PI / 180;
    }

    public isInRectangle(point: Point, rectangle: Rectangle) {
        const isRightOfLeft = rectangle.topLeft.x < point.x;
        const isLeftOfRight = point.x < rectangle.bottomRight.x;
        const isBelowTop = rectangle.topLeft.y < point.y;
        const isAboveBottom = point.y < rectangle.bottomRight.y;
        const conditions = [isRightOfLeft, isLeftOfRight, isBelowTop, isAboveBottom];
        return conditions.every(condition => condition);
    }

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
        let minDistance = this.getDistanceBetween(closestPoint, point);
        for (const exitPoint of exitPoints.slice(1)) {
            const thisDistance: number = this.getDistanceBetween(exitPoint, point);
            if (thisDistance < minDistance) {
                minDistance = thisDistance;
                closestPoint = exitPoint;
            }
        }
        return closestPoint;
    }

    constructor() {
    }

}
