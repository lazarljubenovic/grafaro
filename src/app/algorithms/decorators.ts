import {AlgorithmState} from './algorithm-base';
import {DebugDataValueKind} from './debug-data.interface';


export function TrackedVar() {
    return function (target: AlgorithmState, key: string) {
        if (!target._trackedVarsNames) {
            target._trackedVarsNames = [];
        }
        target._trackedVarsNames.push(key);
    };
}

export function Color(params: string[], fn: Function) {
    return function (target: AlgorithmState, key: string) {
        if (!target._exportFunctions) {
            target._exportFunctions = new Map();
        }
        target._exportFunctions.set(key, {params, fn});
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
