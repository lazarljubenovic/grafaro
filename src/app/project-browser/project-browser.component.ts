import {Component, OnInit} from '@angular/core';
import {ProjectsService} from './projects.service';
import {Project} from './project';
import {Observable} from 'rxjs';
import {FormGroup, FormBuilder} from '@angular/forms';
import {JoinService} from './join.service';

@Component({
    selector: 'grf-project-browser',
    templateUrl: './project-browser.component.html',
    styleUrls: ['./project-browser.component.scss']
})
export class ProjectBrowserComponent implements OnInit {

    public projects$: Observable<Project[]>;

    public queryForm: FormGroup;

    constructor(private _projectsService: ProjectsService,
                private _formBuilder: FormBuilder,
                private joinService: JoinService) {
    }

    ngOnInit() {
        this.projects$ = this._projectsService.getProjects();

        this.queryForm = this._formBuilder.group({
            searchBy: this._formBuilder.group({
                searchQuery: '',
                isCreatedByProfessor: false,
                isWithPeopleOnline: false,
            }),
            orderBy: 'name',
        });

        this.queryForm.valueChanges
            .debounceTime(200)
            .subscribe(query => {
                console.log(query);
                this.projects$ = this._projectsService.getProjectByQuery(query);
            });

        this.joinService.create().subscribe((message) =>
            console.log(message));
    }

    public createNewRoom(): void {
        this.joinService.newRoom();
    }

}
