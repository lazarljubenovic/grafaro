import {Injectable} from '@angular/core';
import {Project} from './project';
import {Observable} from 'rxjs';
import {GrafaroHttpService} from '../shared/grafaro-http.service';
import {Http} from '@angular/http';
import {Graph} from '../models/graph.model';

interface ProjectGraph {
    graph: Graph;
    algorithm: any;
}

@Injectable()
export class ProjectsService extends GrafaroHttpService {

    private mockProjects: Project[] = [
        {
            _id: `1`,
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
            _id: `2`,
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
            _id: `3`,
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
            _id: `3`,
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
            _id: `4`,
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
            _id: `5`,
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
            _id: `6`,
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
            _id: `7`,
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
        // return Observable.of(this.mockProjects);
        return this.http.get(this.url)
            .map(x => this.responseToObject(x))
            .catch(e => this.handleError(e));
    }

    public getProject(id: string): Observable<any> {
        return this.http.get('http://localhost:4000/room/' + id)
            .map(p => {
                const project: any = this.responseToObject(p);
                const graph: Graph = new Graph();
                graph.readJson(project.graph);
                return {
                    graph,
                    algorithm: {
                        id: project.algorithm.id,
                        options: {
                            root: project.algorithm.options.root
                        }
                    },
                };
            })
            .catch(e => this.handleError(e));
    }

    public saveProject(id: string, graph: Graph, root) {
        const obj = {
            data: {
                graph: {
                    edges: graph.edges,
                    nodes: graph.nodes,
                },
                algorithm: {
                    id: 'bfs', // todo
                    options: {
                        root,
                    },
                },
            },
        };

        const url = `${this.url}/${id}/save`;
        this.http.post(url, obj).subscribe(x => console.log(x));
    }

    // TODO type
    public getProjectByQuery(query: any): Observable<Project[]> {
        // searchBy: this._formBuilder.group({
        //     searchQuery: '',
        //     isCreatedByProfessor: false,
        //     isWithPeopleOnline: false,
        // }),
        //     orderBy: 'name',
        const result = this.mockProjects
            .filter(project => project.isMadeByProfessor == query.searchBy.isCreatedByProfessor)
            .filter(project => {
                if (query.searchBy.isWithPeopleOnline) {
                    return project.numberOfPeopleOnline > 0;
                } else {
                    return true;
                }
            })
            .filter(project => !!project.title.match(query.searchBy.searchQuery))
            .sort((projectA, projectB) => {
                switch (query.orderBy) {
                    case 'name':
                        return projectA.title > projectB.title ? 1 : -1;
                    case 'likes':
                        const totalVotesA = projectA.numberOfLikes + projectA.numberOfDislikes;
                        const totalVotesB = projectB.numberOfLikes + projectB.numberOfDislikes;
                        if (totalVotesA == 0) {
                            return 1;
                        }
                        if (totalVotesB == 0) {
                            return -1;
                        }
                        const projectAPercentage = projectA.numberOfLikes / totalVotesA;
                        const projectBPercentage = projectB.numberOfLikes / totalVotesB;
                        return projectAPercentage > projectBPercentage ? -1 : 1;
                    case 'people':
                        return projectA.numberOfPeopleOnline > projectB.numberOfPeopleOnline
                            ? -1 : 1;
                }
            });
        return Observable.of(result);
    }

    constructor(http: Http) {
        super(http);
        this.url += '/project';
    }

}
