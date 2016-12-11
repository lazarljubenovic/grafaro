import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {JdenticonModule} from '../jdenticon/jdenticon.module';

@NgModule({
    imports: [
        CommonModule,
        JdenticonModule,
    ],
    declarations: [
        HeaderComponent,
    ],
    exports: [
        HeaderComponent,
    ],
})
export class UserInterfaceModule {
}
