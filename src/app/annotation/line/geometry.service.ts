import {Injectable} from "@angular/core";

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

    constructor() {
    }

}
