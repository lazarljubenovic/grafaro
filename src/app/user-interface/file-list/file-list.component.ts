import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FileListService} from './file-list.service';

@Component({
    selector: 'grf-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.scss'],
    providers: [FileListService],
})
export class FileListComponent implements OnInit {

    @Output() public fileSelect = new EventEmitter<{id: string, filename: string}>();

    constructor(private fileListService: FileListService) {
    }

    ngOnInit() {
        this.fileListService.fileSelect$.subscribe(file => {
            this.fileSelect.emit(file);
        });
    }

}
