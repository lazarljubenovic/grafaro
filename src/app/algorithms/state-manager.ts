import {AlgorithmBase, AlgorithmState} from './algorithm-base';
import {ReplaySubject} from 'rxjs';
import {Graph} from '../models/graph.model';

export interface StateManagerObject {
    state: AlgorithmState;
    index: number;
    total: number;
    isLast: boolean;
    isFirst: boolean;
}

export class AlgorithmStateManager {

    /**
     * We need these so we know which graph and root to evaluate a new algorithm when user changes
     * the algorithm (because they stay the same).
     */
    private _graph: Graph;
    private _rootId: string;

    /**
     * Concrete algorithm which is currently managed.
     */
    private _algorithm: AlgorithmBase;

    /**
     * A number (index) which points to the current state of the algorithm. Initially 0.
     */
    private _currentStateIndex: number = 0;

    public state$ = new ReplaySubject<StateManagerObject>();

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

    /**
     * Changes the current algorithm whose states are being managed. Note that this also includes
     * any change to the graph or its options.
     * @param algorithmStrategy
     */
    public setAlgorithm(algorithmStrategy: AlgorithmBase): void {
        this._algorithm = algorithmStrategy;
        if (this._graph && this._rootId) {
            this._algorithm.evaluateStatesFor(this._graph, this._rootId);
            this._fixCurrentStateIndex();
            this._emitState();
        }
    }

    /**
     * Evaluate states for the already given algorithm and given graph.
     *
     * @param graph
     * @param rootId
     *
     * @throws Throws if algorithm is not set.
     */
    public setGraph(graph: Graph, rootId: string): void {
        if (!this._algorithm) {
            throw new Error(`Must set algorithm before setting graph and additional options`);
        }
        this._graph = graph;
        this._rootId = rootId;
        this._algorithm.evaluateStatesFor(this._graph, this._rootId);
        this._fixCurrentStateIndex();
        this._emitState();
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
                    isLast: this._currentStateIndex == this._algorithm.states.length - 1,
                    isFirst: this._currentStateIndex == 0,
                });
            }
        }

    }

}