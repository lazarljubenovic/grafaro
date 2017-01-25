import {NormalizedState} from './algorithm.service';
import {Graph, GraphJson} from '../models/graph.model';
import * as Esprima from 'esprima';

export function getLabelIfDefined(graph: Graph, nodeId: string): any {
    if (nodeId === undefined) {
        return undefined;
    }
    if (nodeId === null) {
        return null;
    }
    try {
        return graph.getNodeLabel(nodeId);
    } catch (e) {
        return nodeId;
    }
}

export function getLabelsIfDefined(graph: Graph, nodeIds: string[]): any {
    if (nodeIds === undefined) {
        return undefined;
    }
    if (nodeIds === null) {
        return null;
    }
    try {
        return nodeIds.map(nodeId => graph.getNodeLabel(nodeId));
    } catch (e) {
        return nodeIds;
    }
}

export function mergeArrays(name1: string, name2: string, arr1: any[], arr2: any[]): any[] {
    return arr1.map((x, i) => ({
        [name1]: x,
        [name2]: arr2[i],
    }));
}

export interface DebugDataValue {
    value: any;
    color: string;
}

export interface DebugData {
    type: 'single' | 'array';
    name: string;
    data: DebugDataValue | DebugDataValue[];
    isInScope: boolean;
}

export function TrackedVariable() {
    return function (target: AlgorithmState, key: string) {
        if (!target._trackedVarsNames) {
            target._trackedVarsNames = [];
        }
        target._trackedVarsNames.push(key);
    };
}

export function ColorExporter(params: string[], fn: Function) {
    return function (target: AlgorithmState, key: string) {
        if (!target._exportFunctions) {
            target._exportFunctions = new Map();
        }
        target._exportFunctions.set(key, {params, fn});
    };
}

export abstract class AlgorithmState {

    /**
     * Filled with decorators.
     * @internal
     */
    public _trackedVarsNames: string[];

    /**
     * Filled with decorators.
     * @internal
     */
    public _exportFunctions: Map<string, {params: string[], fn: Function}>;

    public graphJson: GraphJson;
    public lineNumber: number;

    constructor(graph: Graph, lineNumber: number) {
        this.graphJson = graph.writeJson();
        this.lineNumber = lineNumber;
    }

    public getDefaultDebugColor: (trackedVar: any) => any = (trackedVar) => {
        if (trackedVar == null) {
            if (Array.isArray(trackedVar)) {
                return ['default'];
            } else {
                return 'default';
            }
        }
        if (Array.isArray(trackedVar)) {
            return trackedVar.map(x => x == this['currentNode'] ? 'accent' : 'default');
        } else {
            return trackedVar == this['currentNode'] ? 'accent' : 'default';
        }
    };

    public getDefaultDebugScope: (trackedVar: any) => any = (trackedVar) => {
        return trackedVar !== undefined;
    };

    public getDefaultDebugType: (trackedVar: any) => any = (trackedVar) => {
        return Array.isArray(trackedVar) ? 'array' : 'single';
    };

    public getDebugColor(trackedVarName: string): any {
        const varVal = this[trackedVarName];
        if (varVal == null) {
            return this.getDefaultDebugColor(varVal);
        }
        if (Array.from(this._exportFunctions.keys()).indexOf(trackedVarName) != -1) {
            const firstArg = varVal;
            const restArgs = this._exportFunctions.get(trackedVarName).params.map(x => this[x]);
            const args = [firstArg, ...restArgs];
            const fn = this._exportFunctions.get(trackedVarName).fn;
            return fn(...args);
        } else {
            return this.getDefaultDebugColor(varVal);
        }
    }

    public getDebugData(): DebugData[] {
        return this._trackedVarsNames.map(name => {
            const value = this[name];
            const isInScope = this.getDefaultDebugScope(value);
            const type = this.getDefaultDebugType(value);

            let data;
            if (type == 'single') {
                const color = this.getDebugColor(name);
                data = {value, color};
            } else if (type == 'array') {
                const color = this.getDebugColor(name);
                data = mergeArrays('value', 'color', value, color);
            }

            return {type, name, isInScope, data};
        });
    }

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

        for (let i = 0; i < tokens.length; i++) {
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
