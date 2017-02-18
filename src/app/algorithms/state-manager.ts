import {AlgorithmBase, AlgorithmState} from './algorithm-base';
import {ReplaySubject, Observable, BehaviorSubject} from 'rxjs';
import {Graph} from '../models/graph.model';
import {GraphManager} from '../managers/graph.manager';
import {Optional} from '@angular/core';
import {NormalizedState} from './normalized-state.model';
import {AlgorithmManager, AlgorithmWithOptions} from '../managers/algorithm.manager';

export interface StateManagerObject {
    state: AlgorithmState;
    index: number;
    total: number;
    isLast: boolean;
    isFirst: boolean;
}

export class AlgorithmStateManager {

    /**
     * Combined graph and algorithm options state for better manipulation.
     */
    private _combine$: Observable<[Graph, AlgorithmWithOptions]>;

    /**
     * We need these so we know which graph and root to evaluate a new algorithm when user changes
     * the algorithm (because they stay the same).
     */
    private _graph: Graph;
    private _rootId: string;

    private _isPlaying$ = new BehaviorSubject<boolean>(false);

    private _clock$ = Observable.interval(1000);

    /**
     * Concrete algorithm which is currently managed.
     */
    private _algorithm: AlgorithmBase;

    /**
     * A number (index) which points to the current state of the algorithm. Initially 0.
     */
    private _currentStateIndex: number = 0;

    public state$ = new ReplaySubject<StateManagerObject>();

    public getNormalizedState(): NormalizedState {
        return this._algorithm.normalize(this._algorithm.states[this._currentStateIndex]);
    }

    private _getTotalNumberOfStates(): number {
        if (this._algorithm.states) {
            return this._algorithm.states.length;
        } else {
            return 0;
        }
    }

    /**
     * Checks if the current state is the first one.
     */
    private _isFirst(): boolean {
        return this._currentStateIndex == 0;
    }

    /**
     * Checks if the current state is the last one.
     */
    private _isLast(): boolean {
        return this._currentStateIndex == this._algorithm.states.length - 1;
    }

    /**
     * Fixes current state to always be in bounds. Useful when changing algorithms.
     *
     * Let's assume that algorithm state was 10 at some point. Then we change to an algorithm
     * which has only 5 steps. This function will make sure that the step is not 10, but 5.
     * It makes sure we're not out of bounds.
     */
    private _fixCurrentStateIndex(): void {
        if (this._currentStateIndex > this._algorithm.states.length - 1) {
            this._currentStateIndex = this._algorithm.states.length - 1;
        }
        if (this._currentStateIndex < 0) {
            this._currentStateIndex = 0;
        }
    }

    /**
     * Command to go to the first state.
     */
    public goToFirst(): void {
        this._currentStateIndex = 0;
        this._emitState();
    }

    /**
     * Command to go to the last state.
     */
    public goToLast(): void {
        this._currentStateIndex = this._algorithm.states.length - 1;
        this._emitState();
    }

    /**
     * Command to go a step back. No effect if at first state.
     */
    public goToPrevious(): void {
        if (!this._isFirst()) {
            this._currentStateIndex--;
            this._emitState();
        }
    }

    /**
     * Command to go a step forward. No effect if at last state.
     */
    public goToNext(): void {
        if (!this._isLast()) {
            this._currentStateIndex++;
            this._emitState();
        }
    }

    public play(): void {
        this._isPlaying$.next(true);
    }

    public pause(): void {
        this._isPlaying$.next(false);
    }

    /**
     * Command to directly change state to a given index.
     * @param stateIndex
     */
    public goTo(stateIndex: number): void {
        this._currentStateIndex = stateIndex;
        this._emitState();
    }

    /**
     * Returns algorithm
     * @returns {AlgorithmBase}
     */
    public getAlgorithm(): AlgorithmBase {
        return this._algorithm;
    }

    /**
     * Emits the current state along with some additional helping data (index, isLast, isFirst).
     * Emits null if no algorithm is given at the moment.
     * @private
     */
    private _emitState(): void {
        if (this._algorithm != null) {
            const state = this._algorithm.states[this._currentStateIndex];
            if (state) {
                this.state$.next({
                    state,
                    index: this._currentStateIndex,
                    total: this._getTotalNumberOfStates(),
                    isLast: this._isLast(),
                    isFirst: this._isFirst(),
                });
            }
        }

    }

    constructor(@Optional() private graphManager: GraphManager,
                @Optional() private algorithmManager: AlgorithmManager) {

        // Changes happen only when both are present, so we eliminate the possibility of 'property
        // is undefined' error.
        this._combine$ = Observable.combineLatest(
            this.graphManager.graph$,
            this.algorithmManager.algorithmWithOptions$
        );

        this._combine$.subscribe(combined => {
            this._graph = combined[0];
            this._algorithm = combined[1].algorithm;

            if (this._graph.nodes.length > 0) {
                this._rootId = this._graph.getNodeId(combined[1].options.root);
                this._algorithm.evaluateStatesFor(this._graph, this._rootId);
                this._fixCurrentStateIndex();
                this._emitState();
            } else {
                this._algorithm.states = [];
                this._currentStateIndex = 0;
                this._emitState();
            }
        });

        this._clock$
            .withLatestFrom(this._isPlaying$, (interval, isPlay) => isPlay)
            .filter(isPlay => isPlay)
            .subscribe(() => {
                if (!this._isLast()) {
                    this.goToNext();
                }
            });
    }

}
