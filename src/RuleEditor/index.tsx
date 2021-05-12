import { Tab, Tabs } from '@kubevious/ui-components';
import cx from 'classnames';
import React, { ReactNode } from 'react';
import { ClassComponent } from '@kubevious/ui-framework';
import { AffectedObjects } from '../components/AffectedObjects';
import { IRuleService } from '@kubevious/ui-middleware';
import { RuleMainTab } from '../components/RuleMainTab';
import styles from '../components/Sider/styles.module.css';
import { StartPage } from '../StartPage';
import { EditorItem, RuleEditorState } from '../types.js';
import { RuleConfig, RuleResultSubscriber } from '@kubevious/ui-middleware/dist/services/rule';
import { Sider } from '../components/Sider';
import { isEmptyArray } from '../utils';

import commonStyles from '../common.module.css';
import { ruleIndicatorClass } from '../utils/ruleIndicatorClass';

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
        this.subscribeToSharedState('rule_editor_selected_rule_key', (rule_editor_selected_rule_key) => {
            this._ruleResultSubscriber!.update(rule_editor_selected_rule_key);
        });

        this.subscribeToSharedState(
            ['rule_editor_selected_rule_key', 'rule_editor_is_new_rule'],
            ({ rule_editor_selected_rule_key, rule_editor_is_new_rule }) => {
                if (!rule_editor_is_new_rule) {
                    this.selectItem(rule_editor_selected_rule_key);
                }
            },
        );

        this.subscribeToSharedState('rule_editor_is_new_rule', (rule_editor_is_new_rule) => {
            if (rule_editor_is_new_rule) {
                this.sharedState.set('rule_editor_selected_rule_key', null);

                this.setState((prevState) => ({
                    ...prevState,
                    isNewItem: true,
                    selectedItem: {
                        name: '',
                        enabled: true,
                        script: '',
                        target: '',
                    },
                    selectedItemKey: '',
                    isSuccess: false,
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
                isNewItem: false,
            });

            this.sharedState.set('rule_editor_selected_rule_key', key);
            this.sharedState.set('rule_editor_is_new_rule', false);
        });
    }

    saveItem(data: EditorItem): void {
        const { selectedItemKey } = this.state;

        this.service.createItem(data as RuleConfig, selectedItemKey).then(() => {
            this.setState((prevState) => ({
                isSuccess: true,
                selectedItem: data,
                selectedItemKey: data.name!,
                items: prevState.items.map((item) => (item.name === selectedItemKey ? data : item)),
            }));

            this.sharedState.set('rule_editor_selected_rule_key', data.name);

            setTimeout(() => {
                this.setState({ isSuccess: false });
            }, 2000);
        });
    }

    deleteItem(data: EditorItem): void {
        this.service.deleteItem(data.name || '').then(() => {
            this.setState((prevState) => ({
                selectedItem: {},
                selectedItemKey: '',
                items: prevState.items.filter((item) => item.name !== data.name),
            }));
            this.sharedState.set('rule_editor_selected_rule_key', null);
        });
    }

    openSummary(): void {
        this.setState({ selectedItem: {}, selectedItemKey: '' });
        this.sharedState.set('rule_editor_selected_rule_key', null);
    }

    createItem(data: EditorItem): void {
        this.service.createItem(data as RuleConfig, data.name || '').then((rule) => {
            this.setState({ isSuccess: true });
            this.selectItem(rule.name);

            this.setState((prevState) => ({
                ...prevState,
                isSuccess: true,
                items: prevState.items.concat(rule),
                selectedItemKey: rule.name,
                selectedItem: rule,
            }));

            this.sharedState.set('rule_editor_selected_rule_key', rule.name);
        });
    }

    renderLoading(): ReactNode {
        return (
            !this.state.isNewItem &&
            this.state.selectedItemData &&
            !this.state.selectedItemData.is_current && <div className={commonStyles.busyRuleIndicator} />
        );
    }

    render() {
        const { items, selectedItem, selectedItemKey, isNewItem, isSuccess, selectedItemData } = this.state;

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
                        {(isEmptyArray(items) || !selectedItemKey) && !isNewItem && <StartPage />}

                        {(selectedItemKey || isNewItem) && (
                            <div
                                className={cx(commonStyles.tabContainer, { [commonStyles.newTabContainer]: isNewItem })}
                            >
                                {isNewItem && (
                                    <div>
                                        <RuleMainTab
                                            selectedItem={selectedItem}
                                            selectedItemData={selectedItemData}
                                            saveItem={this.saveItem}
                                            deleteItem={this.deleteItem}
                                            createItem={this.createItem}
                                            openSummary={this.openSummary}
                                            selectedItemKey={selectedItemKey}
                                            isSuccess={isSuccess}
                                            isNewItem={isNewItem}
                                        />
                                    </div>
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
                                                selectedItemKey={selectedItemKey}
                                                isSuccess={isSuccess}
                                            />
                                        </Tab>

                                        <Tab key="objects" label={`Affected objects (${itemCount})`}>
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
