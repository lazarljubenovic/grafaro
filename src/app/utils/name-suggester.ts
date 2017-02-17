/**
 * Tries to smartly suggest a local continuation of a given array of strings
 */
export function suggestNextName(arr: string[]): string {
    arr.sort();
    const last: string = arr[arr.length - 1];
    if (!Number.isNaN(Number.parseInt(last))) {
        return last + 1;
    } else {
        const lastCharCode: number = last.slice(-1).charCodeAt(0);
        const newLastChar: string = String.fromCharCode(lastCharCode + 1);
        return last.slice(0, -1).concat(newLastChar);
    }
}
