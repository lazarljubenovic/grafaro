import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'elementPosition'
})
export class ElementPositionPipe implements PipeTransform {

    private getSize(element: HTMLElement): {w: number, h: number} {
        const bottom = element.getBoundingClientRect().bottom;
        const right = element.getBoundingClientRect().right;
        const left = element.getBoundingClientRect().left;
        const top = element.getBoundingClientRect().top;
        return {
            w: right - left,
            h: bottom - top,
        };
    }

    private getCenter(element: HTMLElement): {x: number, y: number} {
        const left = element.getBoundingClientRect().left;
        const top = element.getBoundingClientRect().top;
        return {
            x: left + this.getSize(element).w / 2,
            y: top + this.getSize(element).h / 2,
        };
    }

    transform(element: HTMLElement): {x: number, y: number} {
        return this.getCenter(element);
    }

}
