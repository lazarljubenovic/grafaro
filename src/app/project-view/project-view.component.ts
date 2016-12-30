import {
    Component,
    OnInit,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
    ComponentFactory
} from '@angular/core';
import {Subject, Observable} from 'rxjs';
import {Actions, ClickPosition} from './toolbar/toolbar.component';
import {GraphOptionsService} from '../graph-options.service';
import {VisNgNetworkEventArgument, VisNetworkService} from '@lazarljubenovic/vis-ng/core';
import {PopupRenameComponent} from './popup-rename/popup-rename.component';
import {BreadthFirstSearchService} from '../breadth-first-search/breadth-first-search.service';
import {ToastService} from '../toast/toast.service';
import {ProjectsService} from '../project-browser/projects.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'grf-user-interface',
    templateUrl: 'project-view.component.html',
    styleUrls: ['project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {

    public chooseTool$ = new Subject<Actions>();
    public click$ = new Subject<VisNgNetworkEventArgument>();

    public actions$: Observable<{event: VisNgNetworkEventArgument, action: Actions}> = this.click$
        .withLatestFrom(this.chooseTool$)
        .map(values => ({
            event: values[0],
            action: values[1],
        }));

    @ViewChild('renamePopupOutlet', {read: ViewContainerRef})
    public viewContainerRef: ViewContainerRef;

    @ViewChild('toastOutlet', {read: ViewContainerRef})
    public toastOutlet: ViewContainerRef;

    public popupRenameComponentFactory: ComponentFactory<PopupRenameComponent>;

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

    private removeNode$: Observable<string> = this.actions$
        .filter(values => values.action == Actions.remove && values.event.nodes.length != 0)
        .map(values => values.event.nodes[0].toString());

    public renameNode$: Observable<{node: string, position: ClickPosition}> = this.actions$
        .filter(values => values.action == Actions.rename && values.event.nodes.length != 0)
        .map(values => ({
            node: values.event.nodes[0].toString(),
            position: values.event.pointer.DOM,
        }));

    private linkNodesNode$: Observable<string> = this.actions$
        .filter(values => values.action == Actions.connect && values.event.nodes.length != 0)
        .map(values => values.event.nodes[0].toString());
    private linkNodesBackground$: Observable<any> = this.actions$
        .filter(values => values.action == Actions.connect && values.event.nodes.length == 0);

    private removeEdge$: Observable<string> = this.actions$
        .filter(values => values.action == Actions.disconnect
            && values.event.nodes.length == 0
            && values.event.edges.length == 1
        )
        .map(values => values.event.edges[0].toString());

    public moveNode$ = new Subject<{nodeId: string, x: number, y: number}>();

    public onMoveNode(arg: any) {
        console.log('move node', arg);
        const nodeId = arg.nodes[0];
        const x = 10;
        const y = 10;
        this.moveNode$.next({nodeId, x, y});
    }

    private linkTwoNodes(first: string, second: string): void {
        this.service.linkNodes(first, second);
    }

    public updateStateNumber(action: string) {
        this.service.updateStateNumber(action);
    }

    public updatePositions() {
        this.visService.getPositions()
            .forEach((position, nodeId) => {
                this.service.graph.nodes
                    .filter(node => node.id == nodeId)[0].position = position;
            });
    }

    public save() {
        this.updatePositions();
        this.projectService.saveProject(
            this.activeRoute.snapshot.params['id'],
            this.service.graph,
            this.service.root
        );
    }

    constructor(private graphOptionsService: GraphOptionsService,
                componentFactoryResolver: ComponentFactoryResolver,
                public service: BreadthFirstSearchService,
                private toastService: ToastService,
                public projectService: ProjectsService,
                private activeRoute: ActivatedRoute,
                private visService: VisNetworkService) {
        this.popupRenameComponentFactory =
            componentFactoryResolver.resolveComponentFactory(PopupRenameComponent);
    }

    ngOnInit() {
        this.projectService.getProject(this.activeRoute.snapshot.params['id'])
            .subscribe(projectGraph => {
                this.service.graph = projectGraph.graph;
                this.service.root = projectGraph.algorithm.options.root;
                this.service.setGraph();
                let val = new Map<string, {x: number, y: number}>();
                this.service.graph.nodes.map(node => val[node.id] = node.position);
                this.visService.setPositions(val);
            });

        // Initial settings
        this.graphOptionsService.setOptions([
            {name: 'physics.enabled', value: false},
        ]);

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

        this.addNode$.subscribe(action => {
            this.service.addNode(action.position);
        });

        this.removeNode$.subscribe(nodeId => {
            this.service.removeNode(nodeId);
        });

        this.renameNode$.subscribe(action => {
            const id: string = action.node;
            const oldLabel: string = this.service.getNodeLabel(id);
            const popupRenameComponent =
                this.viewContainerRef.createComponent(this.popupRenameComponentFactory);
            popupRenameComponent.instance.x = 80 + action.position.x;
            popupRenameComponent.instance.y = 80 + action.position.y;
            popupRenameComponent.instance.direction = 'up';
            popupRenameComponent.instance.previousValue = oldLabel;
            popupRenameComponent.changeDetectorRef.detectChanges();
            popupRenameComponent.instance.name.subscribe(newLabel => {
                try {
                    this.service.renameNode(oldLabel, newLabel);
                } catch (e) {
                    this.toastService.display(`Rename unsuccessful. ${e}`, this.toastOutlet);
                }
                popupRenameComponent.destroy();
            });
        });

        // Alt. solutions from Gitter: http://pastebin.com/ZpeSDwpJ
        this.linkNodesNode$
            .window(this.linkNodesBackground$)
            .flatMap(window => window
                .bufferCount(2)
                .filter(arr => arr.length === 2))
            .subscribe((nodes: string[]) => this.linkTwoNodes(nodes[0], nodes[1]));

        this.removeEdge$.subscribe((edge: string) => {
            this.service.removeEdge(edge);
        });

    }

}
