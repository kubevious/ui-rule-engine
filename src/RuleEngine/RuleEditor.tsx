import React from 'react';
import { ClassComponent } from '@kubevious/ui-framework';
import { Editor } from './Editor';
import styles from './styles.scss';
import { IRuleService } from '@kubevious/ui-middleware';
import { ItemsList } from './ItemsList';
import { EditorItem, RuleEditorState } from '../types.js';
import { RuleConfig, RuleResultSubscriber } from '@kubevious/ui-middleware/dist/services/rule';

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

const isTesting = process.env.IS_TESTING;
export class RuleEditor extends ClassComponent<{}, RuleEditorState, IRuleService> {

    private _ruleResultSubscriber? : RuleResultSubscriber;

    constructor(props: {} | Readonly<{}>) {
        super(props, null, { kind: 'rule' });

        this.state = {
            selectedTab: 'main',
            items: [],
            selectedItem: selectedItemInit,
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

        this.service.subscribeRuleStatuses((value) => {
            this.setState({
                items: value,
            });
        })

        this._ruleResultSubscriber = 
            this.service.subscribeRuleResult((value) => {
                if (!value) {
                    value = (selectedItemDataInit as any);
                }
                this.setState({
                    selectedItemData: (value as any),
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
        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: rule.name || '',
        });

        !rule.name
            ? this.openSummary()
            : this.service.getRule(rule.name)
                .then(data => {
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

        this.sharedState.set('rule_editor_selected_rule_id', rule.name);
        this.sharedState.set('rule_editor_is_new_rule', false);
    }

    saveItem(data: EditorItem): void {
        const { selectedItemId } = this.state;
        this.service.createRule(data as RuleConfig, selectedItemId)
            .then(() => {
                this.setState({ isSuccess: true, selectedItem: data });

                setTimeout(() => {
                    this.setState({ isSuccess: false });
                }, 2000);
            });
    }

    deleteItem(data: EditorItem): void {
        this.service.deleteRule(data.name || '')
            .then(() => {
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
        this.service.createRule(data as RuleConfig, data.name || '')
            .then(rule => {
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

    render() {
        const { items, isNewItem, selectedItem, selectedItemData, selectedItemId, isSuccess } = this.state;

        return (
            <div data-testid="rule-editor" className={styles.ruleEditorContainer} id="ruleEditorComponent">
                <ItemsList
                    type="rule"
                    items={items}
                    selectedItemId={selectedItemId}
                    selectItem={this.selectItem}
                    createNewItem={this.createNewItem}
                    ruleService={this.service}
                />

                {!isTesting && <Editor
                    type="rule"
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
                />}
            </div>
        );
    }
}
