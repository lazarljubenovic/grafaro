import {Injectable, Inject} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {VisNgNetworkEventArgument} from '@lazarljubenovic/vis-ng/core';
import {Actions, ClickPosition} from './toolbar.component';
import {GraphOptionsService} from '../../graph-options.service';

@Injectable()
export class ToolbarService {

    public chooseTool$ = new Subject<Actions>();
    public click$ = new Subject<VisNgNetworkEventArgument>();

    public actions$: Observable<{event: VisNgNetworkEventArgument, action: Actions}> = this.click$
        .withLatestFrom(this.chooseTool$)
        .map(values => ({
            event: values[0],
            action: values[1],
        }));

    public moveNode$ = new Subject<{nodeId: string, position: ClickPosition}>();

    public addNode$: Observable<{suggestedName: string, position: ClickPosition}> = this.actions$
        .filter(values => {
            return values.action == Actions.add
                && values.event.nodes.length == 0
                && values.event.edges.length == 0;
        })
        .map(values => ({
            suggestedName: 'X', // TODO
            position: values.event.pointer.canvas,
        }));

    public removeNode$: Observable<string> = this.actions$
        .filter(values => values.action == Actions.remove && values.event.nodes.length != 0)
        .map(values => values.event.nodes[0].toString());

    public renameNode$: Observable<{node: string, position: ClickPosition}> = this.actions$
        .filter(values => values.action == Actions.rename && values.event.nodes.length != 0)
        .map(values => ({
            node: values.event.nodes[0].toString(),
            position: values.event.pointer.DOM,
        }));

    public linkNodesNode$: Observable<string> = this.actions$
        .filter(values => values.action == Actions.connect && values.event.nodes.length != 0)
        .map(values => values.event.nodes[0].toString());

    public linkNodesBackground$: Observable<any> = this.actions$
        .filter(values => values.action == Actions.connect && values.event.nodes.length == 0);

    public linkNodes$: Observable<string[]>;

    public removeEdge$: Observable<string> = this.actions$
        .filter(values => values.action == Actions.disconnect
            && values.event.nodes.length == 0
            && values.event.edges.length == 1
        )
        .map(values => values.event.edges[0].toString());

    constructor(@Inject(GraphOptionsService) private graphOptionsService: GraphOptionsService) {
        // We need timeout so the subscriptions below are triggered properly.
        setTimeout(() => this.chooseTool$.next(Actions.select));

        this.chooseTool$
            .filter(tool => tool === Actions.select)
            .subscribe(() => {
                this.graphOptionsService.setOptions([
                    {name: 'interaction.dragView', value: true},
                    {name: 'interaction.dragNodes', value: true},
                ]);
            });

        this.chooseTool$
            .filter(tool => tool !== Actions.select)
            .subscribe(() => {
                this.graphOptionsService.setOptions([
                    {name: 'interaction.dragView', value: false},
                    {name: 'interaction.dragNodes', value: false},
                ]);
            });

        this.actions$
            .subscribe(values => {
                console.log('actions$', values);
            });

        // Alt. solutions from Gitter: http://pastebin.com/ZpeSDwpJ
        this.linkNodes$ = this.linkNodesNode$
            .window(this.linkNodesBackground$)
            .flatMap(window => window
                .bufferCount(2)
                .filter(arr => arr.length === 2));
    }

}