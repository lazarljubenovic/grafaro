import {ChangeDetectorRef} from '@angular/core';

export abstract class AnnotationBase {

    public value: any;

    public box: HTMLElement;

    public snippet: HTMLElement;

    public abstract onChange();

    constructor(public cdr: ChangeDetectorRef) {
    }

}
