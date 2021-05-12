import { Tab, Tabs } from '@kubevious/ui-components';
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

import commonStyles from '../common.module.css';
import { MarkerPreview } from '../MarkerPreview';

const selectedItemDataInit: SelectedItemData = {
    items: [],
    item_count: 0,
    logs: [],
};

export class MarkerEditor extends ClassComponent<{}, MarkerEditorState, IMarkerService> {
    private _markerResultSubscriber?: MarkerResultSubscriber;

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

        this.subscribeToSharedState('marker_editor_is_new_marker', (marker_editor_is_new_marker) => {
            if (marker_editor_is_new_marker) {
                this.setState((prevState) => ({
                    ...prevState,
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
            this.setState((prevState) => ({
                isSuccess: true,
                selectedItem: data,
                selectedItemKey: data.name!,
                items: prevState.items.map((item) => (item.name === selectedItemKey ? data : item)),
            }));

            this.sharedState.set('marker_editor_selected_marker_key', data.name);

            setTimeout(() => {
                this.setState({ isSuccess: false });
            }, 2000);
        });
    }

    deleteItem(data: EditorItem): void {
        if (data.name) {
            this.service.deleteItem(data.name).then(() => {
                this.setState((prevState) => ({
                    selectedItem: {},
                    selectedItemKey: '',
                    items: prevState.items.filter((item) => item.name !== data.name),
                }));

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
            this.setState((prevState) => ({
                ...prevState,
                isSuccess: true,
                items: prevState.items.concat(marker),
                selectedItemKey: marker.name,
                selectedItem: marker,
            }));

            this.sharedState.set('marker_editor_selected_marker_key', marker.name);
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

        return (
            <div
                data-testid="marker-editor"
                className="d-flex"
                id="markerEditorComponent"
                style={{ height: `calc(100% - 20px)` }}
            >
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
                />

                <div id="marker-editor" className={commonStyles.ruleEditor}>
                    <div className={commonStyles.ruleContainer}>
                        {(isEmptyArray(items) || isEmptyObject(selectedItem)) && !isNewItem && <StartPage />}

                        {(selectedItemKey || isNewItem) && (
                            <div
                                className={cx(commonStyles.tabContainer, { [commonStyles.newTabContainer]: isNewItem })}
                            >
                                {isNewItem && (
                                    <div>
                                        <MarkerMainTab
                                            selectedItem={selectedItem}
                                            saveItem={this.saveItem}
                                            deleteItem={this.deleteItem}
                                            createItem={this.createItem}
                                            openSummary={this.openSummary}
                                            isNewItem={isNewItem}
                                            isSuccess={isSuccess}
                                        />
                                    </div>
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
