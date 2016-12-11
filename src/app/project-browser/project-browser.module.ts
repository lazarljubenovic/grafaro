import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectBrowserComponent} from './project-browser.component';
import {RouterModule} from '@angular/router';
import {UserInterfaceModule} from '../user-interface/user-interface.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        UserInterfaceModule,
    ],
    declarations: [
        ProjectBrowserComponent,
    ],
    exports: [
        ProjectBrowserComponent,
    ],
})
export class ProjectBrowserModule {
}
