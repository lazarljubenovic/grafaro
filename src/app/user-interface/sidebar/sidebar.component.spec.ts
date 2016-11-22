/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import {WebSocketService} from "../../shared/websocket.service";

describe('Component: Sidebar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketService]
    })
  });


  it('should create an instance', () => {
    let component = new SidebarComponent(new WebSocketService);
    expect(component).toBeTruthy();
  });
});
