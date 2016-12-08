import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {StepperModule} from './shared/stepper/stepper.module';
import {BreadthFirstSearchService} from './breadth-first-search/breadth-first-search.service';
import {UserInterfaceModule} from './user-interface/user-interface.module';
import {MarkdownService} from './shared/markdown.service';
import {EmojiService} from './shared/emoji.service';
import {GraphOptionsService} from './graph-options.service';
import {ProjectBrowserModule} from './project-browser/project-browser.module';
import {RouterModule} from '@angular/router';
import {UserInterfaceComponent} from './user-interface/user-interface.component';
import {ProjectBrowserComponent} from './project-browser/project-browser.component';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        StepperModule,
        UserInterfaceModule,
        ProjectBrowserModule,
        RouterModule.forRoot([
            {
                path: '',
                component: ProjectBrowserComponent,
            },
            {
                path: 'project/:id',
                component: UserInterfaceComponent,
            },
        ]),
    ],
    providers: [
        BreadthFirstSearchService,
        MarkdownService,
        EmojiService,
        GraphOptionsService,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
