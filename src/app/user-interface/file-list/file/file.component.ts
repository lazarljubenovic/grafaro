import {
    Component,
    OnInit,
    Input,
    HostListener,
    AfterViewInit,
    ViewChild,
    ElementRef,
    HostBinding
} from '@angular/core';
import {FileListService} from '../file-list.service';

@Component({
    selector: 'grf-file',
    templateUrl: 'file.component.html',
    styleUrls: ['../folder/folder.component.scss', './file.component.scss'],
})
export class FileComponent implements OnInit, AfterViewInit {

    @ViewChild('name') public nameRef: ElementRef;

    public parentPath: string;
    public filename: string;

    @HostBinding('class.selected')
    @Input() public isSelected: boolean = false;

    @Input() public lastChange: Date;

    @Input() public id: string;

    @HostListener('click')
    /* tslint:disable */
    private onFileSelect() {
        // TODO should be trimmed at edit
        const filename = `${this.filename.trim()}`;
        const folder = `${this.parentPath}`;
        this.fileListService.fileSelect$.next({folder, filename});
    }

    constructor(private fileListService: FileListService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.filename = this.nameRef.nativeElement.innerText;
    }

}
