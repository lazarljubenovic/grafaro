import {Injectable} from '@angular/core';
import {AlgorithmBase} from '../algorithms/algorithm-base';
import {BehaviorSubject} from 'rxjs';
import {FormOptions} from '../project-view/algorithm-picker/algorithm-picker.component';
import {BreadthFirstSearchAlgorithm} from '../algorithms/breadth-first-search';
import {AlgorithmFactory} from '../algorithms/algorithm-factory';

export interface AlgorithmWithOptions {
    options: {
        root: string;
    };
    algorithm: AlgorithmBase;
}

@Injectable()
export class AlgorithmManager {
    private algorithmFactory: AlgorithmFactory = new AlgorithmFactory();

    private _algorithmWithOptions: AlgorithmWithOptions = {
        options: {
            root: 'B',
        },
        algorithm: new BreadthFirstSearchAlgorithm(),
    };

    public algorithmWithOptions$ =
        new BehaviorSubject<AlgorithmWithOptions>(this._algorithmWithOptions);

    public setAndEmit(formOptions: FormOptions): void {
        let algorithm: AlgorithmBase;
        algorithm = this.algorithmFactory.getAlgorithm(formOptions.algorithm);
        // todo after node addition, root reverts to 'B'
        this._algorithmWithOptions.options = formOptions.options;
        this._algorithmWithOptions.algorithm = algorithm;
        this.algorithmWithOptions$.next(this._algorithmWithOptions);
    }

}
