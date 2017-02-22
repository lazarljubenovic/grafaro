import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Graph, GraphJson, GraphEdge} from '../models/graph.model';
import {ClickPosition} from '../room-view/toolbar/toolbar.component';
import {ToolbarService} from '../room-view/toolbar/toolbar.service';
import {suggestNextName} from '../utils/name-suggester';
import {PopupRenameService} from '../room-view/popup-rename/popup-rename.service';
import {ToastService} from '../toast/toast.service';
import {MasterStorageService} from '../shared/master-service/master-storage.service';

@Injectable()
export class GraphManager {

    private _graph: Graph = new Graph();

    public graph$: BehaviorSubject<Graph>;

    private isMaster: boolean;

    constructor(private _toolbarService: ToolbarService,
                private popup: PopupRenameService,
                private toast: ToastService,
                private masterStorageService: MasterStorageService) {
        this.graph$ = new BehaviorSubject(this._graph);

        masterStorageService.masterMessages$.subscribe(message => {
            this.isMaster = message.isMaster;
        });

        _toolbarService.addNode$.subscribe(action => {
            if (this.isMaster) {
                this.addNode(action.position);
            } else {
                this.toast.display(`Only Master can add a node.`);
            }
        });

        _toolbarService.removeNode$.subscribe(action => {
            if (this.isMaster) {
                this.removeNode(action);
            } else {
                this.toast.display(`Only Master can remove a node.`);
            }
        });

        _toolbarService.linkNodes$.subscribe(x => {
            if (this.isMaster) {
                this.linkNodes(x[0], x[1]);
            } else {
                this.toast.display(`Only Master can link nodes.`);
            }
        });

        _toolbarService.renameNode$.subscribe(action => {
            if (!this.isMaster) {
               this.toast.display(`Only Master can rename a node.`);
               return;
            }

            const id: string = action.node;
            const oldLabel: string = this.getNodeLabel(id);

            const {left, top} = document.querySelector('vis-network').getBoundingClientRect();
            const x = left + action.position.x;
            const y = top + action.position.y;
            const direction = 'up';

            this.popup.prompt(x, y, direction, oldLabel, 'Rename', 'node')
                .then(newLabel => {
                    try {
                        this.renameNode(oldLabel, newLabel);
                    } catch (e) {
                        this.toast.display(`Rename unsuccessful. ${e}`);
                    }
                });
        });

        _toolbarService.renameEdge$.subscribe(action => {
            if (!this.isMaster) {
                this.toast.display(`Only Master can rename an edge`);
                return;
            }

            const id: string = action.edge;
            const oldLabel: string = this.getEdgeLabel(id);

            const {left, top} = document.querySelector('vis-network').getBoundingClientRect();
            const x = left + action.position.x;
            const y = top + action.position.y;
            const direction = 'up';

            this.popup.prompt(x, y, direction, oldLabel, 'Rename', 'edge')
                .then(newLabel => {
                    try {
                        this.renameEdge(oldLabel, newLabel);
                    } catch (e) {
                        this.toast.display(`Rename unsuccessful. ${e}`);
                    }
                });
        });

        _toolbarService.changeWeightNode$.subscribe(action => {
            if (!this.isMaster) {
                this.toast.display(`Only Master can change node weight`);
                return;
            }

            const label = this.getNodeLabel(action.node);

            const {left, top} = document.querySelector('vis-network').getBoundingClientRect();
            const x = left + action.position.x;
            const y = top + action.position.y;
            const direction = 'up';

            this.popup.prompt(x, y, direction, label, `New weight for`, `node`)
                .then(newWeightString => {
                    let newWeight: number;
                    newWeight = parseInt(newWeightString, 10);
                    if (Number.isNaN(newWeight)) {
                        this.toast.display(`Rename unsuccessful. Weight has to be a number.`);
                        return;
                    }
                    try {
                        this.changeNodeWeight(action.node, newWeight);
                    } catch (e) {
                        this.toast.display(`Weight change unsuccessful. ${e}`);
                    }
                });
        });

        _toolbarService.changeWeightEdge$.subscribe(action => {
            if (!this.isMaster) {
                this.toast.display(`Only Master can change edge weight`);
                return;
            }

            const label = this.getEdgeLabel(action.edge);

            const {left, top} = document.querySelector('vis-network').getBoundingClientRect();
            const x = left + action.position.x;
            const y = top + action.position.y;
            const direction = 'up';

            this.popup.prompt(x, y, direction, label, `New weight for`, `edge`)
                .then(newWeightString => {
                    let newWeight: number;
                    newWeight = parseInt(newWeightString, 10);
                    if (Number.isNaN(newWeight)) {
                        this.toast.display(`Rename unsuccessful. Weight has to be a number.`);
                        return;
                    }
                    try {
                        this.changeEdgeWeight(action.edge, newWeight);
                    } catch (e) {
                        this.toast.display(`Weight change unsuccessful. ${e}`);
                    }
                });
        });

        _toolbarService.removeEdge$.subscribe(x => {
            if (!this.isMaster) {
                this.toast.display(`Only Master can remove an edge`);
                return;
            }
            this.removeEdge(x);
        });

        _toolbarService.moveNode$.subscribe(x => {
            if (!this.isMaster) {
                this.toast.display(`Only Master can move a node.`);
                return;
            }
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

    public getEdgeByNodes(from: string, to: string): GraphEdge {
        return this._graph.getEdgeByNodes(from, to);
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

    public linkNodes(nodeA: string, nodeB: string, weight: number = 1) {
        try {
            this._graph.addEdge(nodeA, nodeB, this.suggestNewEdgeName(), weight);
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
