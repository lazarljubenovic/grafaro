import {
    Directive,
    Input,
    ElementRef,
    HostListener,
    ComponentFactoryResolver,
    ViewContainerRef,
    OnChanges
} from '@angular/core';
import {ArrayComponent} from './array/array.component';
import {SingleItemComponent} from './single-item/single-item.component';
import {AnnotationBase} from './annotation-base';
import {NotifyService} from '../notify.service';

@Directive({
    selector: '[grfAnnotation]',
})
export class AnnotationDirective implements OnChanges {

    public instance: AnnotationBase;

    private _grfAnnotation: any;

    @Input()
    public set grfAnnotation(annotation: any) {
        this._grfAnnotation = annotation;
    }

    private _box: HTMLElement;

    @Input() set box(value: HTMLElement) {
        this._box = value;
    }

    constructor(private elementRef: ElementRef,
                private cfr: ComponentFactoryResolver,
                private vcRef: ViewContainerRef,
                private notifyService: NotifyService
    ) {
    }

    ngOnChanges() {
        this.create();
    }

    public create(annotation = this._grfAnnotation) {
        if (annotation) {
            const value = annotation.value;
            if (this.instance) {
                this.instance.value = value;
                this.instance.onChange();
            } else {
                this.elementRef.nativeElement.style.borderBottom = 'dotted 2px tomato';
                switch (annotation.type) {
                    case 'array':
                        // console.log('array', annotation.value);
                        this.createAnnotation(ArrayComponent, value);
                        break;
                    case 'single':
                        // console.log('single', annotation.value);
                        this.createAnnotation(SingleItemComponent, value);
                        break;
                    default:
                        throw 'TODO';
                }
            }
        }
    }

    private createAnnotation(klass, value) {
        const factory = this.cfr.resolveComponentFactory(klass);
        const componentRef = this.vcRef.createComponent(factory);
        const instance: AnnotationBase = <any>componentRef.instance;
        this.instance = instance;
        this.instance.box = this._box;
        this.instance.snippet = this.vcRef.element.nativeElement;
        instance.value = value;
        instance.onChange();
    }

    @HostListener('click')
    public onClick() {
        if (this.instance) {
            console.log('sho now');
        }
    }

}
