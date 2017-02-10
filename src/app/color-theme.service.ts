import {Injectable} from '@angular/core';
import {GrfGraphNodeOptionColor} from './graph/graph.module';

@Injectable()
export class ColorThemeService {

    public palette: any = {
        [GrfGraphNodeOptionColor.PRIMARY]: '#4ecdc4',
        [GrfGraphNodeOptionColor.SECONDARY]: '#134074',
        [GrfGraphNodeOptionColor.ACCENT]: '#ff6b6b',
        foreground: '#292f36',
        background: '#ffffff',
    };

    constructor() {
    }

}
