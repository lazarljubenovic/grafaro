import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {StepperModule} from './shared/stepper/stepper.module';
import {AlgorithmService} from './algorithms/algorithm.service';
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
import {Auth0Service} from './auth0.service';
import {AUTH_PROVIDERS} from 'angular2-jwt';
import {LoginPageModule} from './login-page/login-page.module';
import {LoginPageComponent} from './login-page/login-page.component';

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
        LoginPageModule,
        RouterModule.forRoot([
            {
                path: '',
                component: ProjectBrowserComponent,
            },
            {
                path: 'login',
                component: LoginPageComponent,
            },
            {
                path: 'room/:id',
                component: ProjectViewComponent,
            },
            {
                path: '**',
                component: FourOhFourComponent,
            },
        ]),
    ],
    providers: [
        AlgorithmService,
        MarkdownService,
        EmojiService,
        GraphOptionsService,
        Auth0Service,
        AUTH_PROVIDERS,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
