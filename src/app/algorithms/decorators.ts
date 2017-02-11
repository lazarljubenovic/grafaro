import {AlgorithmState} from './algorithm-base';
import {DebugDataValueKind} from './debug-data.interface';
import {GrfColor} from '../graph/graph.module';


export function TrackedVar() {
    return function (target: AlgorithmState, key: string) {
        if (!target._trackedVarsNames) {
            target._trackedVarsNames = [];
        }
        target._trackedVarsNames.push(key);
    };
}


export type ColorDecoratorFunction = (state: AlgorithmState, label: string) => (GrfColor | null);

export interface ColorDecoratorParameter {
    nodes: ColorDecoratorFunction[];
    edges: ColorDecoratorFunction[];
}

export function Color(param: ColorDecoratorParameter) {
    return function (target: any) {
        param.nodes.push((state: AlgorithmState, nodeLabel: string) => GrfColor.DEFAULT);
        param.edges.push((state: AlgorithmState, edgeLabel: string) => GrfColor.DEFAULT);
        target._colorRules = param;
    };
}


export type AnnotationDecoratorRuleFunction  = (state: AlgorithmState, label: string) => string;

export interface AnnotationDecoratorRule {
    position: {r: number, phi: number};
    style: string;
    ruleFunction: AnnotationDecoratorRuleFunction;
}

export interface AnnotationDecoratorParameter {
    nodes: AnnotationDecoratorRule[];
    edges: AnnotationDecoratorRule[];
}

export function Annotations(param: AnnotationDecoratorParameter) {
    return function (target: any) {
        target._annotationRules = param;
    };
}

export const NodeWeightAnnotationFunction: AnnotationDecoratorRuleFunction =
    (state: AlgorithmState, nodeLabel: string) => {
        return state.graphJson.nodes.find(node => node.label == nodeLabel).weight.toString();
    };

export const EdgeWeightAnnotationFunction: AnnotationDecoratorRuleFunction =
    (state: AlgorithmState, edgeLabel: string) => {
        return state.graphJson.edges.find(edge => edge.label == edgeLabel).weight.toString();
    };


export function Kind(kind: DebugDataValueKind) {
    return function (target: AlgorithmState, key: string) {
        if (!target._kinds) {
            target._kinds = new Map<string, string>();
        }
        target._kinds.set(key, kind);
    };
}
