import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AlgorithmService} from '../algorithms/algorithm.service';

@Injectable()
export class DebugTableService {

    private _visibleVariables: string[] = [];

    public visibleVariables$: BehaviorSubject<string[]>;

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

    constructor(algorithmService: AlgorithmService) {
        this._visibleVariables = algorithmService.algorithmStrategy.trackedVariables;
        this.visibleVariables$ = new BehaviorSubject<string[]>(this._visibleVariables);

        algorithmService.algorithmStrategy$.subscribe(strategy => {
            this.setVisibleVariables([...strategy.trackedVariables]);
        });
    }

}
