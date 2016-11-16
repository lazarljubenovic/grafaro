import {Component} from "@angular/core";
import {Graph} from "graphlib";
import {breadthFirstSearch} from "./algorithms/breadth-first-search";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public graph = new Graph({directed: false})
        .setEdge('A', 'B')
        .setEdge('A', 'C')
        .setEdge('A', 'D')
        .setEdge('B', 'E')
        .setEdge('C', 'F')
        .setEdge('C', 'G')
        .setEdge('G', 'H')
        .setEdge('E', 'J')
        .setEdge('J', 'I')
        .setEdge('D', 'I');

    public solution;

    ngOnInit() {
        this.solution = breadthFirstSearch(this.graph, 'A');
        console.log(this.solution);
    }

}
