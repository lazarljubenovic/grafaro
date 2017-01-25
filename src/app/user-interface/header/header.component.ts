import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import {RoomEditService} from '../../project-view/room-edit.service';
import {JoinService} from '../../project-browser/join.service';
import {Auth0Service} from '../../core/auth0.service';

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
            this.updateNameDescription();
        }

        this.projectTitle = this.newTitle;
        this.isTitleInEditMode = false;
    }

    public submitDescription() {
        if (this.projectDescription != this.newDescription) {
            this.updateNameDescription();
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

    private updateNameDescription() {
        const roomNameDescription = {
            name: this.newTitle,
            description: this.newDescription
        };
        this.roomEditService.update(roomNameDescription);
    }

    public isMaster(): boolean {
        return this.joinService.isMaster;
    }

    public logout(): void {
        this.auth0.logout();
    }

    constructor(private roomEditService: RoomEditService,
                private joinService: JoinService,
                private auth0: Auth0Service
    ) {
    }

    ngOnInit() {
        this.roomEditService.name$.subscribe(name => {
            this.projectTitle = name;
            this.newTitle = this.projectTitle;
        });
        this.roomEditService.description$.subscribe(description => {
            this.projectDescription = description;
            this.newDescription = this.projectDescription;
        });
        this.newTitle = this.projectTitle;
        this.newDescription = this.projectDescription;
    }

}
