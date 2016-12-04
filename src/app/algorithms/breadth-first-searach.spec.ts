import {Graph} from 'graphlib';

describe(`Algorithm: Breadth-First Search`, () => {

    const graph = new Graph({directed: false});

    graph
        .setEdge('A', 'B')
        .setEdge('A', 'C')
        .setEdge('A', 'D')
        .setEdge('B', 'E')
        .setEdge('C', 'F')
        .setEdge('C', 'G')
        .setEdge('G', 'H')
        .setEdge('E', 'J')
        .setEdge('J', 'I')
        .setEdge('D', 'I');

    // TODO

});
