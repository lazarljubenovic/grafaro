import {Component, OnInit} from '@angular/core';
import {AlgorithmStateManager} from '../../algorithms/state-manager';
import {StateSocketService} from './state-socket.service';
import {MasterStorageService} from '../../shared/master-service/master-storage.service';

@Component({
    selector: 'grf-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {

    public current: number;
    public total: number;

    public onNext(): void {
        this._stateManager.goToNext();
    }

    public onPrev(): void {
        this._stateManager.goToPrevious();
    }

    public onFirst(): void {
        this._stateManager.goToFirst();
    }

    public onLast(): void {
        this._stateManager.goToLast();
    }

    public play(): void {
        this._stateManager.play();
    }

    public pause(): void {
        this._stateManager.pause();
    }

    constructor(private _stateManager: AlgorithmStateManager,
                private _stateSocket: StateSocketService,
                private _masterStorage: MasterStorageService) {
    }

    ngOnInit() {
        this._stateManager.state$.subscribe(state => {
            this.current = state.index;
            this.total = state.total;

            this._stateSocket.send(this.current);
        });

        this._masterStorage.masterMessages$
            .subscribe(masterMessage => this._stateSocket.canSend = masterMessage.isMaster);

        this._stateSocket.stateSocket$
            .subscribe(stateMessage => {
                this._stateManager.goTo(stateMessage.stateIndex);
            });
    }

}
