import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Graph, GraphJson} from '../models/graph.model';
import {ClickPosition} from '../project-view/toolbar/toolbar.component';
import {ToolbarService} from '../project-view/toolbar/toolbar.service';
import {suggestNextName} from '../utils/name-suggester';

@Injectable()
export class GraphManager {

    private _graph: Graph = new Graph();

    public graph$: BehaviorSubject<Graph>;

    constructor(private _toolbarService: ToolbarService) {
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
            const newLabel = prompt(`New label for node ${oldLabel}?`);
            // popupRenameComponent.instance.name.subscribe(newLabel => {
            try {
                this.renameNode(oldLabel, newLabel);
            } catch (e) {
                alert(`Rename unsuccessful. ${e}`);
                // this.toastService.display(`Rename unsuccessful. ${e}`, this.toastOutlet);
            }
            // popupRenameComponent.destroy();
        });

        _toolbarService.changeWeightNode$.subscribe(x => {
            const label = this.getNodeLabel(x.node);
            const newWeightString: string = prompt(`New weight for node ${label}?`);
            let newWeight: number;
            try {
                newWeight = parseInt(newWeightString, 10);
            } catch (e) {
                alert(`Rename unsuccessful. Weight has to be a number.`);
            }
            try {
                this.changeNodeWeight(x.node, newWeight);
            } catch (e) {
                alert(`Rename unsuccessful. ${e}`);
            }
        });

        _toolbarService.renameEdge$.subscribe(x => {
            const id: string = x.edge;
            const oldLabel: string = this.getEdgeLabel(id);
            const newLabel = prompt(`New label for edge ${oldLabel}?`);
            try {
                this.renameEdge(oldLabel, newLabel);
            } catch (e) {
                alert(`Rename unsuccessful. ${e}`);
            }
        });

        _toolbarService.changeWeightEdge$.subscribe(x => {
            const label = this.getEdgeLabel(x.edge);
            const newWeightString: string = prompt(`New weight for edge ${label}?`);
            let newWeight: number;
            try {
                newWeight = parseInt(newWeightString, 10);
            } catch (e) {
                alert(`Rename unsuccessful. Weight has to be a number.`);
            }
            try {
                this.changeEdgeWeight(x.edge, newWeight);
            } catch (e) {
                alert(`Rename unsuccessful. ${e}`);
            }
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

    public getEdgeId(edgeLabel: string): string {
        return this._graph.getEdgeId(edgeLabel);
    }

    public getNodeLabel(nodeId: string): string {
        return this._graph.getNodeLabel(nodeId);
    }

    public getEdgeLabel(edgeId: string): string {
        return this._graph.getEdgeLabel(edgeId);
    }

    private existsNodeWithLabel(nodeLabel: string): boolean {
        const nodeId: string = this._graph.getNodeId(nodeLabel);
        return this._graph.hasNodeId(nodeId);
    }

    private existsEdgeWithLabel(edgeLabel: string): boolean {
        const edgeId: string = this._graph.getEdgeId(edgeLabel);
        return this._graph.hasEdgeId(edgeId);
    }

    public suggestNewNodeName(): string {
        const labels: string[] = this._graph.nodes.map(node => node.label);
        return suggestNextName(labels);
    }

    public suggestNewEdgeName(): string {
        const labels: string[] = this._graph.edges.map(edge => edge.label);
        return suggestNextName(labels);
    }

    public addNode(position: ClickPosition): void {
        const label: string = this.suggestNewNodeName();
        this._graph.addNode(label, position);
        this.setPosition(label, position);
        this.emit();
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
        if (newNodeLabel == null || newNodeLabel === '' || newNodeLabel == oldNodeLabel) {
            return;
        }
        if (this.existsNodeWithLabel(newNodeLabel)) {
            throw new Error(`Node with label ${newNodeLabel} already exists.`);
        }
        const id: string = this.getNodeId(oldNodeLabel);
        this._graph.changeNodeLabel(id, newNodeLabel);
        this.emit();
    }

    public changeNodeWeight(nodeId: string, newWeight: number): void {
        if (newWeight == null) {
            return;
        }
        this._graph.changeNodeWeight(nodeId, newWeight);
        this.emit();
    }

    public renameEdge(oldEdgeLabel: string, newEdgeLabel: string): void {
        if (newEdgeLabel == null || newEdgeLabel === '' || newEdgeLabel == oldEdgeLabel) {
            return;
        }
        if (this.existsEdgeWithLabel(newEdgeLabel)) {
            throw new Error(`Edge with label ${newEdgeLabel} already exists.`);
        }
        const id: string = this.getEdgeId(oldEdgeLabel);
        this._graph.changeEdgeLabel(id, newEdgeLabel);
        this.emit();
    }

    public changeEdgeWeight(edgeId: string, newWeight: number): void {
        if (newWeight == null) {
            return;
        }
        this._graph.changeEdgeWeight(edgeId, newWeight);
        this.emit();
    }

    public linkNodes(nodeA: string, nodeB: string) {
        try {
            this._graph.addEdge(nodeA, nodeB, this.suggestNewEdgeName());
        } catch (e) {
            alert(e);
        }
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
    }

    public moveNode(nodeId: string, position: ClickPosition): void {
        this._graph.nodes.find(node => node.id == nodeId).position = position;
        this.emit();
    }

    public graphFromSocket(graphJson: GraphJson) {
        this._graph.readJson(graphJson);
        this.emit();
    }

}
