import {
    Component,
    Input,
    ViewChild,
    ElementRef,
    OnChanges,
    ChangeDetectionStrategy
} from '@angular/core';
import * as jdenticon from 'jdenticon';
import {Sha1Service} from './sha1.service';

@Component({
    selector: 'grf-jdenticon',
    templateUrl: './jdenticon.component.html',
    styleUrls: ['./jdenticon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JdenticonComponent implements OnChanges {

    @Input()
    public plaintext: string;

    @Input()
    public hash: string;

    @Input()
    public padding: number = .08;

    @ViewChild('svg')
    public elementRef: ElementRef;

    public update(): void {
        try {
            if (this.hash) {
                jdenticon.update(this.elementRef.nativeElement, this.hash, this.padding);
            } else {
                const hash: string = this.hashService.convert(this.plaintext);
                jdenticon.update(this.elementRef.nativeElement, hash, this.padding);
            }
        } catch (e) {
            // The only error which can happen here is that Jdenticon cannot draw given space
            // less than 30px.
        }
    }

    constructor(private hashService: Sha1Service) {
    }

    ngOnChanges() {
        this.update();
    }

}
