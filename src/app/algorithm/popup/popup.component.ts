import {
    Component,
    OnInit,
    animate,
    transition,
    style,
    state,
    trigger,
    HostBinding
} from "@angular/core";

@Component({
    selector: 'grf-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    animations: [
        trigger('component', [
            state('void', style({
                transform: 'translateY(-24px)',
                opacity: '0',
            })),
            state('visible', style({
                transform: 'translateY(0)',
                opacity: '1',
            })),
            transition('* <=> void', animate('240ms ease-out')),
        ])
    ]
})
export class PopupComponent implements OnInit {

    @HostBinding('@component') public componentAnimation = true;

    constructor() {
    }

    ngOnInit() {
    }

}
