import {Component, OnInit} from '@angular/core';
import {AlgorithmStateManager} from '../../algorithms/state-manager';

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

    constructor(private _stateManager: AlgorithmStateManager) {
    }

    ngOnInit() {
        this._stateManager.state$.subscribe(state => {
            this.current = state.index;
            this.total = state.total;
        });
    }

}
