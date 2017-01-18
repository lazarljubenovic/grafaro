import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {AlgorithmService} from '../../algorithms/algorithm.service';
import {BreadthFirstSearchAlgorithm} from '../../algorithms/breadth-first-search';
import {DepthFirstSearchAlgorithm} from '../../algorithms/depth-first-search';

@Component({
    selector: 'grf-algorithm-picker',
    templateUrl: './algorithm-picker.component.html',
    styleUrls: ['./algorithm-picker.component.scss']
})
export class AlgorithmPickerComponent implements OnInit {

    public form: FormGroup = this.fb.group({
        algorithm: 'dfs',
    });

    constructor(private fb: FormBuilder,
                private algorithmService: AlgorithmService
    ) {
    }

    ngOnInit() {
        this.form.valueChanges.subscribe(form => {
            switch (form.algorithm) {
                case 'bfs':
                    this.algorithmService.setAlgorithm(new BreadthFirstSearchAlgorithm());
                    break;
                case 'dfs':
                    this.algorithmService.setAlgorithm(new DepthFirstSearchAlgorithm());
                    break;
                default:
                    throw 'TODO';
            }
        });
    }

}
