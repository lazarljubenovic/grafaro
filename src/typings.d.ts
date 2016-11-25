// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;

declare module 'nested-property' {
    export let get: (object: any, path: string) => any;
    export let set: (object: any, path: string, value: any) => any;
    export let has: (object: any, path: string) => boolean;
}
