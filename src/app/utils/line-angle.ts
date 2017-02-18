function equal(a: number, b: number, eps: number = 1e-6): boolean {
    return Math.abs(a - b) < eps;
}

export function getLineAngle(x1: number, y1: number, x2: number, y2: number): number {
    if (equal(x1, x2)) {
        return Math.PI / 2;
    }
    return Math.atan2(y2 - y1, x2 - x1);
}
