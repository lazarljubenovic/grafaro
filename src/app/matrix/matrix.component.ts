import {Component, OnInit, OnDestroy} from '@angular/core';
import {GraphManager} from '../managers/graph.manager';
import {Subject} from 'rxjs';

@Component({
    selector: 'grf-matrix',
    templateUrl: './matrix.component.html',
    styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit, OnDestroy {

    /**
     * Used for easy unsubscription.
     * @type {Subject}
     * @private
     */
    private _destroySubject: Subject<boolean> = new Subject();
    /**
     * Matrix representation of graph.
     * @type {number[][]}
     * @public
     */
    public data: number[][] = [[]];
    /**
     * Labels of nodes.
     * @type {string[]}
     * @public
     */
    public labels: string[] = [];
    /**
     * Index of highlighted node in data.
     * @type {[number,number]}
     * @public
     */
    public highlightedIndexes: number[] = [-1, -1];
    /**
     * Switch for edit modes.
     * @type {boolean}
     * @public
     */
    public isEditWeightMode: boolean = false;

    /**
     * Angular necessity used for iterating in *ngFor
     * @param index
     * @param item
     * @returns {number}
     * @public
     */
    public trackByIndex(index: number, item: any): number {
        return index;
    }

    /**
     * Switches edit modes.
     * @param val
     * @public
     */
    public setEditWeightMode(val: boolean): void {
        this.isEditWeightMode = val;
    }

    /**
     * Highlights current node label.
     * @param row
     * @param column
     * @public
     */
    public highlight(row: number, column: number): void {
        this.highlightedIndexes = [row, column];
    }

    /**
     * Adds node on random place through matrix.
     * @public
     */
    public addNode(): void {
        this.graphManager.addNodeOnRandomPlace();
    }

    /**
     * todo
     */
    public log() {
        console.log('tick');
    }

    /**
     * Connects two nodes through matrix.
     * @param row
     * @param column
     * @public
     */
    public toggleEdge(row: number, column: number): void {
        const from = this.graphManager.getNodeId(this.labels[row]);
        const to = this.graphManager.getNodeId(this.labels[column]);

        if (this.data[row][column] == 0) {
            this.graphManager.linkNodes(from, to);
        } else {
            this.graphManager.unlinkNodes(from, to);
        }
    }

    /**
     * Sets edge weight through matrix.
     * @param row
     * @param column
     * @param weight
     * @public
     */
    public setWeight(row: number, column: number, weight: number): void {
        const from = this.graphManager.getNodeId(this.labels[row]);
        const to = this.graphManager.getNodeId(this.labels[column]);

        const previousValue = this.data[row][column];

        if (previousValue == 0) {
            if (weight == 0 || weight == null) {
                return;
            } else {
                this.graphManager.linkNodes(from, to, weight);
            }
        } else {
            if (weight == 0 || weight == null) {
                this.graphManager.unlinkNodes(from, to);
            } else {
                const edgeId = this.graphManager.getEdgeByNodes(from, to).id;
                this.graphManager.changeEdgeWeight(edgeId, weight);
            }
        }


    }

    constructor(private graphManager: GraphManager) {
    }

    /**
     * Subscriptions go here.
     */
    ngOnInit() {
        this.graphManager.graph$
            .takeUntil(this._destroySubject)
            .subscribe(graph => {
                let matrix: number[][] = graph.getMatrix();
                matrix = matrix.map(row => row.map(entry => entry ? entry : 0));

                this.data = matrix;
                this.labels = graph.nodes.map(node => node.label);
            });
    }

    /**
     * Unsubscription using _destroySubject.
     */
    ngOnDestroy() {
        this._destroySubject.next(true);
        this._destroySubject.unsubscribe();
    }

}
