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
        target._colorRules = param;
    };
}

export function Kind(kind: DebugDataValueKind) {
    return function (target: AlgorithmState, key: string) {
        if (!target._kinds) {
            target._kinds = new Map<string, string>();
        }
        target._kinds.set(key, kind);
    };
}
