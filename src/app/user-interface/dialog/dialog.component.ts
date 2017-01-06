import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    HostListener
} from '@angular/core';

@Component({
    selector: 'grf-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

    @Output() public close = new EventEmitter<void>();

    @HostListener('click', ['$event'])
    public onClick(event: any): void {
        if (event.target.nodeName == 'GRF-DIALOG') {
            this.close.emit();
        }
    }

    constructor() {
    }

    ngOnInit() {
    }

}
