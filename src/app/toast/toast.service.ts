import {
    Injectable,
    ComponentFactoryResolver,
    ComponentRef,
    ComponentFactory,
    Injector,
    ApplicationRef
} from '@angular/core';
import {ReplaySubject, Subscription} from 'rxjs';
import {ToastComponent} from './toast.component';
import {Queue} from '../data-structures/queue';

@Injectable()
export class ToastService {

    private toastCmpFactory: ComponentFactory<ToastComponent>;

    public message$: ReplaySubject<string> = new ReplaySubject<string>(1);

    private _componentRefs = new Queue<{
        component: ComponentRef<ToastComponent>,
        subscription: Subscription,
    }>();

    public display(message: string): void {
        const toastCmp = this.toastCmpFactory.create(this.injector);

        toastCmp.instance.message$ = this.message$;
        this.message$.next(message);

        document.body.appendChild(toastCmp.location.nativeElement);
        this.applicationRef.attachView(toastCmp.hostView);

        const subscription = this.message$.delay(3200).subscribe(() => {
            this.destroy();
        });
        this._componentRefs.enqueue({
            component: toastCmp,
            subscription,
        });
    }

    private destroy() {
        const item = this._componentRefs.deque();
        item.subscription.unsubscribe();
        item.component.destroy();
    }

    constructor(private cfr: ComponentFactoryResolver,
                private injector: Injector,
                private applicationRef: ApplicationRef) {

        this.toastCmpFactory = this.cfr.resolveComponentFactory(ToastComponent);
    }

}
