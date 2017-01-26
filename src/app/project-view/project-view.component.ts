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
import {VisNgNetworkEventArgument} from '@lazarljubenovic/vis-ng/core';
import {PopupRenameComponent} from './popup-rename/popup-rename.component';
import {AlgorithmService} from '../algorithms/algorithm.service';
import {ToastService} from '../toast/toast.service';
import {ProjectsService} from '../project-browser/projects.service';
import {ActivatedRoute} from '@angular/router';
import {JoinService} from '../project-browser/join.service';
import {GraphSocketService} from './graph-socket.service';

@Component({
    selector: 'grf-user-interface',
    templateUrl: 'project-view.component.html',
    styleUrls: ['project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {

    public isSaveDialogOpen: boolean = false;
    public isLoadDialogOpen: boolean = false;

    public currentState$;

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

    public onMoveNode(arg: any) {
        const nodeId = arg.nodes[0];
        const position = arg.pointer.canvas;

        this.algorithmService.moveNode(nodeId, position);
    }

    private linkTwoNodes(first: string, second: string): void {
        this.algorithmService.linkNodes(first, second);
    }

    public updateStateNumber(action: string) {
        this.algorithmService.updateStateNumber(action);
    }

    public save() {
        this.projectService.saveProject(
            this.activeRoute.snapshot.params['id'],
            this.algorithmService.graph,
            this.algorithmService.root
        );
    }

    public saveDialogToggle(): void {
        this.isSaveDialogOpen = !this.isSaveDialogOpen;
    }

    public loadDialogToggle(): void {
        this.isLoadDialogOpen = !this.isLoadDialogOpen;
    }

    constructor(private graphOptionsService: GraphOptionsService,
                componentFactoryResolver: ComponentFactoryResolver,
                public algorithmService: AlgorithmService,
                private toastService: ToastService,
                public projectService: ProjectsService,
                private activeRoute: ActivatedRoute,
                private joinService: JoinService,
                private graphSocketService: GraphSocketService) {
        this.popupRenameComponentFactory =
            componentFactoryResolver.resolveComponentFactory(PopupRenameComponent);

        this.currentState$ = algorithmService.currentState$;
    }

    ngOnInit() {
        const roomId = this.activeRoute.snapshot.params['id'];
        this.joinService.joinRoom(roomId);
        this.graphSocketService.create()
            .catch(error => {
                console.log('Graph error', error);
                return Observable.of(this.graphSocketService.mockGraphInfoMessage);
            })
            .subscribe(roomGraph => {
                this.algorithmService.graph.readJson(roomGraph.graph);
                this.algorithmService.root = roomGraph.algorithm.options.root;
                this.algorithmService.setGraph();
            });

        this.algorithmService.graphState$.subscribe(graph => {
            if (this.joinService.isMaster) {
                const graphJson = graph.writeJson();
                this.graphSocketService.changeGraphAndAlgorithm(graphJson);
            }
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
            this.algorithmService.addNode(action.position);
        });

        this.removeNode$.subscribe(nodeId => {
            this.algorithmService.removeNode(nodeId);
        });

        this.renameNode$.subscribe(action => {
            const id: string = action.node;
            const oldLabel: string = this.algorithmService.getNodeLabel(id);
            const popupRenameComponent =
                this.viewContainerRef.createComponent(this.popupRenameComponentFactory);
            popupRenameComponent.instance.x = 80 + action.position.x;
            popupRenameComponent.instance.y = 80 + action.position.y;
            popupRenameComponent.instance.direction = 'up';
            popupRenameComponent.instance.previousValue = oldLabel;
            popupRenameComponent.changeDetectorRef.detectChanges();
            popupRenameComponent.instance.name.subscribe(newLabel => {
                try {
                    this.algorithmService.renameNode(oldLabel, newLabel);
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
            this.algorithmService.removeEdge(edge);
        });

    }

}
