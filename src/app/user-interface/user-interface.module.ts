import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {JdenticonModule} from '../jdenticon/jdenticon.module';
import {DialogComponent} from './dialog/dialog.component';
import {FileListComponent} from './file-list/file-list.component';
import {FolderComponent} from './file-list/folder/folder.component';
import {FileComponent} from './file-list/file/file.component';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        JdenticonModule,
    ],
    declarations: [
        HeaderComponent,
        DialogComponent,
        FileListComponent,
        FolderComponent,
        FileComponent,
    ],
    exports: [
        HeaderComponent,
        DialogComponent,
        FileListComponent,
        FolderComponent,
        FileComponent,
    ],
})
export class UserInterfaceModule {
}
