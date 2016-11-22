import {Injectable} from '@angular/core';
import {Subject, Observable, Observer} from "rxjs/Rx";

@Injectable()
export class WebSocketService {
	private wsSubject: Subject<any>; //todo type

	public send(message: any) {
		this.wsSubject.next(message);
	}

	public create(url: string): Observable<any> {
		this.wsSubject = Observable.webSocket(url);

		return this.wsSubject;
	}

	constructor() {
	}

}
