import { faFileDownload, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { BurgerMenu, Tab, Tabs } from '@kubevious/ui-components';
import { BurgerMenuItem } from '@kubevious/ui-components/dist/BurgerMenu/types';
import cx from 'classnames';
import React from 'react';
import { AffectedObjects } from '../components/AffectedObjects';
import { MarkerMainTab } from '../components/MarkerMainTab';
import { Sider } from '../components/Sider';
import styles from '../components/Sider/styles.module.css';
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
import { MarkerPreview } from '../MarkerPreview';

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
            selectedItemKey: '',
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
        this.subscribeToSharedState('marker_editor_selected_marker_key', (marker_editor_selected_marker_key) => {
            this._markerResultSubscriber!.update(marker_editor_selected_marker_key);
        });
    }

    selectItem(key: string): void {
        this.service.getItem(key).then((data) => {
            if (data === null) {
                this.openSummary();
                return;
            }

            this.setState({
                selectedItemKey: data.name,
                selectedItem: data,
            });
            this.sharedState.set('marker_editor_selected_marker_key', key);
        });
    }

    saveItem(data: EditorItem): void {
        const { selectedItemKey } = this.state;

        this.service.createItem(data as MarkerConfig, selectedItemKey!).then(() => {
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
                    selectedItemKey: '',
                });
                this.sharedState.set('marker_editor_selected_marker_key', null);
            });
        }
    }

    openSummary(): void {
        this.setState({ selectedItem: {}, selectedItemKey: '', isNewItem: false });
        this.sharedState.set('marker_editor_selected_marker_key', null);
    }

    createItem(data: EditorItem): void {
        this.service.createItem(data as MarkerConfig, data.name || '').then((marker) => {
            this.setState({ isSuccess: true });
            this.selectItem(marker.name);
        });
    }

    createNewItem(): void {
        this.sharedState.set('marker_editor_selected_marker_key', null);

        this.setState(() => ({
            isNewItem: true,
            selectedItem: {
                name: '',
                color: COLORS[0],
                shape: SHAPES[0],
                propagate: false,
            },
            isSuccess: false,
            selectedItemKey: '',
            selectedItemData: selectedItemDataInit,
        }));
    }

    render() {
        const { items, selectedItem, selectedItemKey, isNewItem, selectedItemData, isSuccess } = this.state;

        const itemCount = selectedItemData.items ? selectedItemData.items.length : selectedItemData.item_count;

        if (selectedItemData.items) {
            for (const item of selectedItemData.items) {
                if (selectedItem.name) {
                    item.markers = [selectedItem.name];
                }
            }
        }

        console.log('selectedItemKey= >', selectedItemKey);
        console.log('isNewItem => ', isNewItem);

        return (
            <div data-testid="marker-editor" className="d-flex h-100" id="markerEditorComponent">
                <Sider
                    type="marker"
                    items={
                        items.length > 0
                            ? items.map((item) => ({
                                  key: item.name!,
                                  title: item.name!,
                                  extraText: item.item_count && item.item_count > 0 && `[${item.item_count}]`,
                                  icon: (
                                      <div className={styles.shapeWrapper}>
                                          <MarkerPreview shape={item.shape || ''} color={item.color || ''} />
                                      </div>
                                  ),
                              }))
                            : []
                    }
                    selectedItemKey={selectedItemKey}
                    onSelect={this.selectItem}
                    header={
                        <div className="d-flex align-items-center btn-group">
                            <button
                                className={cx(
                                    commonStyles.button,
                                    commonStyles.success,
                                    commonStyles.newRuleBtn,
                                    'flex-grow-1',
                                )}
                                onClick={this.createNewItem}
                            >
                                <div className={commonStyles.plus}>+</div>
                                <span>New marker</span>
                            </button>

                            <BurgerMenu items={this.burgerMenuItems} />
                        </div>
                    }
                />

                <div id="marker-editor" className={commonStyles.ruleEditor}>
                    <div className={commonStyles.ruleContainer}>
                        {(isEmptyArray(items) || isEmptyObject(selectedItem)) && !isNewItem && (
                            <StartPage type="marker" createNewItem={this.createNewItem} />
                        )}

                        {(selectedItemKey || isNewItem) && (
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
