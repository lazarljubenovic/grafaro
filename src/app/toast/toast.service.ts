import {
    Injectable,
    ComponentFactoryResolver,
    ViewContainerRef,
    Inject, ComponentRef
} from "@angular/core";
import {ReplaySubject, Subscription} from "rxjs";
import {ToastComponent} from "./toast.component";
import {Queue} from "../data-structures/queue";

@Injectable()
export class ToastService {

    public message$: ReplaySubject<string> = new ReplaySubject<string>(1);

    private _componentRefs = new Queue<{
        component: ComponentRef<ToastComponent>,
        subscription: Subscription,
    }>();

    public display(message: string, viewContainerRef: ViewContainerRef): void {
        const toastComponentFactory =
            this.componentFactoryResolver.resolveComponentFactory(ToastComponent);
        const toastComponentRef = viewContainerRef.createComponent(toastComponentFactory);
        toastComponentRef.instance.message$ = this.message$;
        this.message$.next(message);
        const subscription = this.message$.delay(5000).subscribe(() => {
            this.destroy();
        });
        this._componentRefs.enqueue({
            component: toastComponentRef,
            subscription,
        });
    }

    private destroy() {
        const item = this._componentRefs.deque();
        item.subscription.unsubscribe();
        item.component.destroy();
    }

    constructor(@Inject(ComponentFactoryResolver)
                public componentFactoryResolver: ComponentFactoryResolver) {
    }

}
