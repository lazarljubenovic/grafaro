import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {StepperModule} from './shared/stepper/stepper.module';
import {BreadthFirstSearchService} from './breadth-first-search/breadth-first-search.service';
import {ProjectViewModel} from './project-view/project-view.module';
import {MarkdownService} from './shared/markdown.service';
import {EmojiService} from './shared/emoji.service';
import {GraphOptionsService} from './graph-options.service';
import {ProjectBrowserModule} from './project-browser/project-browser.module';
import {RouterModule} from '@angular/router';
import {ProjectViewComponent} from './project-view/project-view.component';
import {ProjectBrowserComponent} from './project-browser/project-browser.component';
import {FourOhFourModule} from './four-oh-four/four-oh-four.module';
import {FourOhFourComponent} from './four-oh-four/four-oh-four.component';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        StepperModule,
        ProjectViewModel,
        ProjectBrowserModule,
        FourOhFourModule,
        RouterModule.forRoot([
            {
                path: '',
                component: ProjectBrowserComponent,
            },
            {
                path: 'project/:id',
                component: ProjectViewComponent,
            },
            {
                path: '**',
                component: FourOhFourComponent,
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
