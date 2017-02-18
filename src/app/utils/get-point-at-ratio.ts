function getAtRatio(start: number, end: number, ratio: number): number {
    return start + (end - start) * ratio;
}

function algebraicDistance(x1: number, y1: number, x2: number, y2: number): number {
    if (y1 == y2) {
        return x2 - x1;
    }
    if (x1 == x2) {
        return y2 - y1;
    }
    return Math.hypot(x2 - x1, y2 - y1);
}

export function getPointAtRatio(x1: number, y1: number,
                                x2: number, y2: number,
                                ratio: number): {x: number, y: number, d1: number, d2: number} {
    const x = getAtRatio(x1, x2, ratio);
    const y = getAtRatio(y1, y2, ratio);
    const d1 = algebraicDistance(x1, y1, x, y);
    const d2 = algebraicDistance(x2, y2, x, y);
    return {x, y, d1, d2};
}
