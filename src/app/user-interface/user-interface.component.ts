import {
    Component,
    OnInit,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
    ComponentFactory
} from "@angular/core";
import {Graph} from "graphlib";
import {Subject, Observable} from "rxjs";
import {Actions, ClickPosition} from "./toolbar/toolbar.component";
import {GraphOptionsService} from "../graph-options.service";
import {VisNgNetworkEventArgument} from "@lazarljubenovic/vis-ng/core";
import {PopupRenameComponent} from "./popup-rename/popup-rename.component";
import {BreadthFirstSearchComponent} from "../breadth-first-search/breadth-first-search.component";

@Component({
    selector: 'grf-user-interface',
    templateUrl: './user-interface.component.html',
    styleUrls: ['./user-interface.component.scss']
})
export class UserInterfaceComponent implements OnInit {

    public graph = new Graph({directed: false})
        .setNode('A', 'A')
        .setNode('B', 'B')
        .setNode('C', 'C')
        .setNode('D', 'D')
        .setNode('E', 'E')
        .setNode('F', 'F')
        .setNode('G', 'G')
        .setNode('H', 'H')
        .setNode('I', 'I')
        .setNode('J', 'J')
        .setEdge('A', 'B', '1')
        .setEdge('A', 'C', '2')
        .setEdge('A', 'D', '3')
        .setEdge('B', 'E', '4')
        .setEdge('C', 'F', '5')
        .setEdge('C', 'G', '6')
        .setEdge('G', 'H', '7')
        .setEdge('E', 'J', '8')
        .setEdge('J', 'I', '9')
        .setEdge('D', 'I', '10')
        .setEdge('G', 'I', '11');

    public root: string = 'A';

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

    public popupRenameComponentFactory: ComponentFactory<PopupRenameComponent>;

    public renameNode$: Observable<{node: string, position: ClickPosition}> = this.actions$
        .filter(values => values.action == Actions.rename && values.event.nodes.length != 0)
        .map(values => ({
            node: values.event.nodes[0].toString(),
            position: values.event.pointer.DOM,
        }));

    @ViewChild(BreadthFirstSearchComponent)
    public breadthFirstSearchComponent: BreadthFirstSearchComponent;

    constructor(private graphOptionsService: GraphOptionsService,
                componentFactoryResolver: ComponentFactoryResolver) {
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
            .subscribe(tool => {
                this.graphOptionsService.setOptions([
                    {name: 'interaction.dragView', value: true},
                    // {name: 'interaction.selectable', value: true},
                    {name: 'interaction.dragNodes', value: true},
                    {name: 'nodes.shape', value: 'square'},
                ]);
            });

        this.chooseTool$
            .filter(tool => tool !== Actions.select)
            .subscribe(tool => {
                this.graphOptionsService.setOptions([
                    {name: 'interaction.dragView', value: false},
                    // {name: 'interaction.selectable', value: false},
                    {name: 'interaction.dragNodes', value: false},
                ]);
            });

        this.actions$
            .subscribe(values => {
                console.log(values);
            });

        this.renameNode$.subscribe(action => {
            const id: string = action.node;
            const oldName: string = this.graph.node(id);
            const popupRenameComponent =
                this.viewContainerRef.createComponent(this.popupRenameComponentFactory);
            popupRenameComponent.instance.x = 80 + action.position.x + 'px';
            popupRenameComponent.instance.y = 80 + action.position.y + 'px';
            popupRenameComponent.instance.direction = 'up';
            popupRenameComponent.instance.previousValue = oldName;
            popupRenameComponent.changeDetectorRef.detectChanges();
            popupRenameComponent.instance.name.subscribe(newName => {
                if (newName === '') {
                    newName = oldName;
                }
                this.graph.setNode(id, newName);
                this.breadthFirstSearchComponent.update();
                popupRenameComponent.destroy();
            });
        });

    }

}
