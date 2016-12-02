import {
    Component,
    OnInit,
    ElementRef,
    HostListener,
    ViewChild
} from "@angular/core";

@Component({
    selector: 'grf-annotation',
    templateUrl: './annotation.component.html',
    styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {

    private movingIsInProgress = false;
    private grabbedX = 0;
    private grabbedY = 0;

    @ViewChild('handle')
    public handleRef: ElementRef;

    private moveDraggableTo(x: number, y: number): void {
        this.elementRef.nativeElement.style.left = x + 'px';
        this.elementRef.nativeElement.style.top = y + 'px';
    }

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
            const handleX = this.handleRef.nativeElement.getBoundingClientRect().left;
            const handleY = this.handleRef.nativeElement.getBoundingClientRect().top;
            const dx = event.clientX - handleX - this.grabbedX;
            const dy = event.clientY - handleY - this.grabbedY;
            this.moveDraggableTo(handleX + dx, handleY + dy);
        }
    }

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
    }

}
