/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing';
import {TabsComponent} from './tabs.component';
import {Renderer} from "@angular/core";

describe('Component: Tabs', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [Renderer]
		})
	});
	it('should create an instance', () => {
		let component = new TabsComponent(new Renderer);
		expect(component).toBeTruthy();
	});
});
