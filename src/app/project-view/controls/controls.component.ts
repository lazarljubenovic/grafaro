import {Component, OnInit, OnDestroy} from '@angular/core';
import {AlgorithmStateManager} from '../../algorithms/state-manager';
import {StateSocketService} from './state-socket.service';
import {MasterStorageService} from '../../shared/master-service/master-storage.service';
import {Subject} from 'rxjs';

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

    /**
     * Increment state number.
     */
    public onNext(): void {
        this._stateManager.goToNext();
    }

    /**
     * Decrement state number.
     */
    public onPrev(): void {
        this._stateManager.goToPrevious();
    }

    /**
     * Fast forward to the first state.
     */
    public onFirst(): void {
        this._stateManager.goToFirst();
    }

    /**
     * Fast forward to the last state.
     */
    public onLast(): void {
        this._stateManager.goToLast();
    }

    /**
     * Go from first to the last state automatically.
     */
    public play(): void {
        this._stateManager.play();
    }

    /**
     * Pause automatically state changing.
     */
    public pause(): void {
        this._stateManager.pause();
    }

    constructor(private _stateManager: AlgorithmStateManager,
                private _stateSocket: StateSocketService,
                private _masterStorage: MasterStorageService) {
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
                    this._stateSocket.send(this.current);
                }
                if (this.total != state.total) {
                    this.total = state.total;
                }

            });

        this._masterStorage.masterMessages$
            .takeUntil(this._destroySubject)
            .subscribe(masterMessage => this._stateSocket.canSend = masterMessage.isMaster);

        this._stateSocket.stateSocket$
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
