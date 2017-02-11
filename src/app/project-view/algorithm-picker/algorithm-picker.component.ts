import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {GraphManager} from '../../managers/graph.manager';
import {AlgorithmManager} from '../../managers/algorithm.manager';
import {AlgorithmSocketService, AlgorithmMessage} from '../algorithm-socket.service';
import {MasterSocketService} from '../master-socket.service';

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
                private _algorithmManager: AlgorithmManager,
                private _algorithmSocket: AlgorithmSocketService,
                private _masterSocket: MasterSocketService) {
    }

    ngOnInit() {
        this._graphManager.graph$.subscribe(graph => {
            this.nodeLabels = graph.nodes.map(node => node.label);
        });

        this.form.valueChanges.subscribe(form => {
            this._algorithmManager.setAndEmit(form);
            this._algorithmSocket.send(form);
        });

        this._algorithmSocket.algorithmSocket$.subscribe((message: AlgorithmMessage) => {
            this.form.patchValue(message.info);
        });

        this._masterSocket.masterSocket$
            .subscribe(master => {
                this._algorithmSocket.canSend = master.isMaster;
            });
    }

}
