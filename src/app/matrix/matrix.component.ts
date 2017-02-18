import {Component, OnInit} from '@angular/core';
import {GraphManager} from '../managers/graph.manager';

@Component({
    selector: 'grf-matrix',
    templateUrl: './matrix.component.html',
    styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

    public data: number[][] = [[]];

    public labels: string[] = [];

    public highlightedIndexes: number[] = [-1, -1];

    public isEditWeightMode: boolean = false;

    public trackByIndex(index: number, item: any): number {
        return index;
    }

    public toggleEditWeightMode() {
        this.isEditWeightMode = !this.isEditWeightMode;
    }

    public highlight(row: number, column: number): void {
        this.highlightedIndexes = [row, column];
    }

    public addNode(): void {
        this.graphManager.addNodeOnRandomPlace();
    }

    public log() {
        console.log('tick');
    }

    public toggleEdge(row: number, column: number): void {
        const from = this.graphManager.getNodeId(this.labels[row]);
        const to = this.graphManager.getNodeId(this.labels[column]);

        if (this.data[row][column] == 0) {
            this.graphManager.linkNodes(from, to);
        } else {
            this.graphManager.unlinkNodes(from, to);
        }
    }

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

    ngOnInit() {
        this.graphManager.graph$.subscribe(graph => {
            let matrix: number[][] = graph.getMatrix();
            matrix = matrix.map(row => row.map(entry => entry ? entry : 0));

            this.data = matrix;
            this.labels = graph.nodes.map(node => node.label);
        });
    }

}
