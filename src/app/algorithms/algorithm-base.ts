import {NormalizedState} from './normalized-state.model';
import {Graph, GraphJson} from '../models/graph.model';
import * as Esprima from 'esprima';
import {GrfColor, GrfGraphNodeOptions, GrfRole, GrfGraphEdgeOptions} from '../graph/graph.module';
import {DebugData} from './debug-data.interface';
import {mergeArrays} from './utils';
import {
    ColorDecoratorParameter,
    ColorDecoratorFunction,
    AnnotationDecoratorParameter,
    AnnotationDecoratorRuleFunction
} from './decorators';


export interface AnnotationTextAndPosition {
    text: string;

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
    style: string;

    position: {
        r: number;
        phi: number; // in degrees
    };
}


export abstract class AlgorithmState {

    /** Filled with decorators. */
    public static _colorRules: ColorDecoratorParameter;

    /**
     * Filled with decorators.
     */
    public static _annotationRules: AnnotationDecoratorParameter;

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

    public getColorForNodeLabel(nodeLabel: string): GrfColor {
        const _colorRules = (this.constructor as any)._colorRules;
        if (_colorRules == null) {
            throw new Error(`Algorithm must have @Color decorator (even empty)`);
        }
        const colorRules: ColorDecoratorFunction[] = _colorRules.nodes;
        for (let colorRule of colorRules) {
            const color: GrfColor | null = colorRule(this, nodeLabel);
            if (color != null) {
                return color;
            }
        }
    }

    public getColorForEdgeLabel(edgeLabel: string): GrfColor {
        const colorRules: ColorDecoratorFunction[] = (this.constructor as any)._colorRules.edges;
        for (let colorRule of colorRules) {
            const color: GrfColor | null = colorRule(this, edgeLabel);
            if (color != null) {
                return color;
            }
        }
    }

    private getDefaultDebugScope: (trackedVar: any) => any = (trackedVar) => {
        return trackedVar !== undefined;
    };

    private getDefaultDebugType: (trackedVar: any) => any = (trackedVar) => {
        return Array.isArray(trackedVar) ? 'array' : 'single';
    };

    private getDefaultDebugKind: (trackedVar: any) => any = (trackedVar) => {
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

    private getDebugKind: (trackedVarName: any) => any = (trackedVarName) => {
        if (!this._kinds) {
            // todo create function to get this variables by name
            return this.getDefaultDebugKind((<any>this)[trackedVarName]);
        }
        if (Array.isArray((<any>this)[trackedVarName])) {
            return (<any>this)[trackedVarName].map((_: any) => this._kinds.get(trackedVarName));
        }
        return this._kinds.get(trackedVarName);
    };

    public getDebugData(): DebugData[] {
        return Array.from(this._kinds.keys()).map(name => {
            const value = (<any>this)[name];
            const isInScope = this.getDefaultDebugScope(value);
            const type = this.getDefaultDebugType(value);
            const kind = this.getDebugKind(name);

            let data: any;
            if (type == 'single') {
                const color = this.getColorForNodeLabel(value);
                data = {value, color, kind};
            } else if (type == 'array') {
                const color = value.map((v: string) => this.getColorForNodeLabel(v));
                data = mergeArrays(['value', 'color', 'kind'], [value, color, kind]);
            }

            return {type, name, isInScope, data};
        });
    }

    public getAnnotationsForNodeLabel(nodeLabel: string): AnnotationTextAndPosition[] {
        const _annotationRules: AnnotationDecoratorParameter =
            (this.constructor as any)._annotationRules;
        if (_annotationRules == null) {
            return [];
        }

        let annotationsTextsAndPositions: AnnotationTextAndPosition[] = [];
        _annotationRules.nodes.forEach(_annotationRule => {
            const annotationRuleFn: AnnotationDecoratorRuleFunction = _annotationRule.ruleFunction;
            const text = annotationRuleFn(this, nodeLabel);
            annotationsTextsAndPositions.push({
                position: _annotationRule.position,
                text,
                style: _annotationRule.style,
            });
        });
        return annotationsTextsAndPositions;
    }

    public getAnnotationsForEdgeLabel(edgeLabel: string): AnnotationTextAndPosition[] {
        const _annotationRules: AnnotationDecoratorParameter =
            (this.constructor as any)._annotationRules;
        if (_annotationRules == null) {
            return [];
        }

        let annotationsTextsAndPositions: AnnotationTextAndPosition[] = [];
        _annotationRules.edges.forEach(_annotationRule => {
            const annotationRuleFn: AnnotationDecoratorRuleFunction = _annotationRule.ruleFunction;
            const text = annotationRuleFn(this, edgeLabel);
            annotationsTextsAndPositions.push({
                position: _annotationRule.position,
                text,
                style: _annotationRule.style,
            });
        });
        return annotationsTextsAndPositions;
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
        const nodes: GrfGraphNodeOptions[] = state.graphJson.nodes.map(node => {
            const color: GrfColor = state.getColorForNodeLabel(node.label);
            const role: GrfRole = GrfRole.DEFAULT;
            const annotations: AnnotationTextAndPosition[] =
                state.getAnnotationsForNodeLabel(node.label);

            return {
                id: node.id,
                label: node.label,
                position: node.position,
                weight: node.weight,
                role,
                color,
                annotations,
            };
        });

        const edges: GrfGraphEdgeOptions[] = state.graphJson.edges.map(edge => {
            const annotations: AnnotationTextAndPosition[] =
                state.getAnnotationsForEdgeLabel(edge.label);

            return {
                id: edge.id,
                from: edge.from,
                to: edge.to,
                label: edge.label,
                weight: edge.weight,
                annotations,
            };
        });

        return {nodes, edges};
    }
}
