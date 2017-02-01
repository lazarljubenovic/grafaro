import {Injectable} from '@angular/core';
import {VisNgNetworkOptions} from '@lazarljubenovic/vis-ng/core';
import * as NestedProperty from 'nested-property';
import {Subject} from 'rxjs';

@Injectable()
export class GraphOptionsService {

    private _options: VisNgNetworkOptions = {};

    public optionsChange$ = new Subject<VisNgNetworkOptions>();

    public get options(): VisNgNetworkOptions {
        return this._options;
    }

    public renewOptions(options: VisNgNetworkOptions): void {
        this._options = options;
    }

    public setOptions(optionName: string, value: any): void;
    public setOptions(options: {name: string, value: any}[]): void;
    public setOptions(first: {name: string, value: any}[] | string, second?: any): void {
        if (typeof first === 'string') {
            // first = optionName, second = value
            NestedProperty.set(this._options, first, second);
        } else {
            // first = options
            first.forEach(option => NestedProperty.set(this._options, option.name, option.value));
        }
        this.optionsChange$.next(this._options);
    }

    public getOption(optionName: string): any {
        this.optionsChange$.next(this._options);
        return NestedProperty.get(this._options, optionName);
    }

    public hasOption(optionName: string): any {
        this.optionsChange$.next(this._options);
        return NestedProperty.has(this._options, optionName);
    }

    constructor() {
    }

}
