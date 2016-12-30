import {Component, OnInit} from '@angular/core';
import {BreadthFirstSearchService} from '../breadth-first-search/breadth-first-search.service';
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
        this.graphService.addNodeOnRandomPlace();
    }

    public removeNode(): void {
        this.graphService.removeNode(this.graphService.getNodeId(this.labels.pop()));
    }

    public connectNode(row: number, column: number) {
        const nodeA = this.graphService.getNodeId(this.labels[row]);
        const nodeB = this.graphService.getNodeId(this.labels[column]);

        if (this.data[row][column] == 0) {
            this.graphService.linkNodes(nodeA, nodeB);
        } else {
            this.graphService.unlinkNodes(nodeA, nodeB);
        }
    }

    // TODO fix this shitty code
    private graphToMatrix(): void {
        const nodes = this.graph.nodes;
        const matrix: number[][] = Array(nodes.length).fill(null)
            .map(row => Array(nodes.length).fill(0));
        const labels: string[] = this.graph.nodes.map(node => node.label);

        nodes.forEach(node => {
            const nodeInd: number = labels.indexOf(this.graphService.getNodeLabel(node.id));
            [...this.graph.getSinks(node.id), ...this.graph.getSources(node.id)]
                .forEach(edge => {
                    const nodeB = node.id == edge.from ? edge.to : edge.from;
                    const nodeBInd: number = labels.indexOf(this.graphService.getNodeLabel(nodeB));
                    matrix[nodeInd][nodeBInd] = 1;
                });

        });

        this.data = matrix;
        this.labels = labels;
    }

    constructor(private graphService: BreadthFirstSearchService) {
    }

    ngOnInit() {
        this.graphService.graphState$.subscribe(graphState => {
            this.graph = graphState;
            this.graphToMatrix();
        });
    }

}
