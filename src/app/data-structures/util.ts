export function Min<K, V>(map: Map<K, V>, fn: (a: [K, V], b: [K, V]) => number) {
    return Array.from(map.entries()).sort(fn)[0];
}
