import {
    Injectable,
    ApplicationRef,
    ComponentFactory,
    ComponentFactoryResolver,
    Injector,
    ComponentRef
} from '@angular/core';
import {PopupRenameComponent} from './popup-rename.component';

@Injectable()
export class PopupRenameService {

    public popupRenameComponentFactory: ComponentFactory<PopupRenameComponent>;

    private popupRenameComponent: ComponentRef<PopupRenameComponent>;

    public constructor(private applicationRef: ApplicationRef,
                       componentFactoryResolver: ComponentFactoryResolver,
                       private _injector: Injector) {
        this.popupRenameComponentFactory =
            componentFactoryResolver.resolveComponentFactory(PopupRenameComponent);
    }

    public prompt(x: number, y: number, direction: string,
                  previousLabel: string, isNode: boolean = true) {
        this.popupRenameComponent = this.popupRenameComponentFactory.create(this._injector);

        this.popupRenameComponent.instance.x = x;
        this.popupRenameComponent.instance.y = y;
        this.popupRenameComponent.instance.direction = direction;
        this.popupRenameComponent.instance.previousValue = previousLabel;
        // this.popupRenameComponent.changeDetectorRef.detectChanges();

        document.body.appendChild(this.popupRenameComponent.location.nativeElement);
        this.applicationRef.attachView(this.popupRenameComponent.hostView);

        return new Promise<string>((resolve, reject) => {
            this.popupRenameComponent.instance.name
                .take(1)
                .subscribe(resolve);
        }).then((newLabel) => {
            this.destroy();
            return newLabel;
        });
    }

    private destroy() {
        this.applicationRef.detachView(this.popupRenameComponent.hostView);
        this.popupRenameComponent.destroy();
    }

}
