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

    constructor() {
    }

}
