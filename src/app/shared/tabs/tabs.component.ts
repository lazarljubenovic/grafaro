import {
    Component, OnInit, ContentChildren, AfterContentInit, QueryList, ViewChild,
    ElementRef, Renderer
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
export class TabsComponent implements OnInit, AfterContentInit {

    @ContentChildren(TabComponent)
    public tabReferences: QueryList<TabComponent>;

    @ViewChild('tabOutlet')
    public tabOutletRef: ElementRef;

    public currentTab: Tab;

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

    public tabs: Tab[] = [];

    constructor(private renderer: Renderer) {
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        this.tabs = this.tabReferences.map((ref, index) => ({
            title: ref.title,
            icon: ref.icon,
            index: index,
            ref: ref,
        }));
        this.setCurrentTab(this.tabs[0]);
    }

}
