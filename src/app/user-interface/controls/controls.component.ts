import {Component, OnInit, EventEmitter, Output} from "@angular/core";

@Component({
    selector: 'grf-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

    @Output()
    public stateNumberChange = new EventEmitter<string>();

    public onNext(): void {
        this.stateNumberChange.emit('next');
    }

    public onPrev(): void {
        this.stateNumberChange.emit('prev');
    }

    constructor() {
    }

    ngOnInit() {
    }

}
