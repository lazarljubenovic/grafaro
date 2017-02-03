import {Component, OnInit} from '@angular/core';
import {GraphManager} from '../managers/graph.manager';

@Component({
    selector: 'grf-matrix',
    templateUrl: './matrix.component.html',
    styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

    public data: number[][] = [[0, 1], [1, 0]];

    public labels: string[] = [];

    public highlightedIndexes: number[] = [-1, -1];

    public highlight(row: number, column: number): void {
        this.highlightedIndexes = [row, column];
    }

    public addNode(): void {
        this.graphManager.addNodeOnRandomPlace();
    }

    public removeNode(): void {
        this.graphManager.removeNode(this.graphManager.getNodeId(this.labels.pop()));
    }

    public connectNode(row: number, column: number) {
        const nodeA = this.graphManager.getNodeId(this.labels[row]);
        const nodeB = this.graphManager.getNodeId(this.labels[column]);

        if (this.data[row][column] == 0) {
            this.graphManager.linkNodes(nodeA, nodeB);
        } else {
            this.graphManager.unlinkNodes(nodeA, nodeB);
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
