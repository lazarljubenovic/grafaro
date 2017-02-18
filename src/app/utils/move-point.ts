import {getCartesian} from './cartesian-polar-transforms';

function addPoints(x1: number, y1: number, x2: number, y2: number): {x: number, y: number} {
    const x = x1 + x2;
    const y = y1 + y2;
    return {x, y};
}

export function movePoint(x: number, y: number, r: number, phi: number): {x: number, y: number} {
    const {x: x1, y: y1} = getCartesian(r, phi);
    return addPoints(x, y, x1, y1);
}
