import {Injectable} from "@angular/core";

export interface Point {
    x: number;
    y: number;
}

export interface Rectangle {
    topLeft: Point;
    bottomRight: Point;
}

interface Rect {
    bottom: number;
    right: number;
    left: number;
    top: number;
}

@Injectable()
export class ElementPositionService {

    private getRect(element: HTMLElement): Rect {
        const bottom = element.getBoundingClientRect().bottom;
        const right = element.getBoundingClientRect().right;
        const left = element.getBoundingClientRect().left;
        const top = element.getBoundingClientRect().top;
        return {bottom, right, left, top};
    }

    public getRectangle(element: HTMLElement): Rectangle {
        const rect = this.getRect(element);
        const topLeft: Point = {x: rect.left, y: rect.top};
        const bottomRight: Point = {x: rect.right, y: rect.bottom};
        return {topLeft, bottomRight};
    }

    public getSize(element: HTMLElement): {w: number, h: number} {
        const rect = this.getRect(element);
        return {
            w: rect.right - rect.left,
            h: rect.bottom - rect.top,
        };
    }

    public getCenter(element: HTMLElement): {x: number, y: number} {
        const left = element.getBoundingClientRect().left;
        const top = element.getBoundingClientRect().top;
        return {
            x: left + this.getSize(element).w / 2,
            y: top + this.getSize(element).h / 2,
        };
    }

    constructor() {
    }

}
