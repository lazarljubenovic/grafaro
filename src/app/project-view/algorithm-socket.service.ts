import {Injectable} from '@angular/core';
import {WebSocketService} from '../websocket.service';
import {FormOptions} from './algorithm-picker/algorithm-picker.component';
import {Observable} from 'rxjs';

export interface AlgorithmMessage {
    info: FormOptions;
}

@Injectable()
export class AlgorithmSocketService {
    public algorithmSocket$: Observable<AlgorithmMessage>;
    public canSend: boolean = false;

    constructor(private _webSocketService: WebSocketService) {
        this.algorithmSocket$ = this._webSocketService.subscribeTo('algorithm');
    }

    public send(algorithm: FormOptions) {
        if (this.canSend) {
            this._webSocketService.send({info: algorithm}, 'algorithm');
        }
    }
}
