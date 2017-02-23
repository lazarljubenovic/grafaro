import {Component, OnInit, OnDestroy} from '@angular/core';
import {AlgorithmStateManager} from '../../algorithms/state-manager';
import {StateSocketService} from './services/state-socket/state-socket.service';
import {MasterStorageService} from '../../shared/master-service/master-storage.service';
import {Subject} from 'rxjs';
import {ToastService} from '../../toast/toast.service';
import {StateStorageService} from './services/state-socket/state-storage.service';

@Component({
    selector: 'grf-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit, OnDestroy {

    /**
     * Used for unsubscribing in ngOnDestroy.
     * Some sort of Angular pattern.
     * @type {Subject<boolean>}
     * @private
     */
    private _destroySubject = new Subject<boolean>();

    /**
     * Current state number.
     * @type {number}
     * @public
     */
    public current: number;

    /**
     * Total state number.
     * @type {number}
     * @public
     */
    public total: number;

    private isMaster: boolean;

    /**
     * Increment state number.
     */
    public onNext(): void {
        if (this.isMaster) {
            this._stateManager.goToNext();
        } else {
            this.toast.display(`Only Master can navigate through states.`);
        }
    }

    /**
     * Decrement state number.
     */
    public onPrev(): void {
        if (this.isMaster) {
            this._stateManager.goToPrevious();
        } else {
            this.toast.display(`Only Master can navigate through states.`);
        }
    }

    /**
     * Fast forward to the first state.
     */
    public onFirst(): void {
        if (this.isMaster) {
            this._stateManager.goToFirst();
        } else {
            this.toast.display(`Only Master can navigate through states.`);
        }
    }

    /**
     * Fast forward to the last state.
     */
    public onLast(): void {
        if (this.isMaster) {
            this._stateManager.goToLast();
        } else {
            this.toast.display(`Only Master can navigate through states.`);
        }
    }

    /**
     * Go from first to the last state automatically.
     */
    public play(): void {
        if (this.isMaster) {
            this._stateManager.play();
        } else {
            this.toast.display(`Only Master can navigate through states.`);
        }
    }

    /**
     * Pause automatically state changing.
     */
    public pause(): void {
        if (this.isMaster) {
            this._stateManager.pause();
        } else {
            this.toast.display(`Only Master can navigate through states.`);
        }
    }

    constructor(private _stateManager: AlgorithmStateManager,
                private _stateStorage: StateStorageService,
                private _masterStorage: MasterStorageService,
                private toast: ToastService) {
    }

    /**
     * All subscriptions go here.
     */
    ngOnInit() {
        // takeUntil is the beauty of reactive programming
        this._stateManager.state$
            .takeUntil(this._destroySubject)
            .subscribe(state => {

                if (this.current != state.index) {
                    this.current = state.index;
                    this._stateStorage.send(this.current);
                }
                if (this.total != state.total) {
                    this.total = state.total;
                }

            });

        this._masterStorage.masterMessages$
            .takeUntil(this._destroySubject)
            .subscribe(masterMessage => {
                this.isMaster = masterMessage.isMaster;
            });

        this._stateStorage.stateMessage$
            .takeUntil(this._destroySubject)
            .subscribe(stateMessage => {
                if (this.current != stateMessage.stateIndex) {
                    this._stateManager.goTo(stateMessage.stateIndex);
                }
            });
    }

    /**
     * Unsubscribe magic goes here.
     */
    ngOnDestroy() {
        this._destroySubject.next(true);
        this._destroySubject.unsubscribe();
    }

}
