import {
    Component,
    OnInit,
    style,
    animate,
    transition,
    trigger,
    state
} from "@angular/core";
import {Observable} from "rxjs";

@Component({
    selector: 'grf-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    animations: [
        trigger('showHide', [
            state('*', style({
                transform: 'translateY(0)',
            })),
            state('void', style({
                transform: 'translateY(100%)',
            })),
            transition('void <=> *', animate('200ms ease')),
        ])
    ],
})
export class ToastComponent implements OnInit {

    public message$: Observable<string>;

    constructor() {
    }

    ngOnInit() {
    }

}
