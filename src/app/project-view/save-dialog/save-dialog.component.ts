import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {GraphPath} from '../../user-interface/file-list/file-list.service';
import {GraphFolder} from '../../user-interface/file-list/file-list.component';

@Component({
    selector: 'grf-save-dialog',
    templateUrl: './save-dialog.component.html',
    styleUrls: ['../load-dialog/load-dialog.component.scss'],
})
export class SaveDialogComponent implements OnInit {

    @Input() folder: GraphFolder;
    @Output() saveGraph = new EventEmitter<GraphPath>();

    public filename: string;

    public onFileSelect(file: GraphPath): void {
        this.filename = file.filename;
    }

    public onSave() {
        this.saveGraph.emit({folder: '', filename: this.filename});
    }

    constructor() {
    }

    ngOnInit() {
    }

}
