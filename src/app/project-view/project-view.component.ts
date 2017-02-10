import {
    Component,
    OnInit,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
    ComponentFactory
} from '@angular/core';
import {GraphOptionsService} from '../graph-options.service';
import {PopupRenameComponent} from './popup-rename/popup-rename.component';
import {ToastService} from '../toast/toast.service';
import {ProjectsService} from '../project-browser/projects.service';
import {ActivatedRoute} from '@angular/router';
import {JoinService} from '../project-browser/join.service';
import {GraphSocketService} from './graph-socket.service';
import {GraphManager} from '../managers/graph.manager';

@Component({
    selector: 'grf-user-interface',
    templateUrl: 'project-view.component.html',
    styleUrls: ['project-view.component.scss'],
})
export class ProjectViewComponent implements OnInit {

    public isSaveDialogOpen: boolean = false;
    public isLoadDialogOpen: boolean = false;

    @ViewChild('renamePopupOutlet', {read: ViewContainerRef})
    public viewContainerRef: ViewContainerRef;

    @ViewChild('toastOutlet', {read: ViewContainerRef})
    public toastOutlet: ViewContainerRef;

    public popupRenameComponentFactory: ComponentFactory<PopupRenameComponent>;

    public save() {
        console.log('TODO save graph');
    }

    public saveDialogToggle(): void {
        this.isSaveDialogOpen = !this.isSaveDialogOpen;
    }

    public loadDialogToggle(): void {
        this.isLoadDialogOpen = !this.isLoadDialogOpen;
    }

    constructor(private graphOptionsService: GraphOptionsService,
                componentFactoryResolver: ComponentFactoryResolver,
                private toastService: ToastService,
                public projectService: ProjectsService,
                private activeRoute: ActivatedRoute,
                private joinService: JoinService,
                private graphSocketService: GraphSocketService,
                private _graphManager: GraphManager) {
        this.popupRenameComponentFactory =
            componentFactoryResolver.resolveComponentFactory(PopupRenameComponent);

    }

    ngOnInit() {
        const roomId = this.activeRoute.snapshot.params['id'];
        // todo break down next line -> join has to create first and then join
        this.joinService.joinRoom(roomId);

        this.graphSocketService.create()
            .subscribe(graphJson => {
                this._graphManager.graphFromSocket(graphJson.graph);
            });

        this._graphManager.graph$.subscribe(graph => {
            if (this.joinService.isMaster) {
                const graphJson = graph.writeJson();
                this.graphSocketService.send(graphJson);
            }
        });

        // Initial settings
        this.graphOptionsService.setOptions([
            {name: 'physics.enabled', value: false},
        ]);
    }

}
