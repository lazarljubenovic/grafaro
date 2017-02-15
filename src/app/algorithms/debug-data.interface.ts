export type DebugDataValueKind
    = 'node'
    | 'edge'
    | 'node-node'
    | 'node-edge'
    | 'node-number'
    | 'number';

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
