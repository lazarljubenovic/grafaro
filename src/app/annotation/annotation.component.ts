import {
    Component,
    OnInit,
    ElementRef,
    HostListener,
    ViewChild,
    Input,
    AfterContentInit
} from "@angular/core";
import {GeometryService} from "./geometry.service";
import {ElementPositionService} from "./element-position.service";

@Component({
    selector: 'grf-annotation',
    templateUrl: './annotation.component.html',
    styleUrls: ['./annotation.component.scss'],
    providers: [],
})
export class AnnotationComponent implements OnInit, AfterContentInit {

    @Input() public algorithm: HTMLElement;
    @Input() public snippet: HTMLElement;

    private movingIsInProgress = false;
    private grabbedX = 0;
    private grabbedY = 0;

    @ViewChild('handle') public handleRef: ElementRef;
    @ViewChild('movable') public movableRef: ElementRef;

    @Input() public x: number;
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
        const div = this.elementRef.nativeElement.children[0];
        const size = this.elementPositionService.getSize(div);
        this.x = exitPoint.x - size.w / 2;
        this.y = exitPoint.y - size.h / 2;
    }

    private recalculatePosition(clientX: number, clientY: number): void {
        const rect = this.handleRef.nativeElement.getBoundingClientRect();
        const handleX = rect.left;
        const handleY = rect.top;
        const height = rect.bottom - rect.top;
        const width = rect.right - rect.left;
        const dx = clientX - handleX - this.grabbedX;
        const dy = clientY - handleY - this.grabbedY;
        this.x = handleX + dx;
        this.y = handleY + dy;
        this.annotationX = this.x + width / 2;
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
