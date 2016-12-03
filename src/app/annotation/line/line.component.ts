import {
    Component,
    OnInit,
    Input,
    ChangeDetectionStrategy,
    OnChanges,
    HostBinding
} from "@angular/core";
import {GeometryService} from "../geometry.service";

interface EuclideanPoint {
    x: number;
    y: number;
}

interface EulerPoint {
    r: number;
    φ: number; // JavaScript I love you
}

@Component({
    selector: 'grf-line',
    template: ``,
    styleUrls: ['./line.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineComponent implements OnInit, OnChanges {

    @HostBinding('style.background-color')
    @Input() public color: string;

    @HostBinding('style.height.px')
    @Input() public width: number;

    @Input() public pointA: EuclideanPoint;
    @Input() public pointB: EuclideanPoint;

    private vector: EulerPoint;

    @HostBinding('style.left')
    public x: string;

    @HostBinding('style.top')
    public y: string;

    @HostBinding('style.width')
    public lineLength: string;

    @HostBinding('style.transform')
    public rotation: string;

    ngOnChanges() {
        this.calculateVector();
        this.calculateParameters();
    }

    private calculateVector(): void {
        const r = this.geometry.getDistanceBetween(this.pointA, this.pointB);
        const φ = this.geometry.getLineAngle(this.pointA, this.pointB);
        this.vector = {r, φ};
    }

    private calculateParameters(): void {
        this.x = `${this.pointA.x}px`;
        this.y = `${this.pointA.y}px`;
        this.lineLength = `${this.vector.r}px`;
        this.rotation = `rotate(${this.geometry.toDegrees(this.vector.φ)}deg)`;
    }

    constructor(private geometry: GeometryService) {
    }

    ngOnInit() {
    }

}
