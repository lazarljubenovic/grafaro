import {Component, OnInit} from "@angular/core";
import {BreadthFirstSearchService} from "../breadth-first-search/breadth-first-search.service";

@Component({
    selector: 'grf-matrix',
    templateUrl: './matrix.component.html',
    styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

    public data = this.graphService.matrixState$;

    public labels = this.graphService.labelsState$;

    public addNode(): void {
        this.graphService.addNodeOnRandomPlace();
    }

    public connectNode(row: number, column: number) {
        const rowLabel: string = this.labels[row];
        const columnLabel: string = this.labels[column];

        this.data[row][column] = (this.data[row][column] + 1) % 2;

        if (row != column) {
            this.data[column][row] = (this.data[column][row] + 1) % 2;
        }

        if (this.data[row][column] == 1) {
            this.graphService.linkNodesByLabel(rowLabel, columnLabel);
        } else {
            this.graphService.unlinkNodesByLabel(rowLabel, columnLabel);
        }

        // this.data = [...this.data];
    }

    constructor(private graphService: BreadthFirstSearchService) {
    }

    ngOnInit() {
    }

}
