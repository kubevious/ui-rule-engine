import { faFileDownload, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { BurgerMenuItem } from '@kubevious/ui-components/dist/BurgerMenu/types';
import React, { ReactNode } from 'react';
import { ClassComponent } from '@kubevious/ui-framework';
import { AffectedObjects } from '../components/AffectedObjects';
import { IRuleService } from '@kubevious/ui-middleware';
import { RuleMainTab } from '../components/RuleMainTab';
import { Tabs } from '../components/Tabs';
import { Tab } from '../components/Tabs/Tab';
import { StartPage } from '../StartPage';
import { EditorItem, RuleEditorState } from '../types.js';
import { RuleConfig, RuleResultSubscriber } from '@kubevious/ui-middleware/dist/services/rule';
import { Sider } from '../components/Sider';
import { isEmptyArray, isEmptyObject } from '../utils';
import { exportFile } from '../utils/exportFile';
import { uploadFile } from '../utils/uploadFile';

import commonStyles from '../common.module.css';

const selectedItemInit = {
    name: '',
    enabled: true,
    script: '',
    target: '',
};

const selectedItemDataInit = {
    is_current: true,
    item_count: 0,
    logs: [],
    items: [],
};

export class RuleEditor extends ClassComponent<{}, RuleEditorState, IRuleService> {
    private _ruleResultSubscriber?: RuleResultSubscriber;
    readonly burgerMenuItems: BurgerMenuItem[];

    constructor(props: {} | Readonly<{}>) {
        super(props, null, { kind: 'rule' });

        this.state = {
            items: [
                {
                    name: 'rule 1',
                    enabled: true,
                    item_count: 0,
                    error_count: 0,
                    is_current: false,
                },
                {
                    name: 'rule 2',
                    enabled: false,
                    item_count: 0,
                    error_count: 0,
                    is_current: false,
                },
                {
                    name: 'rule 3',
                    enabled: true,
                    item_count: 0,
                    error_count: 0,
                    is_current: false,
                },
            ],
            selectedItem: selectedItemInit,
            selectedItemData: selectedItemDataInit,
            selectedItemId: '',
            isSuccess: false,
            isNewItem: false,
        };

        this.burgerMenuItems = [
            {
                key: 'rule-export',
                text: 'Export rules',
                icon: faFileExport,
                action: () => exportFile({ service: this.service }),
            },
            {
                key: 'rule-import',
                text: 'Import rules',
                icon: faFileImport,
                action: () => uploadFile({ service: this.service, deleteExtra: false, selector: 'rule-import' }),
                isUploadFile: true,
            },
            {
                key: 'rule-replace',
                text: 'Replace rules',
                icon: faFileDownload,
                action: () => uploadFile({ service: this.service, deleteExtra: true, selector: 'rule-replace' }),
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

        this._ruleResultSubscriber = this.service.subscribeItemResult((value) => {
            if (!value) {
                value = selectedItemDataInit as any;
            }
            this.setState({
                selectedItemData: value as any,
            });
        });
        this.subscribeToSharedState('rule_editor_selected_rule_id', (rule_editor_selected_rule_id) => {
            this._ruleResultSubscriber!.update(rule_editor_selected_rule_id);
        });

        this.subscribeToSharedState(
            ['rule_editor_selected_rule_id', 'rule_editor_is_new_rule'],
            ({ rule_editor_selected_rule_id, rule_editor_is_new_rule }) => {
                if (!rule_editor_is_new_rule) {
                    this.selectItem({ name: rule_editor_selected_rule_id });
                }
            },
        );
    }

    selectItem(rule: EditorItem): void {
        !rule.name
            ? this.openSummary()
            : this.service.getItem(rule.name).then((data) => {
                  if (data === null) {
                      this.openSummary();
                      return;
                  }

                  this.setState({
                      selectedItemId: data.name,
                      selectedItem: data,
                  });

                  this.sharedState.set('rule_editor_selected_rule_id', rule.name);
                  this.sharedState.set('rule_editor_is_new_rule', false);
              });
    }

    saveItem(data: EditorItem): void {
        const { selectedItemId } = this.state;
        this.service.createItem(data as RuleConfig, selectedItemId).then(() => {
            this.setState({ isSuccess: true, selectedItem: data });

            setTimeout(() => {
                this.setState({ isSuccess: false });
            }, 2000);
        });
    }

    deleteItem(data: EditorItem): void {
        this.service.deleteItem(data.name || '').then(() => {
            this.setState({
                selectedItem: selectedItemInit,
                selectedItemId: '',
            });
            this.sharedState.set('rule_editor_selected_rule_id', null);
        });
    }

    openSummary(): void {
        this.setState({ selectedItem: selectedItemInit, selectedItemId: '' });
        this.sharedState.set('rule_editor_selected_rule_id', null);
    }

    createItem(data: EditorItem): void {
        this.service.createItem(data as RuleConfig, data.name || '').then((rule) => {
            this.setState({ isSuccess: true });
            this.selectItem(rule);
        });
    }

    createNewItem(): void {
        this.sharedState.set('rule_editor_selected_rule_id', null);
        this.sharedState.set('rule_editor_is_new_rule', true);

        this.setState((prevState) => ({
            ...prevState,
            isNewItem: true,
            selectedItem: {
                name: '',
                enabled: true,
                script: '',
                target: '',
            },
            selectedItemId: '',
            isSuccess: false,
            selectedItemData: selectedItemDataInit,
        }));
    }

    renderLoading(): ReactNode {
        return (
            !this.state.isNewItem &&
            this.state.selectedItemData &&
            !this.state.selectedItemData.is_current && <div className={commonStyles.busyRuleIndicator} />
        );
    }

    render() {
        const { items, selectedItem, selectedItemId, isNewItem, isSuccess, selectedItemData } = this.state;

        const itemCount = selectedItemData.items ? selectedItemData.items.length : selectedItemData.item_count;

        return (
            <div data-testid="rule-editor" className="d-flex h-100" id="ruleEditorComponent">
                <Sider
                    type="rule"
                    items={items}
                    selectedItemId={selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    burgerMenuItems={this.burgerMenuItems}
                />

                <div id="rule-editor" className={commonStyles.ruleEditor}>
                    <div className={commonStyles.ruleContainer}>
                        {(isEmptyArray(items) || isEmptyObject(selectedItem)) && !isNewItem && (
                            <StartPage type="rule" createNewItem={this.createNewItem} />
                        )}

                        {(selectedItemId || isNewItem) && (
                            <>
                                {isNewItem && (
                                    <RuleMainTab
                                        selectedItem={selectedItem}
                                        selectedItemData={selectedItemData}
                                        saveItem={this.saveItem}
                                        deleteItem={this.deleteItem}
                                        createItem={this.createItem}
                                        openSummary={this.openSummary}
                                        selectedItemId={selectedItemId}
                                        isSuccess={isSuccess}
                                        isNewItem={isNewItem}
                                    />
                                )}

                                {!isNewItem && (
                                    <Tabs>
                                        <Tab key="edit" label="Edit rules">
                                            <RuleMainTab
                                                selectedItem={selectedItem}
                                                selectedItemData={selectedItemData}
                                                saveItem={this.saveItem}
                                                deleteItem={this.deleteItem}
                                                createItem={this.createItem}
                                                openSummary={this.openSummary}
                                                selectedItemId={selectedItemId}
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
