import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {AlgorithmService} from '../../algorithms/algorithm.service';
import {BreadthFirstSearchAlgorithm} from '../../algorithms/breadth-first-search';
import {DepthFirstSearchAlgorithm} from '../../algorithms/depth-first-search';
import {DijkstraShortestPathAlgorithm} from '../../algorithms/dijkstra-shortest-path';

@Component({
    selector: 'grf-algorithm-picker',
    templateUrl: './algorithm-picker.component.html',
    styleUrls: ['./algorithm-picker.component.scss']
})
export class AlgorithmPickerComponent implements OnInit {

    public form: FormGroup = this.formBuilder.group({
        algorithm: '',
        options: this.formBuilder.group({
            root: 'A',
        }),
    });

    public nodes: string[] = [];

    constructor(private formBuilder: FormBuilder,
                private algorithmService: AlgorithmService) {
        this.algorithmService.algorithmStrategy$.subscribe(strategy => {
            if (this.form.value.algorithm != strategy.abbr) {
                this.form.patchValue({algorithm: strategy.abbr});
            }
        });
    }

    ngOnInit() {
        this.algorithmService.graph.nodeLabelChange$.subscribe(nodes => {
            this.nodes = nodes;
        });

        this.form.valueChanges.subscribe(form => {
            switch (form.algorithm) {
                case 'bfs':
                    this.algorithmService.setAlgorithm(new BreadthFirstSearchAlgorithm());
                    break;
                case 'dfs':
                    this.algorithmService.setAlgorithm(new DepthFirstSearchAlgorithm());
                    break;
                case 'dsp':
                    this.algorithmService.setAlgorithm(new DijkstraShortestPathAlgorithm());
                    break;
                default:
                    throw 'TODO';
            }
            this.algorithmService.rootId = this.algorithmService.graph.getNodeId(form.options.root);
        });
    }

}
