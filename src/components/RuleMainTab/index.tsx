import _ from 'the-lodash';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Button, Checkbox, Input, ScrollbarComponent } from '@kubevious/ui-components';
import { CodeControl } from '@kubevious/ui-components';

import { RuleConfig, RuleResultLog } from '@kubevious/ui-middleware/dist/services/rule';
import cx from 'classnames';
import { isEmptyArray, makeNewRule } from '../../utils';

import { RuleMainTabProps } from '../../types';

import styles from './styles.module.css';
import commonStyles from '../../common.module.css';
import { subscribeToSharedState } from '@kubevious/ui-framework';

import { RuleAssistantData, RuleAssistantSnippet } from '../Assistant/types';
import { Assistant } from '../Assistant';

import { isEmptyString } from '../../utils/string-utils';

// const LEFT_WINDOW_CODE_KEY = 91;
// const EMPTY_CODE_KEY = 64;

export enum EditorTab {
    target = 'target',
    script = 'script',
}

export const RuleMainTab: FC<RuleMainTabProps> = ({
    selectedItem,
    selectedItemData,
    deleteItem,
    openSummary,
    createItem,
    saveItem,
    isNewItem = false,
}) => {
    const [formData, setFormData] = useState<RuleConfig>(makeNewRule());
    const [visibleEditor, setVisibleEditor] = useState<EditorTab>(EditorTab.target);
    const [assistantData, setAssistantData] = useState<RuleAssistantData | null>(null);
    const [editorLogs, setEditorLogs] = useState<RuleResultLog[]>([]);
    

    useEffect(() => {
        if (selectedItem) {
            setFormData(selectedItem);
        } else {
            setFormData(makeNewRule());
        }
    }, [selectedItem]);

    subscribeToSharedState("rule_engine_assistant_data", setAssistantData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const changeEnable = (): void => {
        setFormData({ ...formData, enabled: !formData.enabled });
    };

    const { name, enabled, target, script } = formData;

    const countErrors = (type: string): number =>
        selectedItemData?.logs.reduce((acc = 0, item) => {
            if (item.msg.source.includes(type)) {
                return (acc += 1);
            }
            return acc;
        }, 0) || 0;

    const handleInsertTargetSnippet = (snippet: RuleAssistantSnippet) => {

        setFormData({ ...formData, target: combineSnippet(target, snippet.code) });
    };

    const handleInsertRuleSnippet = (snippet: RuleAssistantSnippet) => {

        setFormData({ ...formData, script: combineSnippet(script, snippet.name) });

    };

    const combineSnippet = (code: string, snippetCode: string) => {
        if (code) {
            return code + '\n' + snippetCode;
        }

        return snippetCode;
    };

    const validateForm = () => {
        const newLogs : RuleResultLog[] = [];
        console.log('validateForm', formData)
        if (isEmptyString(formData.name)) {
            newLogs.push({ kind: 'error', msg: { source: [], msg: 'Rule name cannot be empty.' }});
        }
        if (isEmptyString(formData.target)) {
            newLogs.push({ kind: 'error', msg: { source: [], msg: 'Target script cannot be empty.' }});
        }
        if (isEmptyString(formData.script)) {
            newLogs.push({ kind: 'error', msg: { source: [], msg: 'Rule script cannot be empty.' }});
        }
        return newLogs;
    }

    const persist = (handler: (data: RuleConfig) => void) =>
    {
        const newLogs = validateForm();
        setEditorLogs(newLogs);

        if (newLogs.length > 0) {
            return;
        }

        handler(formData);
    }

    const allRuleLogs = _.concat(
        editorLogs,
        selectedItemData?.logs ?? []
    );

    return (
        <div className={styles.container}>

            {isNewItem && <div className={commonStyles.newItemTitle}>Create new rule</div>}

            <div className={styles.field}>
                <Input
                    type="text"
                    value={name || ''}
                    name="name"
                    onChange={handleChange}
                    data-testid="rule-name-input"
                    label="Name"
                    autoComplete="off"
                />
            </div>

            <div className={cx(styles.editorContainer)}>
                <div className={styles.tabs}>
                    <div
                        className={cx(styles.tab, {
                            [styles.selectedEditorContainerTab]: visibleEditor === EditorTab.target,
                        })}
                        onClick={() => setVisibleEditor(EditorTab.target)}
                    >
                        Target
                        {countErrors(EditorTab.target) > 0 && (
                            <div className={styles.errorCount}>{countErrors(EditorTab.target)}</div>
                        )}
                    </div>

                    <div
                        className={cx(styles.tab, {
                            [styles.selectedEditorContainerTab]: visibleEditor === EditorTab.script,
                        })}
                        onClick={() => setVisibleEditor(EditorTab.script)}
                    >
                        Rule script
                        {countErrors(EditorTab.script) > 0 && (
                            <div className={styles.errorCount}>{countErrors(EditorTab.script)}</div>
                        )}
                    </div>
                </div>

                <div className={styles.editor}>
                    {visibleEditor === EditorTab.target && (
                        <div className={styles.tabWrapper}>
                            <div className={styles.codeWrapper}>

                                <div className={styles.codeInner}>
                                    <CodeControl
                                        value={target || ''}
                                        syntax='javascript'
                                        showLineNumbers={false}
                                        extraKeys={{ 'Ctrl-Space': 'autocomplete' }}
                                        // onKeyUp={(editor, data) => {
                                        //     // handleTargetKeyUp(editor, data)
                                        // }}
                                        handleChange={(value) => {
                                            setFormData({ ...formData, target: value });
                                        }}
                                    />
                                </div>

                            </div>

                            { assistantData && <div className={styles.assistantWrapper}>
                                <div className={styles.assistantInner}>
                                    <Assistant dn={assistantData.dn}
                                               scripts={assistantData.targetScripts} 
                                               handleInsert={handleInsertTargetSnippet} />
                                </div>
                            </div>}
                        </div>
                    )}

                    {visibleEditor === EditorTab.script && (
                        <div className={styles.tabWrapper}>
                            <div className={styles.codeWrapper}>

                                <div className={styles.codeInner}>

                                    <CodeControl
                                        value={script || ''}
                                        syntax='javascript'
                                        showLineNumbers={false}
                                        extraKeys={{ 'Ctrl-Space': 'autocomplete' }}
                                        // onKeyUp={(editor, data) => {
                                        //     // handleScriptKeyUp(editor, data)
                                        // }}
                                        handleChange={(value) => {
                                            setFormData({ ...formData, script: value });
                                        }}
                                    />

                                </div>

                            </div>

                            { assistantData && <div className={styles.assistantWrapper}>
                                <div className={styles.assistantInner}>
                                    <Assistant dn={assistantData.dn}
                                               scripts={assistantData.ruleScripts}
                                               handleInsert={handleInsertRuleSnippet} />
                                </div>
                            </div>}
                        </div>
                    )}
                </div>
            </div>

            {!isEmptyArray(allRuleLogs) &&
                <div className={styles.editorErrors}>
                    <ScrollbarComponent>
                        {allRuleLogs.map((err, index) => (
                                <div className={styles.errBox} key={index}>
                                    <div className={styles.errorBullet} />
                                    <div className={cx(styles.alertItem, styles.errorMessage)}>{err.msg.msg}</div>
                                </div>
                            ))}
                    </ScrollbarComponent>
                </div>
            }
            

            <div className={styles.checkboxContainer}>
                <Checkbox checked={enabled} label={enabled ? 'Enable' : 'Disable'} onChange={changeEnable} />
            </div>

            {!isNewItem && (
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <Button type="ghost" onClick={openSummary} spacingRight>
                            Cancel
                        </Button>

                        <Button onClick={() => persist(saveItem)}>
                            Save
                        </Button>
                    </div>

                    <div>
                        <Button type="danger" onClick={() => deleteItem(formData)} bordered={false}>
                            Delete Rule
                        </Button>
                    </div>
                </div>
            )}

            {isNewItem && (
                <div className="d-flex align-items-center">
                    <Button type="ghost" onClick={openSummary} spacingRight>
                        Cancel
                    </Button>

                    <Button onClick={() => persist(createItem)}>
                        Create
                    </Button>
                </div>
            )}
        </div>
    );
};

