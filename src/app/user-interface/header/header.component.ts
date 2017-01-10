import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
    selector: 'grf-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss'],
})
export class HeaderComponent implements OnInit {

    @Input() public projectTitle: string = 'Untitled';
    @Input() public projectDescription: string = `Project Untitled doesn't have a description.`;

    @Input() public isProjectViewMode: boolean = false;

    @Input() public isProjectTitleEditable: boolean = true;

    @ViewChild('titleInput') public newInputElRef: ElementRef;
    @ViewChild('descriptionInput') public newDescriptionElRef: ElementRef;

    public isTitleInEditMode: boolean = false;
    public isDescriptionInEditMode: boolean = false;

    public newTitle: string;
    public newDescription: string;

    public openTitleEditMode() {
        this.isTitleInEditMode = true;
        setTimeout(() => {
            this.newInputElRef.nativeElement.focus();
            this.newInputElRef.nativeElement.select();
        });
    }

    public openDescriptionEditMode() {
        this.isDescriptionInEditMode = true;
        setTimeout(() => {
            this.newDescriptionElRef.nativeElement.focus();
            this.newDescriptionElRef.nativeElement.select();
        });
    }

    public submitTitle() {
        if (this.projectTitle != this.newTitle) {
            // TODO
            console.log(`TODO: Rename ${this.projectTitle} to ${this.newTitle}`);
        }

        this.projectTitle = this.newTitle;
        this.isTitleInEditMode = false;
    }

    public submitDescription() {
        if (this.projectDescription != this.newDescription) {
            // TODO
            console.log(`TODO: Rename ${this.projectDescription} to ${this.newDescription}`);
        }

        this.projectDescription = this.newDescription;
        this.isDescriptionInEditMode = false;
    }

    public discardTitle() {
        this.isTitleInEditMode = false;
    }

    public discardDescription() {
        this.isDescriptionInEditMode = false;
    }

    constructor() {
    }

    ngOnInit() {
        this.newTitle = this.projectTitle;
        this.newDescription = this.projectDescription;
    }

}
