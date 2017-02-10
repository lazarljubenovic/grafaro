import {NormalizedState} from './normalized-state.model';
import {Graph, GraphJson} from '../models/graph.model';
import * as Esprima from 'esprima';
import {GrfColor, GrfGraphNodeOptions, GrfRole} from '../graph/graph.module';
import {VisNgNetworkOptionsEdges} from '@lazarljubenovic/vis-ng/core';
import {DebugData} from './debug-data.interface';
import {mergeArrays} from './utils';


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
                return [GrfColor.DEFAULT];
            } else {
                return GrfColor.DEFAULT;
            }
        }
        // todo current node is expected to be found in the subclass. how to handle?
        if (Array.isArray(trackedVar)) {
            return trackedVar.map(x => {
                return x == (<any>this)['currentNode'] ? GrfColor.ACCENT : GrfColor.DEFAULT;
            });
        } else {
            return trackedVar == (<any>this)['currentNode'] ? GrfColor.ACCENT : GrfColor.DEFAULT;
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
        if (Array.isArray(trackedVar)) {
            return trackedVar.map(_ => 'node');
        } else {
            return 'node';
        }
    };

    public getDebugKind: (trackedVarName: any) => any = (trackedVarName) => {
        if (!this._kinds) {
            // todo create function to get this variables by name
            return this.getDefaultDebugKind((<any>this)[trackedVarName]);
        }
        if (Array.isArray((<any>this)[trackedVarName])) {
            return (<any>this)[trackedVarName].map((_: any) => this._kinds.get(trackedVarName));
        }
        return this._kinds.get(trackedVarName);
    };

    public getDebugColor(trackedVarName: string): any {
        const varVal = (<any>this)[trackedVarName];
        if (!this._exportFunctions) {
            return this.getDefaultDebugColor(varVal);
        }
        if (varVal == null) {
            return this.getDefaultDebugColor(varVal);
        }
        if (Array.from(this._exportFunctions.keys()).indexOf(trackedVarName) != -1) {
            const firstArg = varVal;
            const restArgs = this._exportFunctions.get(trackedVarName)
                .params.map(x => (<any>this)[x]);
            const args = [firstArg, ...restArgs];
            const fn = this._exportFunctions.get(trackedVarName).fn;
            return fn(...args);
        } else {
            return this.getDefaultDebugColor(varVal);
        }
    }

    public getDebugData(): DebugData[] {
        return this._trackedVarsNames.map(name => {
            const value = (<any>this)[name];
            const isInScope = this.getDefaultDebugScope(value);
            const type = this.getDefaultDebugType(value);
            const kind = this.getDebugKind(name);

            let data: any;
            if (type == 'single') {
                const color = this.getDebugColor(name);
                data = {value, color, kind};
            } else if (type == 'array') {
                const color = this.getDebugColor(name);
                data = mergeArrays(['value', 'color', 'kind'], [value, color, kind]);
            }

            return {type, name, isInScope, data};
        });
    }
}

export interface CodeJsonElement {
    text: string;
    type: string;
    isTracked: boolean;
}

export type CodeJson = CodeJsonElement[][];

export abstract class AlgorithmBase {

    public abstract name: string;
    public abstract abbr: string;

    public states: AlgorithmState[] = [];

    public abstract code: string;
    public abstract trackedVariables: string[];

    public abstract evaluateStatesFor(graph: Graph, rootId: string): AlgorithmState[];

    public getCodeJson(): CodeJson {
        const tokens = Esprima.tokenize(this.code, {loc: true});
        const numberOfLines = this.code.split('\n').length;
        let codeJson: CodeJson = Array(numberOfLines).fill(null).map(_ => []);
        let previousLine = 0;
        let currentLine = 1;
        let currentColumn = 0;
        let token: any; // bad typings

        for (let i = 0; i < tokens.length; i++) {
            token = tokens[i];
            currentLine = (<any>token).loc.start.line - 1;

            if (currentLine != previousLine) {
                currentColumn = 0;
            }

            const whitespaceDiff: number = token.loc.start.column - currentColumn;
            currentColumn = token.loc.end.column;

            const isTracked: boolean = this.trackedVariables.indexOf(token.value) != -1;

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
            });
            previousLine = currentLine;
        }
        return codeJson;
    }

    // TODO This should be method in AlgorithmState class
    public normalize(state: AlgorithmState): NormalizedState {
        const nodeVars = state._trackedVarsNames
            .filter(varName => state._kinds.get(varName) == 'node');

        const nodes: GrfGraphNodeOptions[] = state.graphJson.nodes.map(node => {
            let color = GrfColor.DEFAULT;
            let role = GrfRole.DEFAULT;

            nodeVars.forEach((nodeVar: string) => {
                const varVal = (<any>state)[nodeVar];
                if (varVal != null) {
                    if (Array.isArray(varVal)) {
                        const index = varVal.indexOf(node.label);
                        if (index != -1) {
                            color = state.getDebugColor(nodeVar)[index];
                        }
                    } else {
                        if (varVal == node.label) {
                            color = state.getDebugColor(nodeVar);
                        }
                    }
                }
            });

            return {
                id: node.id,
                label: node.label,
                position: node.position,
                weight: node.weight,
                role,
                color,
                annotations: [],
            };
        });

        const edges: VisNgNetworkOptionsEdges[] = state.graphJson.edges;

        return {nodes, edges};
    }
}
