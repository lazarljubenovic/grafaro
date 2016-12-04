import {
    Component,
    OnInit,
    style,
    animate,
    transition,
    trigger,
    state,
    HostBinding
} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
    selector: 'grf-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    animations: [
        trigger('showHide', [
            state('*', style({
                transform: 'translateY(0)',
                opacity: '1',
            })),
            state('void', style({
                transform: 'translateY(300%)',
                opacity: '0',
            })),
            transition('void <=> *', animate('400ms ease')),
        ])
    ],
})
export class ToastComponent implements OnInit {

    @HostBinding('@showHide')
    public showHide: boolean = true;

    public message$: Observable<string>;

    constructor() {
    }

    ngOnInit() {
    }

}
