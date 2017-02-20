import {Injectable} from '@angular/core';
import {WebSocketService} from '../../../websocket.service';
import {FormOptions} from '../../algorithm-picker/algorithm-picker.component';
import {AlgorithmSocketInterface} from './algorithm-socket';


@Injectable()
export class AlgorithmSocketService extends AlgorithmSocketInterface {

    constructor(private _webSocketService: WebSocketService) {
        super();
        this._webSocketService.subscribeTo('algorithm')
            .subscribe(message => this.algorithmSocket$.next(message));
    }

    public send(algorithm: FormOptions) {
        this._webSocketService.send({info: algorithm}, 'algorithm');
    }

    public requestAlgorithmWithOptions(): void {
        this._webSocketService.send({}, 'algorithm-request');
    }
}
