import {Component, OnInit} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Component({
    selector: 'grf-algorithm',
    templateUrl: './algorithm.component.html',
    styleUrls: ['./algorithm.component.scss']
})
export class AlgorithmComponent implements OnInit {

    public lineNumber = 0;

    public mockArray = ['A', 'B', 'C', 'D'];
    public highlights = ['B', 'C'];

    public visitedOpen = new BehaviorSubject<boolean>(false);

    public removeFromArray(item: string): void {
        this.mockArray = this.mockArray.filter(e => e != item);
    }

    public randomLineNumber() {
        this.lineNumber = Math.floor(Math.random() * 12 + 1);
    }

    constructor() {
    }

    ngOnInit() {
    }

}