import {Injectable} from '@angular/core';
import * as marked from 'marked';

@Injectable()
export class MarkdownService {

    public transform(str: string): string {
        return marked(str).slice('<p>'.length, -'</p>'.length - 1);
    }

    constructor() {
    }

}
