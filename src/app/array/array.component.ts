import {
    Component, OnInit, Input, Directive, ElementRef,
    Renderer, trigger, state, style, transition, animate
} from '@angular/core';

@Directive({
    selector: 'grf-array[grf-stack]',
})
export class ArrayStackDirective implements OnInit {

    constructor (private elementRef: ElementRef,
                 private renderer: Renderer) {
    }

    ngOnInit() {
        const nativeElement: HTMLElement = this.elementRef.nativeElement;
        this.renderer.setElementClass(nativeElement,'stack', true);
    }

}

@Directive({
    selector: 'grf-array[grf-queue]',
})
export class ArrayQueueDirective {

    constructor (private elementRef: ElementRef,
                 private renderer: Renderer) {
    }

    ngOnInit() {
        const nativeElement: HTMLElement = this.elementRef.nativeElement;
        this.renderer.setElementClass(nativeElement,'queue', true);
    }

}

@Component({
    selector: 'grf-array',
    templateUrl: './array.component.html',
    styleUrls: ['./array.component.scss'],
    animations: [
        trigger('flyInOut', [
            state('in', style({transform: 'translateX(0)'})),
            transition('void => *', [
                style({
                    transform: 'translateX(48px)',
                    width: '0px',
                    opacity: 0,
                }),
                animate('300ms ease-in')
            ]),
            transition('* => void', [
                animate('300ms ease-out', style({
                    width: '0px',
                    opacity: 0,
                }))
            ]),
        ]),
    ],
})
export class ArrayComponent implements OnInit {

    @Input()
    public array: any[] = [];

    @Input()
    public accentColor: any[] = [];

    @Input()
    public primaryColor: any[] = [];

    @Input()
    public secondaryColor: any[] = [];

    constructor() {
    }

    ngOnInit() {
    }

}
