import _ from 'the-lodash';
import { Tab, Tabs } from '@kubevious/ui-components';
import cx from 'classnames';
import React, { ReactNode } from 'react';
import { app, ClassComponent } from '@kubevious/ui-framework';
import { AffectedObjects } from '../components/AffectedObjects';
import { IRuleService } from '@kubevious/ui-middleware';
import { RuleMainTab } from '../components/RuleMainTab';
import styles from '../components/Sider/styles.module.css';
import { StartPage } from '../StartPage';
import { RuleEditorState } from '../types.js';
import { RuleConfig, RuleResultSubscriber } from '@kubevious/ui-middleware/dist/services/rule';
import { Sider } from '../components/Sider';

import commonStyles from '../common.module.css';
import { ruleIndicatorClass } from '../utils/ruleIndicatorClass';
import { makeNewRule } from '../utils';

const selectedItemDataInit = {
    is_current: true,
    item_count: 0,
    logs: [],
    items: [],
};

export class RuleEditor extends ClassComponent<{}, RuleEditorState, IRuleService> {
    private _ruleResultSubscriber?: RuleResultSubscriber;

    constructor(props: {} | Readonly<{}>) {
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
        this.service.subscribeItemStatuses((value) => {
            this.setState({
                items: _.orderBy(value, (item) => item.name),
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

    selectItem(key: string): void {
        if (!key) {
            this.openSummary();
        } else {
            this.sharedState.set('rule_editor_selected_rule_key', key);
            this.sharedState.set('rule_editor_is_new_rule', false);
        }
    }

    loadItem(): void {
        const itemKey = this.sharedState.get('rule_editor_selected_rule_key');

        this.service.getItem(itemKey).then((data) => {
            if (
                this.sharedState.get('rule_editor_selected_rule_key') !== itemKey ||
                this.sharedState.get('rule_editor_is_new_rule')
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
            !this.state.selectedItemData.is_current && <div className={commonStyles.busyRuleIndicator} />
        );
    }

    render() {
        const { items, selectedItem, selectedItemKey, isNewItem, selectedItemData } = this.state;

        const itemCount = selectedItemData.items ? selectedItemData.items.length : selectedItemData.item_count;

        return (
            <div
                data-testid="rule-editor"
                className="d-flex"
                id="ruleEditorComponent"
                style={{ height: `calc(100% - 20px)` }}
            >
                <Sider
                    type="rule"
                    items={
                        items.length > 0
                            ? items.map((item) => ({
                                  key: item.name!,
                                  title: item.name!,
                                  extraText: item.item_count && item.item_count > 0 && `[${item.item_count}]`,
                                  icon: (
                                      <div className="d-flex align-items-center">
                                          <div className={cx(styles.indicator, ruleIndicatorClass(item))} />
                                          {!item.is_current && <div className={styles.busyRuleIndicator} />}
                                      </div>
                                  ),
                              }))
                            : []
                    }
                    selectedItemKey={selectedItemKey}
                    onSelect={this.selectItem}
                />

                <div id="rule-editor" className={commonStyles.ruleEditor}>
                    <div className={commonStyles.ruleContainer}>
                        {!(selectedItemKey || isNewItem) && <StartPage />}

                        {(selectedItemKey || isNewItem) && (
                            <div
                                className={cx(commonStyles.tabContainer, { [commonStyles.newTabContainer]: isNewItem })}
                            >
                                {isNewItem && (
                                    <div>
                                        <RuleMainTab
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
                                        <Tab key="edit" label="Edit rules">
                                            <RuleMainTab
                                                selectedItem={selectedItem!}
                                                selectedItemData={selectedItemData}
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
