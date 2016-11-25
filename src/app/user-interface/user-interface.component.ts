import {Component, OnInit} from "@angular/core";
import {Graph} from "graphlib";
import {Subject, Observable} from "rxjs";
import {Actions, ClickPosition} from "./toolbar/toolbar.component";
import {GraphOptionsService} from "../graph-options.service";

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

    public chooseTool$: Subject<Actions> = new Subject<Actions>();
    public click$: Subject<ClickPosition> = new Subject<ClickPosition>();

    public actions$: Observable<[ClickPosition, Actions]> = this.click$.withLatestFrom(this.chooseTool$);

    constructor(private graphOptionsService: GraphOptionsService) {
    }

    ngOnInit() {

        // Initial settings
        this.graphOptionsService.setOptions([
            {name: 'physics.enabled', value: false},
        ]);

        // We need timeout so the subscriptions below are triggered properly.
        setTimeout(() => this.chooseTool$.next(Actions.select));

        this.chooseTool$
            .filter(tool => tool === Actions.select)
            .subscribe(tool => {
                this.graphOptionsService.setOptions([
                    {name: 'interaction.dragView', value: true},
                    {name: 'interaction.selectable', value: true},
                    {name: 'interaction.dragNodes', value: true},
                ]);
            });

        this.chooseTool$
            .filter(tool => tool !== Actions.select)
            .subscribe(tool => {
                this.graphOptionsService.setOptions([
                    {name: 'interaction.dragView', value: false},
                    {name: 'interaction.selectable', value: false},
                    {name: 'interaction.dragNodes', value: false},
                ]);
            });

        this.actions$
            .subscribe(values => {
                const position: ClickPosition = values[0];
                const tool: number = values[1];
                console.log(`Position: (${position.x}, ${position.y}); tool: ${tool}`);
            });

    }

}
