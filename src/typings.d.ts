// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;

declare module 'nested-property' {
    export let get: (object: any, path: string) => any;
    export let set: (object: any, path: string, value: any) => any;
    export let has: (object: any, path: string) => boolean;
}

declare module 'sha1' {
    let sha1: (plaintext: string) => string;
    export = sha1;
}

declare module 'jdenticon' {
    export let update: (element: HTMLElement, hash: string, padding: number) => void;
}
