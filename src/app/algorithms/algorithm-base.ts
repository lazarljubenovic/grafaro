import {NormalizedState} from './algorithm.service';
import {Graph} from '../models/graph.model';
import * as Esprima from 'esprima';

export interface AlgorithmState {

}

export interface CodeJsonElement {
    text: string;
    type: string;
}

export type CodeJson = CodeJsonElement[][];

export abstract class AlgorithmBase {

    public abstract code: string;

    public abstract trackedVariables: string[];

    public abstract normalize(state: AlgorithmState): NormalizedState;

    public abstract algorithmFunction(graph: Graph, rootId: string);

    public getCodeJson(state: AlgorithmState, trackedVariables: string[]): CodeJson {
        const tokens = Esprima.tokenize(this.code, {loc: true});
        const numberOfLines = this.code.split('\n').length;
        let codeJson = Array(numberOfLines).fill(null).map(_ => []);
        let previousLine = 0;
        let currentLine = 1;
        let currentColumn = 0;
        let token;

        for (let i = 0 ; i < tokens.length; i++) {
            token = tokens[i];
            currentLine = (<any>token).loc.start.line - 1;

            if (currentLine != previousLine) {
                currentColumn = 0;
            }

            const whitespaceDiff: number = token.loc.start.column - currentColumn;
            currentColumn = token.loc.end.column;

            const isTracked: boolean = trackedVariables.indexOf(token.value) != -1;

            if (whitespaceDiff > 0) {
                codeJson[currentLine].push({
                    text: Array(whitespaceDiff).fill('\xa0').join(''),
                    type: 'Whitespace',
                    isTracked: false,
                });
            }

            codeJson[currentLine].push({
                text: token.value,
                type: token.type,
                isTracked,
                value: state[token.value],
            });
            previousLine = currentLine;
        }
        return codeJson;
    }

}
