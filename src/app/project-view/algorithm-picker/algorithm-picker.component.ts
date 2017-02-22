import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {GraphManager} from '../../managers/graph.manager';
import {AlgorithmManager} from '../../managers/algorithm.manager';
import {Subject} from 'rxjs';
import {AlgorithmStorageService} from '../services/algorithm-socket/algorithm-storage.service';
import {AlgorithmMessage} from '../services/algorithm-socket/algorithm-socket';

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
export class AlgorithmPickerComponent implements OnInit, OnDestroy {

    private _destroySubject = new Subject<boolean>();
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
                private _algorithmStorage: AlgorithmStorageService) {
    }

    ngOnInit() {
        this._graphManager.graph$
            .takeUntil(this._destroySubject)
            .subscribe(graph => {
                this.nodeLabels = graph.nodes.map(node => node.label);
            });

        this.form.valueChanges
            .takeUntil(this._destroySubject)
            .subscribe(form => {
                this._algorithmManager.setAndEmit(form);
                this._algorithmStorage.send(form);
            });

        this._algorithmStorage.algorithmMessages$
            .takeUntil(this._destroySubject)
            .subscribe((message: AlgorithmMessage) => {
                this.form.patchValue(message.info);
            });
    }

    ngOnDestroy() {
        this._algorithmStorage.restartAlgorithmWithOptions();
        this._destroySubject.next(true);
        this._destroySubject.unsubscribe();
    }

}
