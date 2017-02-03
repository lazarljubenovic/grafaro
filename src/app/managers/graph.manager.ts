import {Injectable} from '@angular/core';
import {ReplaySubject, BehaviorSubject} from 'rxjs';
import {Graph} from '../models/graph.model';
import {ClickPosition} from '../project-view/toolbar/toolbar.component';
import {ToolbarService} from '../project-view/toolbar/toolbar.service';
import {dummyGraph} from '../models/message-stream.mock.model';

@Injectable()
export class GraphManager {

    private _graph: Graph = new Graph();

    public graph$: BehaviorSubject<Graph>;

    constructor(private _toolbarService: ToolbarService) {
        this._graph.readJson(dummyGraph.graph);

        this.graph$ = new BehaviorSubject(this._graph);

        _toolbarService.addNode$.subscribe(x => {
            this.addNode(x.position);
        });

        _toolbarService.removeNode$.subscribe(x => {
            this.removeNode(x);
        });

        _toolbarService.linkNodes$.subscribe(x => {
            this.linkNodes(x[0], x[1]);
        });

        _toolbarService.renameNode$.subscribe(x => {
            const id: string = x.node;
            const oldLabel: string = this.getNodeLabel(id);
            // const popupRenameComponent =
            //     this.viewContainerRef.createComponent(this.popupRenameComponentFactory);
            // popupRenameComponent.instance.x = 80 + action.position.x;
            // popupRenameComponent.instance.y = 80 + action.position.y;
            // popupRenameComponent.instance.direction = 'up';
            // popupRenameComponent.instance.previousValue = oldLabel;
            // popupRenameComponent.changeDetectorRef.detectChanges();
            const newLabel = prompt(`New label for ${oldLabel}?`);
            // popupRenameComponent.instance.name.subscribe(newLabel => {
            try {
                this.renameNode(oldLabel, newLabel);
            } catch (e) {
                alert(`Rename unsuccessful. ${e}`);
                // this.toastService.display(`Rename unsuccessful. ${e}`, this.toastOutlet);
            }
            // popupRenameComponent.destroy();
        });

        _toolbarService.removeEdge$.subscribe(x => {
            this.removeEdge(x);
        });

        _toolbarService.moveNode$.subscribe(x => {
            this.moveNode(x.nodeId, x.position);
        });
    }

    public emit(): void {
        this.graph$.next(this._graph);
    }

    public getNodeId(nodeLabel: string): string {
        return this._graph.getNodeId(nodeLabel);
    }

    public getNodeLabel(nodeId: string): string {
        return this._graph.getNodeLabel(nodeId);
    }

    private existsNodeWithLabel(nodeLabel: string): boolean {
        const nodeId: string = this._graph.getNodeId(nodeLabel);
        return this._graph.hasNodeId(nodeId);
    }

    public suggestNewNodeName(): string {
        const labels: string[] = this._graph.nodes.map(node => node.label).sort();
        const lastLabel: string = labels[labels.length - 1];
        if (!Number.isNaN(Number.parseInt(lastLabel))) {
            return lastLabel + 1;
        } else {
            const lastCharCode: number = lastLabel.slice(-1).charCodeAt(0);
            const newLastChar: string = String.fromCharCode(lastCharCode + 1);
            return lastLabel.slice(0, -1).concat(newLastChar);
        }
    }

    public addNode(position: ClickPosition): void {
        const label: string = this.suggestNewNodeName();
        this._graph.addNode(label, position);
        this.emit();
        this.setPosition(label, position);
    }

    public addNodeOnRandomPlace(): void {
        const x: number = Math.random() * 100;
        const y: number = Math.random() * 100;

        this.addNode({x, y});
    }

    public removeNode(nodeId: string): void {
        this._graph.removeNode(nodeId);
        this.emit();
    }

    public renameNode(oldNodeLabel: string, newNodeLabel: string): void {
        if (newNodeLabel === '' || newNodeLabel == oldNodeLabel) {
            return;
        }
        if (this.existsNodeWithLabel(newNodeLabel)) {
            throw new Error(`Node with label ${newNodeLabel} already exists.`);
        }
        const id: string = this.getNodeId(oldNodeLabel);
        this._graph.changeNodeLabel(id, newNodeLabel);
        this.emit();
    }

    public linkNodes(nodeA: string, nodeB: string) {
        this._graph.addEdge(nodeA, nodeB, 'foobar');
        this.emit();
    }

    public linkNodesByLabel(labelA: string, labelB: string) {
        const nodeA: string = this.getNodeId(labelA);
        const nodeB: string = this.getNodeId(labelB);
        this.linkNodes(nodeA, nodeB);
    }

    public unlinkNodes(nodeA: string, nodeB: string) {
        (<any>this._graph).removeEdge(nodeA, nodeB);
        this.emit();
    }

    public unlinkNodesByLabel(labelA: string, labelB: string) {
        const nodeA: string = this.getNodeId(labelA);
        const nodeB: string = this.getNodeId(labelB);

        this.unlinkNodes(nodeA, nodeB);
    }

    public removeEdge(edgeId: string) {
        const edge = this._graph.getEdge(edgeId);
        this.unlinkNodes(edge.from, edge.to);
        this.emit();
    }

    public setPosition(nodeLabel: string, position: ClickPosition): void {
        this._graph.nodes.find(node => node.label == nodeLabel).position = position;
        this.emit();
    }

    public moveNode(nodeId: string, position: ClickPosition): void {
        this._graph.nodes.find(node => node.id == nodeId).position = position;
        this.emit();
    }

}
