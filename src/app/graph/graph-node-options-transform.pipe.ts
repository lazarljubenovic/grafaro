import {Pipe, PipeTransform} from "@angular/core";
import {GrfGraphNodeOptions} from "./graph.module";

@Pipe({
    name: 'graphNodeOptionsTransform',
})
export class GraphNodeOptionsTransformPipe implements PipeTransform {

    transform(options: GrfGraphNodeOptions): any {
        const colorCurrent = '#FF6B6B';

        const colorVisited = {
            background: '#afafaf',
            border: '#6f6f6f',
            highlight: {
                background: '#cfcfcf',
                border: '#9f9f9f',
            },
            hover: {
                background: '#bfbfbf',
                border: '#7f7f7f',
            },
        };

        const colorDefault = {
            background: '#f7f7f7',
            border: '#afafaf',
            highlight: {
                background: '#efefef',
                border: '#b7b7b7',
            },
            hover: {
                background: '#e7e7e7',
                border: '#afafaf',
            },
        };

        const color = options.state === 'current' ? colorCurrent : options.state === 'visited' ? colorVisited : colorDefault;
        const shape = options.isStart ? 'box' : options.isEnd ? 'triangle' : 'circle';

        return {
            id: options.label,
            label: options.label,
            color,
            shape: 'circle', // everything is ugly jesus christ
        };
    }

}
