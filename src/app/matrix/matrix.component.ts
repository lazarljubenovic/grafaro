import {Component, OnInit} from "@angular/core";
import {BreadthFirstSearchService} from "../breadth-first-search/breadth-first-search.service";

@Component({
    selector: 'grf-matrix',
    templateUrl: './matrix.component.html',
    styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

    public data: number[][] = [
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 1, 1, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    ];

    public labels: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    public addNode(): void {
        this.labels.push(this.graphService.suggestNewNodeName());

        this.data.forEach(row => row.push(0));
        this.data.push(Array(this.labels.length).fill(0));
        this.data = [...this.data];
        this.labels = [...this.labels];

        this.graphService.addNodeOnRandomPlace();
    }

    constructor(private graphService: BreadthFirstSearchService) {
    }

    ngOnInit() {
    }

}
