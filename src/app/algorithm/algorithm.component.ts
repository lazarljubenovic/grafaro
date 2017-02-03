import {Component, OnInit} from '@angular/core';
import {DebugTableService} from '../debug-table/debug-table.service';
import {CodeJson} from '../algorithms/algorithm-base';
import {AlgorithmStateManager} from '../algorithms/state-manager';

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
