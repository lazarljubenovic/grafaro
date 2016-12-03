import {
    Component,
    OnInit,
    ElementRef,
    HostListener,
    ViewChild,
    Input
} from "@angular/core";

@Component({
    selector: 'grf-annotation',
    templateUrl: './annotation.component.html',
    styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {

    @Input() public algorithm: ElementRef;
    @Input() public snippet: HTMLElement;

    private movingIsInProgress = false;
    private grabbedX = 0;
    private grabbedY = 0;

    @ViewChild('handle') public handleRef: ElementRef;
    @ViewChild('movable') public movableRef: ElementRef;

    public x: number;
    public y: number;

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
            const rect = this.handleRef.nativeElement.getBoundingClientRect();
            const handleX = rect.left;
            const handleY = rect.top;
            const height = rect.bottom - rect.top;
            const width = rect.right - rect.left;
            const dx = event.clientX - handleX - this.grabbedX;
            const dy = event.clientY - handleY - this.grabbedY;
            this.x = handleX + dx;
            this.y = handleY + dy;
            this.annotationX = this.x + width / 2;
            this.annotationY = this.y + height / 2;
        }
    }

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
    }

}
