import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FileListService, GraphPath} from './file-list.service';

export interface GraphFolder {
    name: string; // user's display name
    graph: {
        lastChange: number;
        id: number; // whatever
        name: string;
    }[];
}

@Component({
    selector: 'grf-file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.scss'],
    providers: [FileListService],
})
export class FileListComponent implements OnInit {

    @Output() public fileSelect = new EventEmitter<GraphPath>();

    constructor(private fileListService: FileListService) {
    }

    ngOnInit() {
        this.fileListService.fileSelect$.subscribe(file => {
            this.fileSelect.emit(file);
        });
    }

}
