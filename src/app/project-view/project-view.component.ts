import {
    Component,
    OnInit,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
    ComponentFactory
} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {GraphOptionsService} from '../graph-options.service';
import {PopupRenameComponent} from './popup-rename/popup-rename.component';
import {AlgorithmService} from '../algorithms/algorithm.service';
import {ToastService} from '../toast/toast.service';
import {ProjectsService} from '../project-browser/projects.service';
import {ActivatedRoute} from '@angular/router';
import {JoinService} from '../project-browser/join.service';
import {GraphSocketService} from './graph-socket.service';
import {StateManagerObject} from '../algorithms/state-manager';

@Component({
    selector: 'grf-user-interface',
    templateUrl: 'project-view.component.html',
    styleUrls: ['project-view.component.scss'],
})
export class ProjectViewComponent implements OnInit {

    public isSaveDialogOpen: boolean = false;
    public isLoadDialogOpen: boolean = false;

    public currentState$: ReplaySubject<StateManagerObject>;



    @ViewChild('renamePopupOutlet', {read: ViewContainerRef})
    public viewContainerRef: ViewContainerRef;

    @ViewChild('toastOutlet', {read: ViewContainerRef})
    public toastOutlet: ViewContainerRef;

    public popupRenameComponentFactory: ComponentFactory<PopupRenameComponent>;

    public save() {
        this.projectService.saveProject(
            this.activeRoute.snapshot.params['id'],
            this.algorithmService.graph,
            this.algorithmService.rootId
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

        this.currentState$ = algorithmService.state$;
    }

    ngOnInit() {
        const roomId = this.activeRoute.snapshot.params['id'];
        // todo break down next line -> join has to create first and then join
        this.joinService.joinRoom(roomId);
        this.graphSocketService.create()
            .subscribe(roomGraph => {
                this.algorithmService.graph.readJson(roomGraph.graph);
                this.algorithmService.rootId = roomGraph.algorithm.options.root;
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
    }

}
