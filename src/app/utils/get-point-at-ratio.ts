function getAtRatio(start: number, end: number, ratio: number): number {
    return start + (end - start) * ratio;
}

export function getPointAtRatio(x1: number, y1: number,
                                x2: number, y2: number,
                                ratio: number): {x: number, y: number} {
    return {
        x: getAtRatio(x1, x2, ratio),
        y: getAtRatio(y1, y2, ratio),
    };
}
