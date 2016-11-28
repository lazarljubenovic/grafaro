import {
    Component,
    OnInit,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
    ComponentFactory
} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {Actions, ClickPosition} from "./toolbar/toolbar.component";
import {GraphOptionsService} from "../graph-options.service";
import {VisNgNetworkEventArgument} from "@lazarljubenovic/vis-ng/core";
import {PopupRenameComponent} from "./popup-rename/popup-rename.component";
import {BreadthFirstSearchService} from "../breadth-first-search/breadth-first-search.service";
import {ToastService} from "../toast/toast.service";

@Component({
    selector: 'grf-user-interface',
    templateUrl: './user-interface.component.html',
    styleUrls: ['./user-interface.component.scss']
})
export class UserInterfaceComponent implements OnInit {

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

    public renameNode$: Observable<{node: string, position: ClickPosition}> = this.actions$
        .filter(values => values.action == Actions.rename && values.event.nodes.length != 0)
        .map(values => ({
            node: values.event.nodes[0].toString(),
            position: values.event.pointer.DOM,
        }));

    private selectedNode: string;
    private linkNodesNode$: Observable<string> = this.actions$
        .filter(values => values.action == Actions.connect && values.event.nodes.length != 0)
        .map(values => values.event.nodes[0].toString());
    private linkNodesBackground$: Observable<any> = this.actions$
        .filter(values => values.action == Actions.connect && values.event.nodes.length == 0);

    private linkTwoNodes(first: string, second: string): void {
        this.service.linkNodes(first, second);
    }

    public updateStateNumber(action: string) {
        this.service.updateStateNumber(action);
    }

    constructor(private graphOptionsService: GraphOptionsService,
                componentFactoryResolver: ComponentFactoryResolver,
                public service: BreadthFirstSearchService,
                private toastService: ToastService) {
        this.popupRenameComponentFactory =
            componentFactoryResolver.resolveComponentFactory(PopupRenameComponent);
    }

    ngOnInit() {

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
                console.log(values);
            });

        this.addNode$.subscribe(action => {
            this.service.addNode(action.position);
        });

        this.renameNode$.subscribe(action => {
            const id: string = action.node;
            const oldLabel: string = this.service.getNodeLabel(id);
            const popupRenameComponent =
                this.viewContainerRef.createComponent(this.popupRenameComponentFactory);
            popupRenameComponent.instance.x = 80 + action.position.x + 'px';
            popupRenameComponent.instance.y = 80 + action.position.y + 'px';
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

        this.linkNodesBackground$.subscribe(() => {
            this.selectedNode = null;
        });

        this.linkNodesNode$.subscribe(node => {
            if (this.selectedNode == null) {
                this.selectedNode = node;
            } else if (this.selectedNode) {
                this.linkTwoNodes(this.selectedNode, node);
                this.selectedNode = null;
            }
        });

    }

}
