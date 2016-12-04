import {
    Component,
    OnInit,
    ElementRef,
    HostListener,
    ViewChild,
    Input,
    AfterContentInit,
    HostBinding
} from '@angular/core';
import {GeometryService} from './geometry.service';
import {ElementPositionService} from './element-position.service';

@Component({
    selector: 'grf-annotation',
    templateUrl: './annotation.component.html',
    styleUrls: ['./annotation.component.scss'],
})
export class AnnotationComponent implements OnInit, AfterContentInit {

    @Input() public algorithm: HTMLElement;
    @Input() public snippet: HTMLElement;

    private movingIsInProgress = false;
    private grabbedX = 0;
    private grabbedY = 0;

    @ViewChild('handle') public handleRef: ElementRef;
    @ViewChild('movable') public movableRef: ElementRef;

    @HostBinding('style.left.px')
    @Input() public x: number;

    @HostBinding('style.top.px')
    @Input() public y: number;

    public annotationX: number;
    public annotationY: number;

    @HostListener('window:mouseup')
    public onWindowMouseUp(): void {
        this.movingIsInProgress = false;
    }

    public onHandleMouseDown(): void {
        this.movingIsInProgress = true;
    }

    @HostListener('mousedown', ['$event'])
    public onMouseDown(event: MouseEvent): void {
        if (this.movingIsInProgress) {
            const rect = this.handleRef.nativeElement.getBoundingClientRect();
            this.grabbedX = event.clientX - rect.left;
            this.grabbedY = event.clientY - rect.top;
        }
    }

    @HostListener('window:mousemove', ['$event'])
    public onWindowsMouseMove(event: MouseEvent): void {
        if (this.movingIsInProgress) {
            this.recalculatePosition(event.clientX, event.clientY);
        }
    }

    private calculateInitialPosition(): void {
        const snippetCenter = this.elementPositionService.getCenter(this.snippet);
        const algorithmRectangle = this.elementPositionService.getRectangle(this.algorithm);
        const largeRectangle = this.geometryService.expandRectangle(algorithmRectangle, 36);
        const exitPoint = this.geometryService.getClosestExitPoint(snippetCenter, largeRectangle);
        const size = this.elementPositionService.getSize(this.handleRef.nativeElement);
        this.x = exitPoint.x;
        this.y = exitPoint.y - size.h / 2;
        this.annotationX = this.x;
        this.annotationY = this.y;
    }

    private recalculatePosition(clientX: number, clientY: number): void {
        const hostRect = this.elementRef.nativeElement.getBoundingClientRect();
        const visualRect = this.handleRef.nativeElement.getBoundingClientRect();
        const handleX = hostRect.left;
        const handleY = hostRect.top;
        const height = visualRect.bottom - visualRect.top;
        const width = visualRect.right - visualRect.left;
        const dx = clientX - handleX - this.grabbedX + width / 2;
        const dy = clientY - handleY - this.grabbedY;
        this.x = handleX + dx;
        this.y = handleY + dy;
        this.annotationX = this.x;
        this.annotationY = this.y + height / 2;
    }

    constructor(private elementRef: ElementRef,
                private geometryService: GeometryService,
                private elementPositionService: ElementPositionService) {
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        this.calculateInitialPosition();
    }

}
