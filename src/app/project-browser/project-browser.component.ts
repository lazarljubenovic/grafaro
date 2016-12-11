import {Component, OnInit} from '@angular/core';
import {ProjectsService} from './projects.service';
import {Project} from './project';
import {Observable} from 'rxjs';

@Component({
    selector: 'grf-project-browser',
    templateUrl: './project-browser.component.html',
    styleUrls: ['./project-browser.component.scss']
})
export class ProjectBrowserComponent implements OnInit {

    public projects$: Observable<Project[]>;

    constructor(private _projectsService: ProjectsService) {
    }

    ngOnInit() {
        this.projects$ = this._projectsService.getProjects();
    }

}
