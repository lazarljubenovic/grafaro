import {Component, OnInit} from '@angular/core';
import {AlgorithmService} from '../algorithms/algorithm.service';
import {Graph} from '../models/graph.model';

@Component({
    selector: 'grf-matrix',
    templateUrl: './matrix.component.html',
    styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

    public data: number[][] = [[0, 1], [1, 0]];

    public labels: string[] = [];

    private graph: Graph;

    public highlightedIndexes: number[] = [-1, -1];

    public highlight(row: number, column: number): void {
        this.highlightedIndexes = [row, column];
    }

    public addNode(): void {
        this.algorithmService.addNodeOnRandomPlace();
    }

    public removeNode(): void {
        this.algorithmService.removeNode(this.algorithmService.getNodeId(this.labels.pop()));
    }

    public connectNode(row: number, column: number) {
        const nodeA = this.algorithmService.getNodeId(this.labels[row]);
        const nodeB = this.algorithmService.getNodeId(this.labels[column]);

        if (this.data[row][column] == 0) {
            this.algorithmService.linkNodes(nodeA, nodeB);
        } else {
            this.algorithmService.unlinkNodes(nodeA, nodeB);
        }
    }

    private graphToMatrix(): void {
        let matrix: number[][] = this.algorithmService.graph.getMatrix();
        matrix = matrix.map(row => row.map(entry => entry ? entry : 0));

        this.data = matrix;
        this.labels = this.algorithmService.graph.nodes.map(node => node.label);
    }

    constructor(private algorithmService: AlgorithmService) {
    }

    ngOnInit() {
        this.algorithmService.graphState$.subscribe(graphState => {
            this.graph = graphState;
            this.graphToMatrix();
        });
    }

}
