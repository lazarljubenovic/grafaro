/**
 * Tries to smartly suggest a local continuation of a given array of strings
 */
export function suggestNextName(arr: string[]): string {
    arr.sort();
    if (arr.length == 0) {
        return 'A';
    }
    const last: string = arr[arr.length - 1];
    if (!Number.isNaN(Number.parseInt(last))) {
        return (Number.parseInt(last) + 1).toString();
    } else {
        const lastChar: string = last.slice(-1);
        if (lastChar == 'z' || lastChar == 'Z') {
            return last + '1';
        } else {
            const lastCharCode: number = lastChar.charCodeAt(0);
            const newLastChar: string = String.fromCharCode(lastCharCode + 1);
            return last.slice(0, -1).concat(newLastChar);
        }
    }
}
