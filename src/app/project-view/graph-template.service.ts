import {Injectable} from '@angular/core';
import {GrafaroHttpService} from '../shared/grafaro-http.service';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';
import {GraphJson} from '../models/graph.model';

@Injectable()
export class GraphTemplateService extends GrafaroHttpService {

    constructor(http: Http) {
        super(http);
        this.url += '/graph';
    }

    public getGraphsInfo(): Observable<any> {
        return this.http.get(this.url)
            .map(response => this.responseToObject(response))
            .catch(err => this.handleError(err));
    }

    public getGraph(userName: string, graphName: string): Observable<GraphJson> {
        return this.http.get(`${this.url}/${userName}/${graphName}`)
            .map(response => this.responseToObject(response))
            .catch(err => this.handleError(err));
    }

    public saveGraph(graphJson: GraphJson, graphName: string, userId: string): Observable<any> {
        return this.http.put(this.url, {
            data: {
                userId,
                graphName,
                graphJson,
            }
        }).do(response => console.log('TODO'))
            .catch(err => this.handleError(err));
    }

}
