import { faFileDownload, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { BurgerMenuItem } from '@kubevious/ui-components/dist/BurgerMenu/types';
import React from 'react';
import { ClassComponent } from '@kubevious/ui-framework';
import { Editor } from '../components/Editor';
import { IRuleService } from '@kubevious/ui-middleware';
import { EditorItem, RuleEditorState } from '../types.js';
import { RuleConfig, RuleResultSubscriber } from '@kubevious/ui-middleware/dist/services/rule';
import { Sider } from '../components/Sider';
import { exportFile } from '../utils/exportFile';
import { uploadFile } from '../utils/uploadFile';

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
            selectedTab: 'main',
            items: [],
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
        this.setState({
            isNewItem: false,
            isSuccess: false,
            selectedItemId: rule.name || '',
        });

        !rule.name
            ? this.openSummary()
            : this.service.getItem(rule.name).then((data) => {
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

    render() {
        const { items, isNewItem, selectedItem, selectedItemData, selectedItemId, isSuccess } = this.state;

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

                <Editor
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
                />
            </div>
        );
    }
}
