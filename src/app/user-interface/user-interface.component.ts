import {Component, OnInit} from "@angular/core";
import {Graph} from "graphlib";

@Component({
    selector: 'grf-user-interface',
    templateUrl: './user-interface.component.html',
    styleUrls: ['./user-interface.component.scss']
})
export class UserInterfaceComponent implements OnInit {

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

    constructor() {
    }

    ngOnInit() {
    }

}
