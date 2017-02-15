import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'grf-load-dialog',
    templateUrl: './load-dialog.component.html',
    styleUrls: ['./load-dialog.component.scss']
})
export class LoadDialogComponent implements OnInit {
    @Input() folders: any[];

    public id: string;
    public filename: string;

    public onFileSelect(file: {id: string, filename: string}): void {
        this.filename = file.filename;
        this.id = file.id;
    }

    public onLoad() {
        console.log(`TODO: Load ${this.filename} (id ${this.id})`);
    }

    constructor() {
    }

    ngOnInit() {
    }

}
