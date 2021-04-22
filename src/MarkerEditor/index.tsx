import { faFileDownload, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { BurgerMenuItem } from '@kubevious/ui-components/dist/BurgerMenu/types';
import React from 'react';
import { AffectedObjects } from '../components/AffectedObjects';
import { MarkerMainTab } from '../components/MarkerMainTab';
import { Sider } from '../components/Sider';
import { Tabs } from '../components/Tabs';
import { Tab } from '../components/Tabs/Tab';
import { COLORS, SHAPES } from '../constants';
import { StartPage } from '../StartPage';
import { EditorItem, MarkerEditorState, SelectedItemData } from '../types';
import { ClassComponent } from '@kubevious/ui-framework';

import { IMarkerService } from '@kubevious/ui-middleware';
import { MarkerConfig, MarkerResultSubscriber } from '@kubevious/ui-middleware/dist/services/marker';
import { isEmptyArray, isEmptyObject } from '../utils';
import { exportFile } from '../utils/exportFile';
import { uploadFile } from '../utils/uploadFile';

import commonStyles from '../common.module.css';

const selectedItemDataInit: SelectedItemData = {
    items: [],
    item_count: 0,
    logs: [],
};

export class MarkerEditor extends ClassComponent<{}, MarkerEditorState, IMarkerService> {
    private _markerResultSubscriber?: MarkerResultSubscriber;
    readonly burgerMenuItems: BurgerMenuItem[];

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

        this.burgerMenuItems = [
            {
                key: 'marker-export',
                text: 'Export markers',
                icon: faFileExport,
                action: () => exportFile({ service: this.service }),
            },
            {
                key: 'marker-import',
                text: 'Import markers',
                icon: faFileImport,
                action: () => uploadFile({ service: this.service, deleteExtra: false, selector: 'marker-import' }),
                isUploadFile: true,
            },
            {
                key: 'marker-replace',
                text: 'Replace markers',
                icon: faFileDownload,
                action: () => uploadFile({ service: this.service, deleteExtra: true, selector: 'marker-replace' }),
                isUploadFile: true,
            },
        ];

        this.openSummary = this.openSummary.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.createItem = this.createItem.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.createNewItem = this.createNewItem.bind(this);
    }

    componentDidMount(): void {
        this.service.subscribeItemStatuses((value) => {
            this.setState({
                items: value,
            });
        });

        this._markerResultSubscriber = this.service.subscribeItemResult((value) => {
            if (!value) {
                value = selectedItemDataInit as any;
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
            this.service.getItem(marker.name).then((data) => {
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

        this.service.createItem(data as MarkerConfig, selectedItemId!).then(() => {
            this.setState({ isSuccess: true });

            setTimeout(() => {
                this.setState({ isSuccess: false });
            }, 2000);
        });
    }

    deleteItem(data: EditorItem): void {
        if (data.name) {
            this.service.deleteItem(data.name).then(() => {
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
        this.service.createItem(data as MarkerConfig, data.name || '').then((marker) => {
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
        const { items, selectedItem, selectedItemId, isNewItem, selectedItemData, isSuccess } = this.state;

        const itemCount = selectedItemData.items ? selectedItemData.items.length : selectedItemData.item_count;

        if (selectedItemData.items) {
            for (const item of selectedItemData.items) {
                if (selectedItem.name) {
                    item.markers = [selectedItem.name];
                }
            }
        }

        return (
            <div data-testid="marker-editor" className="d-flex h-100" id="markerEditorComponent">
                <Sider
                    type="marker"
                    items={items}
                    selectedItemId={selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    burgerMenuItems={this.burgerMenuItems}
                />

                <div id="marker-editor" className={commonStyles.ruleEditor}>
                    <div className={commonStyles.ruleContainer}>
                        {(isEmptyArray(items) || isEmptyObject(selectedItem)) && !isNewItem && (
                            <StartPage type="marker" createNewItem={this.createNewItem} />
                        )}

                        {(selectedItemId || isNewItem) && (
                            <>
                                {isNewItem && (
                                    <MarkerMainTab
                                        selectedItem={selectedItem}
                                        saveItem={this.saveItem}
                                        deleteItem={this.deleteItem}
                                        createItem={this.createItem}
                                        openSummary={this.openSummary}
                                        isSuccess={isSuccess}
                                    />
                                )}

                                {!isNewItem && (
                                    <Tabs>
                                        <Tab key="edit" label="Edit markers">
                                            <MarkerMainTab
                                                selectedItem={selectedItem}
                                                saveItem={this.saveItem}
                                                deleteItem={this.deleteItem}
                                                createItem={this.createItem}
                                                openSummary={this.openSummary}
                                                isSuccess={isSuccess}
                                            />
                                        </Tab>

                                        <Tab key="objects" label={`Affected objects[${itemCount}]`}>
                                            <AffectedObjects selectedItemData={selectedItemData} />
                                        </Tab>
                                    </Tabs>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
