import {Pipe, PipeTransform, Inject} from "@angular/core";
import {ElementPositionService} from "./element-position.service";

@Pipe({
    name: 'elementPosition'
})
export class ElementPositionPipe implements PipeTransform {

    constructor(@Inject(ElementPositionService) public service: ElementPositionService) {
    }

    transform(element: HTMLElement): {x: number, y: number} {
        return this.service.getCenter(element);
    }

}
