import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AlgorithmService} from '../algorithms/algorithm.service';
import {AlgorithmStateManager} from '../algorithms/state-manager';

@Injectable()
export class DebugTableService {

    private _visibleVariables: string[] = [];

    public visibleVariables$: BehaviorSubject<string[]>;
    public integer: number = 0;

    private emitVisibleVariable(): void {
        this.visibleVariables$.next(this._visibleVariables);
    }

    public setVisibleVariables(values: string[]): void {
        this._visibleVariables = values;
        this.emitVisibleVariable();
    }

    public toggleVariable(varName: string): void {
        let index = this._visibleVariables.indexOf(varName);
        if (index == -1) {
            this._visibleVariables = [...this._visibleVariables, varName];
        } else {
            this._visibleVariables = [
                ...this._visibleVariables.slice(0, index),
                ...this._visibleVariables.slice(index + 1)
            ];
        }
        this.emitVisibleVariable();
    }
    constructor(private stateManager: AlgorithmStateManager) {
        // this._visibleVariables = this.stateManager.getAlgorithm().trackedVariables;
        this._visibleVariables = [];
        this.visibleVariables$ = new BehaviorSubject<string[]>(this._visibleVariables);

        this.stateManager.state$.subscribe(state => {
            if (++this.integer < 100) {
                this.setVisibleVariables(state.state._trackedVarsNames);
            } else {
                console.log('integer ode');
            }
        });
    }

}
