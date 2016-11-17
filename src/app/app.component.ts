import {Component} from "@angular/core";
import {Graph} from "graphlib";
import {breadthFirstSearch, BreadthFirstSearchState} from "./algorithms/breadth-first-search";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {

    public graph = new Graph({directed: false})
        .setEdge('A', 'B', '1')
        .setEdge('A', 'C', '2')
        .setEdge('A', 'D', '3')
        .setEdge('B', 'E', '4')
        .setEdge('C', 'F', '5')
        .setEdge('C', 'G', '6')
        .setEdge('G', 'H', '7')
        .setEdge('E', 'J', '8')
        .setEdge('J', 'I', '9')
        .setEdge('D', 'I', '10')
        .setEdge('G', 'I', '11');

    public root: string = 'A';

    ngOnInit() {
    }

}
