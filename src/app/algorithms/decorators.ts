import {AlgorithmState} from './algorithm-base';
import {DebugDataValueKind} from './debug-data.interface';
import {GrfColor} from '../graph/graph.module';


export function TrackedVar(kind: DebugDataValueKind) {
    return function (target: AlgorithmState, key: string) {
        if (!target._kinds) {
            target._kinds = new Map<string, string>();
        }
        target._kinds.set(key, kind);
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

export interface AnnotationDecoratorNodeRule {
    position: {r: number, phi: number};
    style: string;
    font: string;
    ruleFunction: AnnotationDecoratorRuleFunction;
}

export interface AnnotationDecoratorEdgeRule {
    side: 'to' | 'from';
    style: string;
    font: string;
    ruleFunction: AnnotationDecoratorRuleFunction;
}

export interface AnnotationDecoratorParameter {
    nodes: AnnotationDecoratorNodeRule[];
    edges: AnnotationDecoratorEdgeRule[];
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
