import {Pipe, PipeTransform} from '@angular/core';

interface Position {
    x: number;
    y: number;
}

interface Size {
    w: number;
    h: number;
}

@Pipe({name: 'popupPosition'})
export class PopupPositionPipe implements PipeTransform {

    private getSize(element: HTMLElement): Size {
        const bottom = element.getBoundingClientRect().bottom;
        const right = element.getBoundingClientRect().right;
        const left = element.getBoundingClientRect().left;
        const top = element.getBoundingClientRect().top;
        return {
            w: right - left,
            h: bottom - top,
        };
    }

    private getCenter(element: HTMLElement): Position {
        const left = element.getBoundingClientRect().left;
        const top = element.getBoundingClientRect().top;
        return {
            x: left + this.getSize(element).w / 2,
            y: top + this.getSize(element).h / 2,
        };
    }

    private getTopCenter(element: HTMLElement, margin: number = 8): Position {
        return {
            x: this.getCenter(element).x,
            y: this.getCenter(element).y - this.getSize(element).h / 2 - margin,
        };
    }

    transform(element: HTMLElement, margin: number = 8): Position {
        return this.getTopCenter(element, margin);
    }

}
