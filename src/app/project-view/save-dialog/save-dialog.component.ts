import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'grf-save-dialog',
    templateUrl: './save-dialog.component.html',
    styleUrls: ['../load-dialog/load-dialog.component.scss'],
})
export class SaveDialogComponent implements OnInit {

    public id: string;
    public filename: string;

    public onFileSelect(file: {id: string, filename: string}): void {
        this.filename = file.filename;
        this.id = file.id;
    }

    public onSave() {
        console.log(`TODO: Save ${this.filename} (id ${this.id})`);
    }

    constructor() {
    }

    ngOnInit() {
    }

}
