import {
    Component,
    OnInit,
    Input,
    HostListener,
    AfterViewInit,
    ViewChild,
    ElementRef
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

    @Input() public lastChange: Date;

    @Input() public id: string;

    @HostListener('click')
    /* tslint:disable */
    private onFileSelect() {
        const filename = `${this.parentPath}/${this.filename}`;
        this.fileListService.fileSelect$.next({id: this.id, filename});
    }

    constructor(private fileListService: FileListService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.filename = this.nameRef.nativeElement.innerText;
    }

}
