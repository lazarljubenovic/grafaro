import {
    Component,
    OnInit,
    Input,
    ContentChildren,
    ChangeDetectionStrategy,
    QueryList,
    AfterContentInit
} from '@angular/core';
import {FileComponent} from '../file/file.component';

@Component({
    selector: 'grf-folder',
    templateUrl: './folder.component.html',
    styleUrls: ['./folder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderComponent implements OnInit, AfterContentInit {

    @Input() public name: string;

    public lastChange: Date;

    @ContentChildren(FileComponent)
    public fileComponents: QueryList<FileComponent>;

    public isOpen: boolean = false;

    // Not on host element because we don't want the folder to
    // collapse on file pick
    public toggle(): void {
        this.isOpen = !this.isOpen;
    }

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        this.lastChange = new Date(Math.max(...this.fileComponents
            .toArray().map(file => +file.lastChange)));
        this.fileComponents.forEach(fileComponent => {
            fileComponent.parentPath = this.name;
        });
    }

}
