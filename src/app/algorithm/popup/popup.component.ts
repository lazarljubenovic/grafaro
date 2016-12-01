import {
    Component,
    OnInit,
    animate,
    transition,
    style,
    state,
    trigger,
    HostBinding,
    Input
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

    @Input() public set position(position: {x: number, y: number}) {
        this.x = position.x + 'px';
        this.y = position.y + 'px';
    }

    @HostBinding('style.left') public x: string = '0px';
    @HostBinding('style.top') public y: string = '0px';

    @Input() public name: string = 'Popup name';

    constructor() {
    }

    ngOnInit() {
    }

}
