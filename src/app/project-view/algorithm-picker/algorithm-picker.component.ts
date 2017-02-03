import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {GraphManager} from '../../managers/graph.manager';
import {AlgorithmManager} from '../../managers/algorithm.manager';

export interface FormOptions {
    options: {
        root: string;
    };
    algorithm: string;
}

@Component({
    selector: 'grf-algorithm-picker',
    templateUrl: './algorithm-picker.component.html',
    styleUrls: ['./algorithm-picker.component.scss']
})
export class AlgorithmPickerComponent implements OnInit {

    public form: FormGroup = this.formBuilder.group({
        algorithm: 'bfs',
        options: this.formBuilder.group({
            root: 'A',
        }),
    });

    public nodeLabels: string[] = [];

    constructor(private formBuilder: FormBuilder,
                private _graphManager: GraphManager,
                private _algorithmManager: AlgorithmManager) {
    }

    ngOnInit() {
        this._graphManager.graph$.subscribe(graph => {
            this.nodeLabels = graph.nodes.map(node => node.label);
            // todo read this from room socket
            // also read algorithm
            this.form.patchValue({
                options: {
                    root: this.nodeLabels[1]
                }
            });
        });

        this.form.valueChanges.subscribe(form => {
            this._algorithmManager.setAndEmit(form);
        });
    }

}
