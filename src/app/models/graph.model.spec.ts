import {Graph} from './graph.model';


describe(`Graph`, () => {

    it(`should add node`, () => {
        const graph = new Graph();
        graph.addNode('A', {x: 10, y: 10});
        expect(graph.nodes).toEqual([
            {
                id: 'node-0',
                label: 'A',
                weight: 1,
                position: {
                    x: 10,
                    y: 10,
                },
            },
        ]);
    });

    it(`should add edge`, () => {
        const graph = new Graph();
        graph
            .addNode('A', {x: 10, y: 10})
            .addNode('B', {x: 20, y: 10})
            .addEdge('node-0', 'node-1', 'a');
        expect(graph.nodes).toEqual([
            {
                id: 'node-0',
                label: 'A',
                weight: 1,
                position: {
                    x: 10,
                    y: 10,
                },
            },
            {
                id: 'node-1',
                label: 'B',
                weight: 1,
                position: {
                    x: 20,
                    y: 10,
                },
            }
        ]);
        expect(graph.edges).toEqual([
            {
                from: 'node-0',
                to: 'node-1',
                label: 'a',
                weight: 1,
                id: 'edge-0',
            },
        ]);
    });

    it(`should check if node with given id exists`, () => {
        const graph = new Graph();
        graph.addNode('A', {x: 0, y: 0});
        expect(graph.hasNodeId('node-0')).toBe(true);
        expect(graph.hasNodeId('xxx')).toBe(false);
    });

    it(`should get node's label by its id`, () => {
        const graph = new Graph();
        graph.addNode('A', {x: 0, y: 0});
        expect(graph.getNodeLabel('node-0')).toBe('A');
        expect(() => graph.getNodeLabel('xxx')).toThrow();
    });

    it(`should get node's id by its label`, () => {
        const graph = new Graph();
        graph.addNode('A', {x: 0, y: 0});
        expect(graph.getNodeId('A')).toBe('node-0');
        expect(graph.getNodeId('xxx')).toBeFalsy();
    });

    it(`should change node's label`, () => {
        const graph = new Graph();
        graph.addNode('A', {x: 0, y: 0});
        expect(graph.getNodeId('A')).toBe('node-0');
        graph.changeNodeLabel('node-0', 'B');
        expect(graph.getNodeId('A')).toBeFalsy();
        expect(graph.hasNodeId('node-0')).toBe(true);
        expect(graph.getNodeLabel('node-0')).toBe('B');
        expect(graph.getNodeId('B')).toBe('node-0');
    });

    it(`should check if edge with given from-to ids exists`, () => {
        const graph = new Graph();
        graph.addNode('A', {x: 0, y: 0})
            .addNode('B', {x: 0, y: 0})
            .addEdge('node-0', 'node-1', 'a');
        expect(graph.hasEdge('node-0', 'node-1')).toBe(true);
        expect(graph.hasEdge('node-1', 'node-0')).toBe(false);
    });

    it(`should set a new node's unique id`, () => {
        const graph = new Graph();
        graph.addNode('a', {x: 0, y: 0});
        expect(graph.getNodeId('a')).toBe('node-0');
        graph.setNodeIdGeneratorId(10);
        graph.addNode('b', {x: 0, y: 0});
        expect(graph.getNodeId('a')).toBe('node-0');
        expect(graph.getNodeId('b')).toBe('node-10');
    });

    it(`should set a new edge's unique id`, () => {
        const graph = new Graph()
            .addNode('A', {x: 0, y: 0})
            .addNode('B', {x: 0, y: 0})
            .addNode('C', {x: 0, y: 0})
            .addNode('D', {x: 0, y: 0})
            .addEdge('node-0', 'node-1', 'a');
        expect(graph.getEdgeId('a')).toBe('edge-0');
        graph.setEdgeIdGeneratorId(3);
        graph.addEdge('node-2', 'node-3', 'b');
        expect(graph.getEdgeId('b')).toBe('edge-3');
    });

    const graph = new Graph();
    graph
        .addNode('A', {x: 0, y: 0}) // 0
        .addNode('B', {x: 0, y: 0}) // 1
        .addNode('C', {x: 0, y: 0}) // 2
        .addNode('D', {x: 0, y: 0}) // 3
        .addNode('E', {x: 0, y: 0}) // 4
        .addNode('F', {x: 0, y: 0}) // 5
        .addNode('G', {x: 0, y: 0}) // 6
        .addEdge('node-0', 'node-1', 'a', 100)
        .addEdge('node-0', 'node-3', 'b')
        .addEdge('node-4', 'node-0', 'c')
        .addEdge('node-4', 'node-1', 'i')
        .addUndirectedEdge('node-4', 'node-2', 'e')
        .addEdge('node-2', 'node-1', 'd')
        .addEdge('node-2', 'node-2', 'f')
        .addEdge('node-5', 'node-4', 'h')
        .addEdge('node-2', 'node-5', 'g');

    it(`should get sources`, () => {
        expect(graph.getSources('node-0').map(e => e.label).sort())
            .toEqual(['a', 'b'].sort());
        expect(graph.getSources('node-1').map(e => e.label).sort())
            .toEqual([].sort());
        expect(graph.getSources('node-2').map(e => e.label).sort())
            .toEqual(['e', 'd', 'g', 'f'].sort());
        expect(graph.getSources('node-3').map(e => e.label).sort())
            .toEqual([].sort());
        expect(graph.getSources('node-4').map(e => e.label).sort())
            .toEqual(['e', 'c', 'i'].sort());
        expect(graph.getSources('node-5').map(e => e.label).sort())
            .toEqual(['h'].sort());
        expect(graph.getSources('node-6').map(e => e.label).sort())
            .toEqual([].sort());
    });

    it(`should get sinks`, () => {
        expect(graph.getSinks('node-0').map(e => e.label).sort())
            .toEqual(['c'].sort());
        expect(graph.getSinks('node-1').map(e => e.label).sort())
            .toEqual(['a', 'i', 'd'].sort());
        expect(graph.getSinks('node-2').map(e => e.label).sort())
            .toEqual(['f', 'e'].sort());
        expect(graph.getSinks('node-3').map(e => e.label).sort())
            .toEqual(['b'].sort());
        expect(graph.getSinks('node-4').map(e => e.label).sort())
            .toEqual(['e', 'h'].sort());
        expect(graph.getSinks('node-5').map(e => e.label).sort())
            .toEqual(['g'].sort());
        expect(graph.getSinks('node-6').map(e => e.label).sort())
            .toEqual([].sort());
    });

    it(`should get matrix`, () => {
        expect(graph.getMatrix()).toEqual([
            [null, 100, null, 1, null, null, null],
            [null, null, null, null, null, null, null],
            [null, 1, 1, null, 1, 1, null],
            [null, null, null, null, null, null, null],
            [1, 1, 1, null, null, null, null],
            [null, null, null, null, 1, null, null],
            [null, null, null, null, null, null, null],
        ]);
    });


    it(`should remove a node and all its associated edges`, () => {
        graph.removeNode('node-5');
        expect(graph.hasNodeId('node-5')).toBe(false);
        expect(() => graph.getNodeLabel('node-5')).toThrow();
        expect(graph.getSources('node-2').map(e => e.label).sort())
            .toEqual(['d', 'f', 'e'].sort());
        expect(graph.getSinks('node-4').map(e => e.label).sort())
            .toEqual(['e'].sort());
    });

    it(`should remove a directed edge`, () => {
        graph.removeEdge('node-0', 'node-1');
        expect(graph.hasNodeId('node-0')).toBe(true);
        expect(graph.hasNodeId('node-1')).toBe(true);
        expect(graph.hasEdge('node-0', 'node-1')).toBe(false);
    });

});
