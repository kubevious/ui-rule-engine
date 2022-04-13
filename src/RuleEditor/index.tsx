import _ from 'the-lodash';
import { Tab, Tabs, DnResults, ScrollbarComponent } from '@kubevious/ui-components';
import cx from 'classnames';
import React, { ReactNode } from 'react';
import { app, ClassComponent } from '@kubevious/ui-framework';
import { IRuleService } from '@kubevious/ui-middleware';
import { RuleMainTab } from '../components/RuleMainTab';
import siderStyles from '../components/Sider/styles.module.css';
import { StartPage } from '../StartPage';
import { RuleEditorState } from '../types.js';
import { RuleConfig, RuleResult, RuleResultSubscriber } from '@kubevious/ui-middleware/dist/services/rule';
import { Sider } from '../components/Sider';

import commonStyles from '../common.module.css';
import { ruleIndicatorClass } from '../utils/ruleIndicatorClass';
import { makeNewRule } from '../utils';

const selectedItemDataInit : RuleResult = {
    name: '',
    items: [],
    is_current: true,
    error_count: 0,
    logs: []
};

export interface RuleEditorProps
{
}

export class RuleEditor extends ClassComponent<RuleEditorProps, RuleEditorState, IRuleService> {
    private _ruleResultSubscriber?: RuleResultSubscriber;

    constructor(props: RuleEditorProps | Readonly<RuleEditorProps>) {
        super(props, null, { kind: 'rule' });

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
        
        this.sharedState.markUserFlag('need_markers_list', 'rule-editor');

        this.service.subscribeItemStatuses((value) => {
            this.setState({
                items: _.orderBy(value, (item) => item.name),
            });
        });

        this._ruleResultSubscriber = this.service.subscribeItemResult((value) => {
            if (!value) {
                value = selectedItemDataInit;
            }
            if (!value.items) {
                value.items = [];
            }
            this.setState({
                selectedItemData: value,
            });
        });

        this.subscribeToSharedState('rule_editor_selected_rule_key', (rule_editor_selected_rule_key) => {
            this._ruleResultSubscriber!.update(rule_editor_selected_rule_key);
        });

        this.subscribeToSharedState(
            ['rule_editor_selected_rule_key', 'rule_editor_is_new_rule'],
            ({ rule_editor_selected_rule_key, rule_editor_is_new_rule }) => {
                if (rule_editor_selected_rule_key && !rule_editor_is_new_rule) {
                    this.setState({
                        selectedItemKey: rule_editor_selected_rule_key,
                    });
                    this.loadItem();
                } else {
                    this.setState({
                        selectedItemKey: null,
                        selectedItem: makeNewRule(),
                    });
                }
            },
        );

        this.subscribeToSharedState('rule_editor_is_new_rule', (rule_editor_is_new_rule) => {
            if (rule_editor_is_new_rule) {
                this.sharedState.set('rule_editor_selected_rule_key', null);

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

    componentWillUnmount() {
        super.componentWillUnmount();

        this.sharedState.clearUserFlag('need_markers_list', 'rule-editor');
    }

    selectItem(key: string): void {
        if (!key) {
            this.openSummary();
        } else {
            this.sharedState.set('rule_editor_selected_rule_key', key);
            this.sharedState.set('rule_editor_is_new_rule', false);
        }
    }

    loadItem(): void {
        const itemKey = this.sharedState.tryGet<string>('rule_editor_selected_rule_key');
        if (!itemKey) {
            return;
        }

        this.service.getItem(itemKey).then((data) => {
            if (
                itemKey !== this.sharedState.tryGet('rule_editor_selected_rule_key') ||
                this.sharedState.tryGet('rule_editor_is_new_rule')
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

    createItem(config: RuleConfig): void {
        this.service.createItem(config, config.name || '').then(() => {
            this.sharedState.set('rule_editor_selected_rule_key', config.name);

            app.operationLog.report(`Rule ${config.name} created.`);
        });
    }

    saveItem(config: RuleConfig): void {
        const { selectedItemKey } = this.state;

        this.service.createItem(config, selectedItemKey!).then(() => {
            this.sharedState.set('rule_editor_selected_rule_key', config.name);

            app.operationLog.report(`Rule ${config.name} saved.`);
        });
    }

    deleteItem(config: RuleConfig): void {
        this.service.deleteItem(config.name).then(() => {
            this.openSummary();

            app.operationLog.report(`Rule ${config.name} deleted.`);
        });
    }

    openSummary(): void {
        this.sharedState.set('rule_editor_selected_rule_key', null);
        this.sharedState.set('rule_editor_is_new_rule', false);
    }

    renderLoading(): ReactNode {
        return (
            !this.state.isNewItem &&
            this.state.selectedItemData &&
            !this.state.selectedItemData.is_current && 
            <div className={commonStyles.busyRuleIndicator} />
        );
    }

    render() {
        const { items, selectedItem, selectedItemKey, isNewItem, selectedItemData } = this.state;

        return (
            <div
                data-testid="rule-editor"
                className={commonStyles.ruleEngineContainer}
            >
                <Sider
                    type="rule"
                    emptyText="No rules present"
                    items={
                        items.length > 0
                            ? items.map((item) => ({
                                  key: item.name!,
                                  title: item.name!,
                                  extraText: item.item_count && item.item_count > 0 && `[${item.item_count}]`,
                                  icon: (
                                      <div className={siderStyles.iconsContainer}>
                                          <div className={cx(siderStyles.indicator, ruleIndicatorClass(item))} />
                                          {(!item.is_current) && <div className={siderStyles.busyRuleIndicator} />}
                                      </div>
                                  ),
                              }))
                            : []
                    }
                    selectedItemKey={selectedItemKey}
                    onSelect={this.selectItem}
                />

                <div id="rule-editor" className={commonStyles.ruleEngineMainContainer}>
                    {!(selectedItemKey || isNewItem) && <StartPage />}

                    {(selectedItemKey || isNewItem) && (
                        <div
                            className={cx(commonStyles.tabContainer)}
                        >
                            {isNewItem && (
                                <ScrollbarComponent>
                                    <RuleMainTab
                                        isNewItem={isNewItem}
                                        selectedItem={selectedItem!}
                                        saveItem={this.saveItem}
                                        deleteItem={this.deleteItem}
                                        createItem={this.createItem}
                                        openSummary={this.openSummary}
                                    />
                                </ScrollbarComponent>
                            )}

                            {!isNewItem && (
                                <Tabs>
                                    <Tab key="edit" label="Edit rules">
                                        <ScrollbarComponent>
                                            <RuleMainTab
                                                selectedItem={selectedItem!}
                                                selectedItemData={selectedItemData}
                                                saveItem={this.saveItem}
                                                deleteItem={this.deleteItem}
                                                createItem={this.createItem}
                                                openSummary={this.openSummary}
                                            />
                                       </ScrollbarComponent>
                                    </Tab>

                                    <Tab key="objects" label={`Affected objects [${selectedItemData.items.length}]`}>
                                        <ScrollbarComponent>
                                            <DnResults items={selectedItemData.items} />
                                        </ScrollbarComponent>
                                    </Tab>
                                </Tabs>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
