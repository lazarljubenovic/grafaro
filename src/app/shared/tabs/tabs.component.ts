import {
    Component,
    ContentChildren,
    AfterContentInit,
    QueryList,
    ViewChild,
    ElementRef,
    Renderer,
    Input
} from '@angular/core';
import {TabComponent} from './tab/tab.component';
import {TabsService} from './tabs.service';

interface Tab {
    icon: string;
    title: string;
    index: number;
    ref: TabComponent;
}

@Component({
    selector: 'grf-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
    providers: [TabsService],
})
export class TabsComponent implements AfterContentInit {

    @ContentChildren(TabComponent)
    public tabReferences: QueryList<TabComponent>;

    @ViewChild('tabOutlet')
    public tabOutletRef: ElementRef;

    @Input()
    public initialTabIndex: number = 2;

    public currentTabIndex: number;

    public tabs: Tab[] = [];

    public setCurrentTabIndex(tabIndex: number) {
        this.tabsService.tabChange.next(tabIndex);
        this.currentTabIndex = tabIndex;
        this.updateView();
    }

    public updateView(): void {
        const nativeElements = this.tabReferences.map(el => el.elementRef.nativeElement);
        const currentStepNativeElement = nativeElements[this.currentTabIndex];
        this.renderer.detachView(nativeElements);
        this.renderer.attachViewAfter(this.tabOutletRef.nativeElement, [currentStepNativeElement]);
    }

    constructor(private renderer: Renderer,
                private tabsService: TabsService) {
    }

    ngAfterContentInit() {
        this.tabs = this.tabReferences.map((ref, index) => ({
            title: ref.tabTitle,
            icon: ref.icon,
            index: index,
            ref: ref,
        }));
        this.setCurrentTabIndex(this.initialTabIndex);
    }

}
