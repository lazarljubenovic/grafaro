import {
    Component,
    OnInit,
    HostBinding,
    ChangeDetectorRef,
    ViewChild,
    ElementRef,
    HostListener
} from "@angular/core";
import {Subject} from "rxjs";

@Component({
    templateUrl: './popup-rename.component.html',
    styleUrls: ['./popup-rename.component.scss'],
})
export class PopupRenameComponent implements OnInit {

    public x: string = '0px';
    public y: string = '0px';
    @HostBinding('class') public direction: string = 'up';
    public previousValue: string;

    @ViewChild('input')
    public inputElementRef: ElementRef;

    public name = new Subject<string>();

    public onKeyPress(event: KeyboardEvent): void {
        if (event.key == 'Enter') {
            this.onRename();
        }
    }

    @HostListener('click', ['$event.target.nodeName'])
    public onClose(nodeName: string): void {
        if (nodeName == 'NG-COMPONENT') {
            this.onRename();
        }
    }

    public onRename() {
        this.name.next(this.inputElementRef.nativeElement.value);
        this.name.complete();
    }

    constructor(public changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.inputElementRef.nativeElement.focus();
    }

}
