import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'grf-algorithm',
    templateUrl: './algorithm.component.html',
    styleUrls: ['./algorithm.component.scss']
})
export class AlgorithmComponent implements OnInit {

    public code = `function FakeAlgorithm(graph, root) {
  let visited = new Set();
  let currentNode = root;
  if (visited.contains(root)) {
    visited.add(currentNode);
    const temp = nodes
      .filter(node => node.weight > 50)
      .filter(node => node.neighbors.length < 1);
    neighbors.push(temp);
  }
  return visited;
}`;

    constructor() {
    }

    ngOnInit() {
    }

}
