import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {AlgorithmService} from '../algorithms/algorithm.service';
import {NotifyService} from './notify.service';
import {DebugTableService} from '../debug-table/debug-table.service';
import {DijkstraShortestPathAlgorithm} from '../algorithms/dijkstra-shortest-path';
import {CodeJson} from '../algorithms/algorithm-base';
import {StateManagerObject, AlgorithmStateManager} from '../algorithms/state-manager';

@Component({
    selector: 'grf-algorithm',
    templateUrl: './algorithm.component.html',
    styleUrls: ['./algorithm.component.scss'],
})
export class AlgorithmComponent implements OnInit {

    public code: CodeJson;

    public lineNumber: number;

    public trackByIndex(index: number, item: any) {
        return index;
    }

    constructor(private stateManager: AlgorithmStateManager,
                private debugTableService: DebugTableService) {
    }

    public toggleTrackedVariableVisibility(varName: string): void {
        this.debugTableService.toggleVariable(varName);
    }

    ngOnInit() {
        this.stateManager.state$.subscribe(state => {
            this.code = this.stateManager.getAlgorithm().getCodeJson();
            this.lineNumber = state.state.lineNumber;
        });
    }

}
