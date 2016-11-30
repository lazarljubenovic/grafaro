import {
    Component,
    ContentChildren,
    AfterContentInit,
    QueryList,
    ViewChild,
    ElementRef,
    Renderer,
    Input
} from "@angular/core";
import {TabComponent} from "./tab/tab.component";

interface Tab {
    icon: string;
    title: string;
    index: number;
    ref: TabComponent;
}

@Component({
    selector: 'grf-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {

    @ContentChildren(TabComponent)
    public tabReferences: QueryList<TabComponent>;

    @ViewChild('tabOutlet')
    public tabOutletRef: ElementRef;

    @Input()
    public initialTabIndex: number = 0;

    public currentTab: Tab;

    public tabs: Tab[] = [];

    public setCurrentTab(tab: Tab) {
        this.currentTab = tab;
        this.updateView();
    }

    public updateView(): void {
        const nativeElements = this.tabReferences.map(el => el.elementRef.nativeElement);
        const currentStepNativeElement = nativeElements[this.currentTab.index];
        this.renderer.detachView(nativeElements);
        this.renderer.attachViewAfter(this.tabOutletRef.nativeElement, [currentStepNativeElement]);
    }

    constructor(private renderer: Renderer) {
    }

    ngAfterContentInit() {
        this.tabs = this.tabReferences.map((ref, index) => ({
            title: ref.title,
            icon: ref.icon,
            index: index,
            ref: ref,
        }));
        this.setCurrentTab(this.tabs[this.initialTabIndex]);
    }

}
