import {NormalizedState} from './algorithm.service';
import {Graph} from '../models/graph.model';

export interface AlgorithmState {

}

export abstract class AlgorithmBase {

    public abstract code: string;

    public abstract normalize(state: AlgorithmState): NormalizedState;

    public abstract algorithmFunction(graph: Graph, rootId: string);

    public getCodeJson(state: AlgorithmState) {
        return this.code
            .replace(/ /g, '\u00a0')
            .split('\n')
            .map(line => line
                .split(/(\^\[.*?\]\^)/g)
                .map(word => {
                        if (word.startsWith('^[')) {
                            word = word.slice(2, -2);
                            let text;
                            let propName;
                            if (word.indexOf('|') !== -1) {
                                [text, propName] = word.split('|').map(el => el.trim());
                            } else {
                                [text, propName] = [word, word];
                            }
                            const isArray: boolean = (typeof state[propName] == 'object')
                                && (state[propName].length != null);
                            return {
                                text,
                                annotation: {
                                    value: state[propName],
                                    type: isArray ? 'array' : 'single',
                                }
                            };
                        } else {
                            return {
                                text: word,
                            };
                        }
                    }
                )
            );
    }

}
