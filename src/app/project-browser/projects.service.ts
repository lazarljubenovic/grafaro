import {Injectable} from '@angular/core';
import {Project} from './project';
import {Observable} from 'rxjs';

@Injectable()
export class ProjectsService {

    private mockProjects: Project[] = [
        {
            id: `1`,
            title: `A Random Smart Title`,
            description: `A long random description for a long random title of a smart project.`,
            tags: [`linked lists`, `double linked lists`, `random lists`],
            creator: {
                handle: `lazarljubenovic`,
                name: `Lazar Ljubenović`,
            }
        },
        {
            id: `2`,
            title: `Short`,
            description: `A pretty short desc.`,
            tags: [`breadth first search`],
            creator: {
                handle: `mixa`,
                name: `Mihajlo Ilijić`,
            }
        },
        {
            id: `3`,
            title: `Kinda Short`,
            description: `Not short but not really long either as first one`,
            tags: [`a*`, `a very very long tag`, `some more tags to fill space`, `fasdfsdfasd`],
            creator: {
                handle: `Pritilender`,
                name: `Lepozemac`,
            }
        },
    ];

    public getProjects(): Observable<Project[]> {
        return Observable.of(this.mockProjects);
    }

    constructor() {
    }

}
