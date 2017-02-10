import {Injectable} from '@angular/core';
import {AlgorithmBase} from '../algorithms/algorithm-base';
import {BehaviorSubject} from 'rxjs';
import {FormOptions} from '../project-view/algorithm-picker/algorithm-picker.component';
import {BreadthFirstSearchAlgorithm} from '../algorithms/breadth-first-search';
import {DepthFirstSearchAlgorithm} from '../algorithms/depth-first-search';
import {DijkstraShortestPathAlgorithm} from '../algorithms/dijkstra-shortest-path';

export interface AlgorithmWithOptions {
    options: {
        root: string;
    };
    algorithm: AlgorithmBase;
}

@Injectable()
export class AlgorithmManager {

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
        switch (formOptions.algorithm) {
            case 'bfs':
                algorithm = new BreadthFirstSearchAlgorithm();
                break;
            case 'dfs':
                algorithm = new DepthFirstSearchAlgorithm();
                break;
            case 'dsp':
                algorithm = new DijkstraShortestPathAlgorithm();
                break;
            default:
                throw 'TODO';
        }
        // todo after node addition, root reverts to 'B'
        this._algorithmWithOptions.options = formOptions.options;
        this._algorithmWithOptions.algorithm = algorithm;
        this.algorithmWithOptions$.next(this._algorithmWithOptions);
    }

}
