import _ from 'the-lodash';
import { Tab, Tabs } from '@kubevious/ui-components';
import cx from 'classnames';
import React from 'react';
import { AffectedObjects } from '../components/AffectedObjects';
import { MarkerMainTab } from '../components/MarkerMainTab';
import { Sider } from '../components/Sider';
import styles from '../components/Sider/styles.module.css';
import { StartPage } from '../StartPage';
import { MarkerEditorState, SelectedItemData } from '../types';
import { app, ClassComponent } from '@kubevious/ui-framework';

import { IMarkerService } from '@kubevious/ui-middleware';
import { MarkerConfig, MarkerResultSubscriber } from '@kubevious/ui-middleware/dist/services/marker';

import commonStyles from '../common.module.css';
import { MarkerPreview } from '../MarkerPreview';
import { makeNewMarker } from '../utils';

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
            selectedItem: null,
            selectedItemData: selectedItemDataInit,
            selectedItemKey: null,
            isNewItem: false,
        };

        this.openSummary = this.openSummary.bind(this);
        this.saveItem = this.saveItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.createItem = this.createItem.bind(this);
        this.selectItem = this.selectItem.bind(this);
    }

    componentDidMount(): void {
        this.service.subscribeItemStatuses((value) => {
            this.setState({
                items: _.orderBy(value, (item) => item.name),
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
            this._markerResultSubscriber?.update(marker_editor_selected_marker_key);
        });

        this.subscribeToSharedState(
            ['marker_editor_selected_marker_key', 'marker_editor_is_new_marker'],
            ({ marker_editor_selected_marker_key, marker_editor_is_new_marker }) => {
                if (marker_editor_selected_marker_key && !marker_editor_is_new_marker) {
                    this.setState({
                        selectedItemKey: marker_editor_selected_marker_key,
                    });
                    this.loadItem();
                } else {
                    this.setState({
                        selectedItemKey: null,
                        selectedItem: makeNewMarker(),
                    });
                }
            },
        );

        this.subscribeToSharedState('marker_editor_is_new_marker', (marker_editor_is_new_marker) => {
            if (marker_editor_is_new_marker) {
                this.sharedState.set('marker_editor_selected_marker_key', null);

                this.setState({
                    isNewItem: true,
                });
            } else {
                this.setState({
                    isNewItem: false,
                });
            }
        });
    }

    selectItem(key: string): void {
        if (!key) {
            this.openSummary();
        } else {
            this.sharedState.set('marker_editor_selected_marker_key', key);
            this.sharedState.set('marker_editor_is_new_marker', false);
        }
    }

    loadItem(): void {
        const itemKey = this.sharedState.get('marker_editor_selected_marker_key');

        this.service.getItem(itemKey).then((data) => {
            if (
                this.sharedState.get('marker_editor_selected_marker_key') !== itemKey ||
                this.sharedState.get('marker_editor_is_new_marker')
            ) {
                return;
            }

            if (data === null) {
                this.openSummary();
                return;
            }

            this.setState({
                selectedItem: data,
            });
        });
    }

    createItem(config: MarkerConfig): void {
        this.service.createItem(config, config.name || '').then(() => {
            this.sharedState.set('marker_editor_selected_marker_key', config.name);

            app.operationLog.report(`Marker ${config.name} created.`);
        });
    }

    saveItem(config: MarkerConfig): void {
        const { selectedItemKey } = this.state;

        this.service.createItem(config, selectedItemKey!).then(() => {
            this.sharedState.set('marker_editor_selected_marker_key', config.name);

            app.operationLog.report(`Marker ${config.name} saved.`);
        });
    }

    deleteItem(config: MarkerConfig): void {
        this.service.deleteItem(config.name).then(() => {
            this.openSummary();

            app.operationLog.report(`Marker ${config.name} deleted.`);
        });
    }

    openSummary(): void {
        this.sharedState.set('marker_editor_selected_marker_key', null);
        this.sharedState.set('marker_editor_is_new_marker', false);
    }

    render() {
        const { items, selectedItem, selectedItemKey, isNewItem, selectedItemData } = this.state;

        const itemCount = selectedItemData.items ? selectedItemData.items.length : selectedItemData.item_count;

        if (selectedItemData.items) {
            for (const item of selectedItemData.items) {
                if (selectedItem) {
                    if (selectedItem!.name) {
                        item.markers = [selectedItem!.name!];
                    }
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
                        {!(selectedItemKey || isNewItem) && <StartPage />}

                        {(selectedItemKey || isNewItem) && (
                            <div
                                className={cx(commonStyles.tabContainer, { [commonStyles.newTabContainer]: isNewItem })}
                            >
                                {isNewItem && (
                                    <div>
                                        <MarkerMainTab
                                            isNewItem={isNewItem}
                                            selectedItem={selectedItem!}
                                            saveItem={this.saveItem}
                                            deleteItem={this.deleteItem}
                                            createItem={this.createItem}
                                            openSummary={this.openSummary}
                                        />
                                    </div>
                                )}

                                {!isNewItem && (
                                    <Tabs>
                                        <Tab key="edit" label="Edit markers">
                                            <MarkerMainTab
                                                selectedItem={selectedItem!}
                                                saveItem={this.saveItem}
                                                deleteItem={this.deleteItem}
                                                createItem={this.createItem}
                                                openSummary={this.openSummary}
                                            />
                                        </Tab>

                                        <Tab key="objects" label={`Affected objects [${itemCount}]`}>
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
