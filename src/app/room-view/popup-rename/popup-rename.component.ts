import {
    Component,
    OnInit,
    HostBinding,
    ChangeDetectorRef,
    ViewChild,
    ElementRef,
    HostListener
} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
    templateUrl: './popup-rename.component.html',
    styleUrls: ['./popup-rename.component.scss'],
})
export class PopupRenameComponent implements OnInit {

    public x: number = 0;
    public y: number = 0;
    @HostBinding('class') public direction: string = 'up';
    public previousValue: string;
    public action: string;
    public noun: string;

    @ViewChild('input')
    public inputElementRef: ElementRef;

    public name = new Subject<string>();

    public onKeyDown(eventKey: string): void {
        if (eventKey == 'Escape') {
            this.onRename();
        }
    }

    public onKeyPress(eventKey: string): void {
        if (eventKey == 'Enter') {
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
