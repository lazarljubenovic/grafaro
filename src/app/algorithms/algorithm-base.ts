import {NormalizedState} from './algorithm.service';
import {Graph, GraphJson} from '../models/graph.model';
import * as Esprima from 'esprima';

function _getLabelIfDefined(graph: Graph, nodeId: string): any {
    try {
        return graph.getNodeLabel(nodeId);
    } catch (e) {
        return nodeId;
    }
}

function _getLabelsIfDefined(graph: Graph, nodeIds: string[]): any {
    try {
        return nodeIds.map(nodeId => graph.getNodeLabel(nodeId));
    } catch (e) {
        return nodeIds;
    }
}

export function getLabelIfDefined(graph: Graph, id: any): any {
    if (Array.isArray(id)) {
        // if (Array.isArray(id[0])) {
            // eg. [['node-0', 42], ['node-1', 48]]
            // return;
        // } else {
            // eg. ['node-0', 'node-1']
            return _getLabelsIfDefined(graph, id);
        // }
    } else {
        return _getLabelIfDefined(graph, id);
    }
}

function transpose(arr: any[][]): any[][] {
    return arr[0].map((_, i) => arr.map(x => x[i]));
}

function attachNames(names, arr) {
    let o = {};
    for (let i = 0; i < arr.length; i++) {
        o[names[i]] = arr[i];
    }
    return o;
}

export function mergeArrays(names: string[], arrays: any[][]): any[] {
    return transpose(arrays).map((arr) => attachNames(names, arr));
}

export type DebugDataValueKind = 'node' | 'edge' | 'node-node' | 'node-number' | 'number';

export interface DebugDataValue {
    value: any;
    color: string;
    kind: DebugDataValueKind;
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

export function KindExporter(kind: DebugDataValueKind) {
    return function (target: AlgorithmState, key: string) {
        if (!target._kinds) {
            target._kinds = new Map<string, string>();
        }
        target._kinds.set(key, kind);
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

    /**
     * Filled with decorators.
     * @internal
     */
    public _kinds: Map<string, string>;

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

    public getDefaultDebugKind: (trackedVar: any) => any = (trackedVar) => {
        if (trackedVar == null) {
            if (Array.isArray(trackedVar)) {
                return ['node'];
            } else {
                return 'node';
            }
        }
        console.log('checking if ... is array', trackedVar);
        if (Array.isArray(trackedVar)) {
            return trackedVar.map(_ => 'node');
        } else {
            return 'node';
        }
    };

    public getDebugKind: (trackedVarName: any) => any = (trackedVarName) => {
        if (!this._kinds) {
            return this.getDefaultDebugKind(this[trackedVarName]);
        }
        if (Array.isArray(this[trackedVarName])) {
            return this[trackedVarName].map(_ => this._kinds.get(trackedVarName));
        }
            return this._kinds.get(trackedVarName);
    };

    public getDebugColor(trackedVarName: string): any {
        const varVal = this[trackedVarName];
        if (!this._exportFunctions) {
            return this.getDefaultDebugColor(varVal);
        }
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
            const kind = this.getDebugKind(name);

            let data;
            if (type == 'single') {
                const color = this.getDebugColor(name);
                data = {value, color, kind};
            } else if (type == 'array') {
                const color = this.getDebugColor(name);
                console.log('~~~~~~~~~~~~~~~~~~', value, color, kind);
                data = mergeArrays(['value', 'color', 'kind'], [value, color, kind]);
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

    public abstract name: string;
    public abstract abbr: string;

    protected abstract states: AlgorithmState[];

    public abstract code: string;
    public abstract trackedVariables: string[];

    public abstract normalize(state: AlgorithmState): NormalizedState;

    public abstract algorithmFunction(graph: Graph, rootId: string): AlgorithmState[];

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
