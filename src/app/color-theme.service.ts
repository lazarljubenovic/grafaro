import {Injectable} from '@angular/core';
import {GrfColor} from './graph/graph.module';

@Injectable()
export class ColorThemeService {

    public palette: any = {
        [GrfColor.PRIMARY]: '#4ecdc4',
        [GrfColor.SECONDARY]: '#134074',
        [GrfColor.ACCENT]: '#ff6b6b',
        [GrfColor.DEFAULT]: {
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
        },
        [GrfColor.DIMMED]: {
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
        },
        foreground: '#292f36',
        background: '#ffffff',
    };

    constructor() {
    }

}
