import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'lineNumberStyle'
})
export class LineNumberStylePipe implements PipeTransform {

    transform(lineNumber: number,
              box: HTMLElement,
              totalLineNumbers: number): string {
        lineNumber--;
        const height = box.getBoundingClientRect().height;
        const notch = height / totalLineNumbers;
        const yCenter = notch * lineNumber;
        return `${yCenter}px`;
    }

}
