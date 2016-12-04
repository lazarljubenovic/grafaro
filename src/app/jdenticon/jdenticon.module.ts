import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JdenticonComponent} from './jdenticon.component';
import {Sha1Service} from './sha1.service';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        JdenticonComponent,
    ],
    exports: [
        JdenticonComponent,
    ],
    providers: [
        Sha1Service,
    ],
})
export class JdenticonModule {
}
