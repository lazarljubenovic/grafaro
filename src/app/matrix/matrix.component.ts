import {Component, OnInit} from "@angular/core";
import {BreadthFirstSearchService} from "../breadth-first-search/breadth-first-search.service";
import {Graph} from "graphlib";

@Component({
    selector: 'grf-matrix',
    templateUrl: './matrix.component.html',
    styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

    public data: number[][] = [[0, 1], [1, 0]];

    public labels: string[] = [];

    private graph: Graph;

    public addNode(): void {
        this.graphService.addNodeOnRandomPlace();
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

    private graphToMatrix(): void {
        const nodes = this.graph.nodes();
        const matrix: number[][] = Array(nodes.length).fill(null)
            .map(row => Array(nodes.length).fill(0));
        const labels: string[] = nodes.map(node => this.graph.node(node));

        nodes.forEach(node => {
            const nodeInd: number = labels.indexOf(this.graphService.getNodeLabel(node));
            this.graph.nodeEdges(node)
                .forEach(edge => {
                    const nodeB = node == edge.v ? edge.w : edge.v;
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
        this.graphService.graphState$
            .subscribe(graphState => {
                this.graph = graphState;
                this.graphToMatrix();
            });
    }

}
