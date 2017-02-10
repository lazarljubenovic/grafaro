import {BreadthFirstSearchAlgorithm} from './breadth-first-search';
import {AlgorithmBase} from './algorithm-base';
import {DepthFirstSearchAlgorithm} from './depth-first-search';
import {DijkstraShortestPathAlgorithm} from './dijkstra-shortest-path';

export class AlgorithmFactory {
    public getAlgorithm(abbr: string) {
        let algorithm: AlgorithmBase;

        switch (abbr) {
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

        return algorithm;
    }
}
