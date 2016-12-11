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
            },
            isMadeByProfessor: false,
            numberOfPeopleOnline: 2,
            numberOfLikes: 30,
            numberOfDislikes: 0,
        },
        {
            id: `2`,
            title: `Short`,
            description: `A pretty short desc.`,
            tags: [`breadth first search`],
            creator: {
                handle: `mixa`,
                name: `Mihajlo Ilijić`,
            },
            isMadeByProfessor: false,
            numberOfPeopleOnline: 2,
            numberOfLikes: 3,
            numberOfDislikes: 11,
        },
        {
            id: `3`,
            title: `Kinda Short`,
            description: `Not short but not really long either as first one`,
            tags: [`a*`, `a very very long tag`, `some more tags to fill space`, `fasdfsdfasd`],
            creator: {
                handle: `Pritilender`,
                name: `Lepozemac`,
            },
            isMadeByProfessor: false,
            numberOfPeopleOnline: 2,
            numberOfLikes: 3,
            numberOfDislikes: 1,
        },
        {
            id: `3`,
            title: `Pretty Short`,
            description: `Not short but not really long either as first one`,
            tags: [`a*`, `a very very long tag`, `some more tags to fill space`, `fasdfsdfasd`],
            creator: {
                handle: `Pritilender`,
                name: `Lepozemac`,
            },
            isMadeByProfessor: false,
            numberOfPeopleOnline: 0,
            numberOfLikes: 31,
            numberOfDislikes: 6,
        },
        {
            id: `4`,
            title: `Very Short`,
            description: `Not short but not really long either as first one`,
            tags: [`a*`, `a very very long tag`, `some more tags to fill space`, `fasdfsdfasd`],
            creator: {
                handle: `Pritilender`,
                name: `Lepozemac`,
            },
            isMadeByProfessor: false,
            numberOfPeopleOnline: 51,
            numberOfLikes: 213,
            numberOfDislikes: 143,
        },
        {
            id: `5`,
            title: `Sign Short`,
            description: `Not short but not really long either as first one`,
            tags: [`a*`, `a very very long tag`, `some more tags to fill space`, `fasdfsdfasd`],
            creator: {
                handle: `Pritilender`,
                name: `Lepozemac`,
            },
            isMadeByProfessor: false,
            numberOfPeopleOnline: 2,
            numberOfLikes: 3,
            numberOfDislikes: 111,
        },
        {
            id: `6`,
            title: `Eh Whatever`,
            description: `Not short but not really long either as first one`,
            tags: [`a*`, `a very very long tag`, `some more tags to fill space`, `fasdfsdfasd`],
            creator: {
                handle: `Pritilender`,
                name: `Lepozemac`,
            },
            isMadeByProfessor: false,
            numberOfPeopleOnline: 2,
            numberOfLikes: 32,
            numberOfDislikes: 11,
        },
        {
            id: `7`,
            title: `No Idea Really`,
            description: `Not short but not really long either as first one`,
            tags: [`a*`, `a very very long tag`, `some more tags to fill space`, `fasdfsdfasd`],
            creator: {
                handle: `Pritilender`,
                name: `Lepozemac`,
            },
            isMadeByProfessor: false,
            numberOfPeopleOnline: 6,
            numberOfLikes: 0,
            numberOfDislikes: 12,
        },
    ];

    public getProjects(): Observable<Project[]> {
        return Observable.of(this.mockProjects);
    }

    constructor() {
    }

}
