import {
    Component,
    OnInit,
    ComponentFactoryResolver,
    ComponentFactory,
    OnDestroy
} from '@angular/core';
import {PopupRenameComponent} from './popup-rename/popup-rename.component';
import {ActivatedRoute, Router} from '@angular/router';
import {GraphManager} from '../managers/graph.manager';
import {GraphTemplateService} from './graph-template.service';
import {Observable, Subject} from 'rxjs';
import {GraphPath} from '../user-interface/file-list/file-list.service';
import {Auth0Service} from '../core/auth0.service';
import {GraphFolder} from '../user-interface/file-list/file-list.interface';
import {JoinStorageService} from '../shared/join-service/join-storage.service';
import {MasterStorageService} from '../shared/master-service/master-storage.service';
import {GraphStorageService} from './services/graph-socket/graph-storage.service';
import {LeaveStorageService} from './services/leave-socket/leave-storage.service';
import {AlgorithmStorageService} from './services/algorithm-socket/algorithm-storage.service';
import {ToastService} from '../toast/toast.service';

@Component({
    selector: 'grf-room-view',
    templateUrl: 'room-view.component.html',
    styleUrls: ['room-view.component.scss'],
})
export class RoomViewComponent implements OnInit, OnDestroy {
// todo rename this to RoomViewComponent

    private _destroySubject = new Subject<boolean>();

    private _displayName: string;

    public graphTemplate$: Observable<GraphFolder[]>;
    public currentUserTemplate$: Observable<GraphFolder>;

    public isSaveDialogOpen: boolean = false;
    public isLoadDialogOpen: boolean = false;

    public popupRenameComponentFactory: ComponentFactory<PopupRenameComponent>;

    private isMaster: boolean;

    public save(path: GraphPath) {
        const graphJson = this._graphManager.graph$.getValue().writeJson();
        this._graphTemplateService.saveGraph(graphJson, path.filename, this._displayName)
            .subscribe(response => {
                // todo handle on error
                this.saveDialogToggle();
            });
    }

    public load(path: GraphPath): void {
        if (!this.isMaster) {
            this.toast.display(`Only Master can load a graph.`);
            return;
        }
        this._graphTemplateService.getGraph(path.folder, path.filename)
            .subscribe(graphJson => {
                this._graphManager.graphFromSocket(graphJson);
                this.loadDialogToggle();
            });
    }

    public saveDialogToggle(): void {
        this.isSaveDialogOpen = !this.isSaveDialogOpen;
    }

    public loadDialogToggle(): void {
        this.isLoadDialogOpen = !this.isLoadDialogOpen;
    }

    constructor(componentFactoryResolver: ComponentFactoryResolver,
                private _graphTemplateService: GraphTemplateService,
                private activeRoute: ActivatedRoute,
                private _joinStorage: JoinStorageService,
                private _graphStorageService: GraphStorageService,
                private _graphManager: GraphManager,
                private _masterStorage: MasterStorageService,
                private _router: Router,
                private _auth0: Auth0Service,
                private _leaveStorage: LeaveStorageService,
                private _algorithmStorage: AlgorithmStorageService,
                private toast: ToastService) {
        this.popupRenameComponentFactory =
            componentFactoryResolver.resolveComponentFactory(PopupRenameComponent);
        _masterStorage.masterMessages$.subscribe(msg => this.isMaster = msg.isMaster);
    }

    ngOnInit() {
        console.log('ng on init project view');
        // Subscribe on incoming Join messages for post-join things
        this._joinStorage.joinMessages$
            .takeUntil(this._destroySubject)
            .subscribe(joinMessage => {
                // On error, change route to 404
                if (joinMessage.error != '') {
                    this._router.navigate(['/error']);
                    this._joinStorage.setRoom('');
                    console.error(joinMessage.error);
                } else {
                    this._joinStorage.setRoom(joinMessage.roomId);
                    this._masterStorage.requestMasterMessage();
                    this._graphStorageService.requestGraphMessage();
                    this._algorithmStorage.requestAlgorithmWithOptions();
                }
            });

        // Send request to join the room.
        const roomId = this.activeRoute.snapshot.params['id'];
        this._joinStorage.joinRoom(roomId);

        this._graphStorageService.graphMessages$
            .takeUntil(this._destroySubject)
            .subscribe(graphMessage => {
                this._graphManager.graphFromSocket(graphMessage.graph);
            });

        this._masterStorage.masterMessages$
            .takeUntil(this._destroySubject)
            .subscribe(masterMessage => {
                this._graphStorageService.canSend = masterMessage.isMaster;
            });

        this._graphManager.graph$
            .takeUntil(this._destroySubject)
            .subscribe(graph => {
                this._graphStorageService.send(graph.writeJson());
            });

        this.graphTemplate$ = this._graphTemplateService.getGraphsInfo();
        this.currentUserTemplate$ = this.graphTemplate$.map(templates => {
            let ind = templates.findIndex(template => template.name == this._displayName);
            return ind == -1 ? {name: this._displayName, graph: []} : templates[ind];
        });

        this._auth0.user$
            .takeUntil(this._destroySubject)
            .subscribe(user => {
                this._displayName = user.displayName;
            });
    }


    ngOnDestroy() {
        this._masterStorage.restartStorage();
        this._leaveStorage.leave();
        this._graphStorageService.restartGraph();
        this._algorithmStorage.restartAlgorithmWithOptions();
        this._destroySubject.next(true);
        this._destroySubject.unsubscribe();
    }

}
