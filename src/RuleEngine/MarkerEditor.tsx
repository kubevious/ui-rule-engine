import React from 'react';
import { Editor } from './Editor';
import { ItemsList } from './ItemsList';
import { COLORS, SHAPES } from '../constants';
import { EditorItem, MarkerEditorState, SelectedItemData } from '../types';
import { ClassComponent } from '@kubevious/ui-framework';
import styles from './styles.scss';

import { IMarkerService } from '@kubevious/ui-middleware';
import { MarkerConfig, MarkerResultSubscriber } from '@kubevious/ui-middleware/dist/services/marker';

const selectedItemDataInit: SelectedItemData = {
    items: [],
    item_count: 0,
    logs: [],
};

export class MarkerEditor extends ClassComponent<{}, MarkerEditorState, IMarkerService> {

    private _markerResultSubscriber? : MarkerResultSubscriber;

    constructor(props: {} | Readonly<{}>) {
        super(props, null, { kind: 'marker' });
        this.state = {
            items: [],
            selectedItem: {},
            selectedItemData: selectedItemDataInit,
            selectedItemId: '',
            isSuccess: false,
            isNewItem: false,
        };

        this.openSummary = this.openSummary.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.createItem = this.createItem.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.createNewItem = this.createNewItem.bind(this);
    }

    componentDidMount(): void {
        this.service.subscribeMarkerStatuses((value) => {
            this.setState({
                items: value,
            });
        })

        this._markerResultSubscriber = 
            this.service.subscribeMarkerResult((value) => {
                if (!value) {
                    value = (selectedItemDataInit as any);
                }
                this.setState({
                    selectedItemData: value as any,
                });
            });
        this.subscribeToSharedState('marker_editor_selected_marker_id', (marker_editor_selected_marker_id) => {
            this._markerResultSubscriber!.update(marker_editor_selected_marker_id);
        });
    }

    selectItem(marker: EditorItem): void {
        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: marker.name || '',
        });
        marker.name &&
            this.service.getMarker(marker.name)
                .then((data) => {
                    if (data === null) {
                        this.openSummary();
                        return;
                    }
                    const { selectedItemId } = this.state;

                    if (data.name === selectedItemId) {
                        this.setState({
                            selectedItem: data,
                        });
                    }
                });

        this.sharedState.set('marker_editor_selected_marker_id', marker.name);
    }

    saveItem(data: EditorItem): void {
        const { selectedItemId } = this.state;

        this.service.createMarker(data as MarkerConfig, selectedItemId!)
            .then(() => {
                this.setState({ isSuccess: true });

                setTimeout(() => {
                    this.setState({ isSuccess: false });
                }, 2000);
            });
    }

    deleteItem(data: EditorItem): void {
        if (data.name) {
            this.service.deleteMarker(data.name)
                .then(() => {
                    this.setState({
                        selectedItem: {},
                        selectedItemId: '',
                    });
                    this.sharedState.set('marker_editor_selected_marker_id', null);
                });
        }
    }

    openSummary(): void {
        this.setState({ selectedItem: {}, selectedItemId: '' });
        this.sharedState.set('marker_editor_selected_marker_id', null);
    }

    createItem(data: EditorItem): void {
        this.service.createMarker(data as MarkerConfig, data.name || '')
            .then((marker) => {
                this.setState({ isSuccess: true });
                this.selectItem(marker);
            });
    }

    createNewItem(): void {
        this.sharedState.set('marker_editor_selected_marker_id', null);

        this.setState(() => ({
            isNewItem: true,
            selectedItem: {
                name: '',
                color: COLORS[0],
                shape: SHAPES[0],
                propagate: false,
            },
            isSuccess: false,
            selectedItemId: '',
            selectedItemData: selectedItemDataInit,
        }));
    }

    render() {
        const { items, isNewItem, selectedItem, selectedItemData, selectedItemId, isSuccess } = this.state;

        return (
            <div data-testid="marker-editor" className={`${styles.ruleEditorContainer} ${styles.markerEditorComponent}`} id="markerEditorComponent">
                <ItemsList
                    type="marker"
                    items={items}
                    selectedItemId={selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    markerService={this.service}
                />

                <Editor
                    type="marker"
                    items={items}
                    isNewItem={isNewItem}
                    selectedItem={selectedItem}
                    selectedItemData={selectedItemData}
                    selectedItemId={selectedItemId}
                    createNewItem={this.createNewItem}
                    saveItem={this.saveItem}
                    deleteItem={this.deleteItem}
                    createItem={this.createItem}
                    openSummary={this.openSummary}
                    isSuccess={isSuccess}
                />
            </div>
        );
    }
}
