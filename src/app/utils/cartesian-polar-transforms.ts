export function getPolar(x: number, y: number): {r: number, phi: number} {
    const r = Math.hypot(x, y);
    const phi = Math.atan2(y, x);
    return {r, phi};
}

export function getCartesian(r: number, phi: number): {x: number, y: number} {
    const x = r * Math.cos(phi);
    const y = r * Math.cos(phi);
    return {x, y};
}
