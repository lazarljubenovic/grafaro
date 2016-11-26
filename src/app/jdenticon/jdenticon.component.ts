import {
    Component,
    OnInit,
    Input,
    ViewChild,
    ElementRef,
    OnChanges,
    ChangeDetectionStrategy
} from "@angular/core";
import * as jdenticon from "jdenticon";
import {Sha1Service} from "./sha1.service";

@Component({
    selector: 'grf-jdenticon',
    templateUrl: './jdenticon.component.html',
    styleUrls: ['./jdenticon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JdenticonComponent implements OnInit, OnChanges {

    @Input()
    public plaintext: string;

    @Input()
    public hash: string;

    @Input()
    public padding: number = .08;

    @ViewChild('svg')
    public elementRef: ElementRef;

    constructor(private hashService: Sha1Service) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.hash) {
            jdenticon.update(this.elementRef.nativeElement, this.hash, this.padding);
        } else {
            const hash: string = this.hashService.convert(this.plaintext);
            jdenticon.update(this.elementRef.nativeElement, hash, this.padding);
        }
    }

}
