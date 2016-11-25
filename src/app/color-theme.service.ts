import {Injectable} from "@angular/core";

@Injectable()
export class ColorThemeService {

    public palette: any = {
        primary: '#4ecdc4',
        secondary: '#134074',
        accent: '#ff6b6b',
        foreground: '#292f36',
        background: '#ffffff',
    };

    constructor() {
    }

}
