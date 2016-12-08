import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectBrowserComponent} from './project-browser.component';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
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
