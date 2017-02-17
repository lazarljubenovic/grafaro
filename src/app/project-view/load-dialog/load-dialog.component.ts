import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {GraphPath} from '../../user-interface/file-list/file-list.service';

@Component({
    selector: 'grf-load-dialog',
    templateUrl: './load-dialog.component.html',
    styleUrls: ['./load-dialog.component.scss']
})
export class LoadDialogComponent implements OnInit {
    @Input() folders: any[];
    @Output() loadGraph: EventEmitter<GraphPath> = new EventEmitter();

    public folder: string;
    public filename: string;

    public onFileSelect(file: GraphPath): void {
        this.folder = file.folder;
        this.filename = file.filename;
    }

    public onLoad() {
        this.loadGraph.emit({
            folder: this.folder,
            filename: this.filename
        });
    }

    constructor() {
    }

    ngOnInit() {
    }

}
