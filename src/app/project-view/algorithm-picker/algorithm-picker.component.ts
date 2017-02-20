import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {GraphManager} from '../../managers/graph.manager';
import {AlgorithmManager} from '../../managers/algorithm.manager';
import {AlgorithmSocketService, AlgorithmMessage} from '../algorithm-socket.service';
import {MasterStorageService} from '../../shared/master-service/master-storage.service';
import {Subject} from 'rxjs';

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
                private _algorithmSocket: AlgorithmSocketService,
                private _masterStorage: MasterStorageService) {
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
                this._algorithmSocket.send(form);
            });

        this._algorithmSocket.algorithmSocket$
            .takeUntil(this._destroySubject)
            .subscribe((message: AlgorithmMessage) => {
                this.form.patchValue(message.info);
            });

        this._masterStorage.masterMessages$
            .takeUntil(this._destroySubject)
            .subscribe(master => {
                this._algorithmSocket.canSend = master.isMaster;
            });
    }

    ngOnDestroy() {
        this._destroySubject.next(true);
        this._destroySubject.unsubscribe();
    }

}
