import { Button, Checkbox, Input } from '@kubevious/ui-components';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Controlled as CodeMirrorEditor } from 'react-codemirror2';
import cx from 'classnames';
import { isEmptyArray } from '../../utils';
import Codemirror from 'codemirror';
import { snippets } from '../../constants';

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/lib/codemirror.css';

import { Log, EditorItem, RuleMainTabProps } from '../../types';

import styles from './styles.module.css';
import commonStyles from '../../common.module.css';

const LEFT_WINDOW_CODE_KEY = 91;
const EMPTY_CODE_KEY = 64;

export enum EditorTab {
    target = 'target',
    script = 'script',
}

export const RuleMainTab: FC<RuleMainTabProps> = ({
    selectedItem,
    selectedItemData,
    isSuccess,
    deleteItem,
    openSummary,
    createItem,
    saveItem,
    selectedItemKey,
    isNewItem = false,
}) => {
    const [formData, setFormData] = useState<EditorItem>({ enabled: false });
    const [formDataId, setFormDataId] = useState<string>('');
    const [visibleEditor, setVisibleEditor] = useState<EditorTab>(EditorTab.target);

    useEffect(() => {
        if (selectedItemKey !== formDataId || selectedItemKey === null) {
            setFormDataId(formDataId);
            setFormData({ ...selectedItem });
        }
    }, [selectedItemKey]);

    const validation = useMemo(() => {
        return !formData.name || !formData.target || !formData.script;
    }, [formData]);

    const handleScriptKeyUp = ({ editor, data }: { editor: Codemirror.Editor; data: KeyboardEvent }): void => {
        if (
            !editor.state.completionActive &&
            //Select only keycode letters
            data.keyCode > EMPTY_CODE_KEY &&
            data.keyCode < LEFT_WINDOW_CODE_KEY
        ) {
            //***
            // "autocomplete" is not exists in CommandActions type, but exists in Codemirror.commands
            //***
            // @ts-ignore: Unreachable code error
            Codemirror.commands.autocomplete(editor, null, {
                completeSingle: false,
            });
        }
    };

    const handleTargetKeyUp = ({ editor, data }: { editor: Codemirror.Editor; data: KeyboardEvent }): void => {
        //Select only keycode letters
        if (data.keyCode > EMPTY_CODE_KEY && data.keyCode < LEFT_WINDOW_CODE_KEY) {
            showSnippets(editor);
        }
    };

    const showSnippets = (editor: Codemirror.Editor): void => {
        Codemirror.showHint(
            editor,
            function () {
                const cursor = editor.getCursor();
                const token = editor.getTokenAt(cursor);
                const start = token.start;
                const end = cursor.ch;
                const line = cursor.line;
                const currentWord = token.string;

                const list = snippets.filter(function (item: { text: string | string[] }) {
                    return item.text.indexOf(currentWord) >= 0;
                });

                return {
                    list: list.length ? list : snippets,
                    from: Codemirror.Pos(line, start),
                    to: Codemirror.Pos(line, end),
                };
            },
            { completeSingle: false },
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangeTarget = (value: string): void => {
        setFormData({ ...formData, target: value });
    };

    const handleChangeScript = (value: string): void => {
        setFormData({ ...formData, script: value });
    };

    const changeEnable = (): void => {
        setFormData({ ...formData, enabled: !formData.enabled });
    };

    const { name, enabled, target, script } = formData;

    const countErrors = (type: string): number =>
        selectedItemData.logs.reduce((acc = 0, item: Log) => {
            if (item.msg.source.includes(type)) {
                return (acc += 1);
            }
            return acc;
        }, 0) || 0;

    return (
        <>
            {isNewItem && <div className={commonStyles.newItemTitle}>Create new rule</div>}
            <div className={styles.field}>
                <Input
                    type="text"
                    value={name || ''}
                    name="name"
                    onChange={handleChange}
                    data-testid="rule-name-input"
                    label="Name"
                />
            </div>

            <div className={cx(styles.editorContainer, 'editor-container')}>
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
                        <CodeMirrorEditor
                            className="test-editor"
                            value={target || ''}
                            options={{
                                mode: 'javascript',
                                theme: 'darcula',
                                lineNumbers: false,
                                extraKeys: {
                                    'Ctrl-Space': 'autocomplete',
                                },
                            }}
                            editorDidMount={(editor) => editor.refresh()}
                            onKeyUp={(editor: Codemirror.Editor, data: KeyboardEvent) =>
                                handleTargetKeyUp({ editor, data })
                            }
                            onBeforeChange={(
                                _editor: Codemirror.Editor,
                                _data: Codemirror.EditorChange,
                                value: string,
                            ) => handleChangeTarget(value)}
                        />
                    )}

                    {visibleEditor === EditorTab.script && (
                        <CodeMirrorEditor
                            value={script || ''}
                            options={{
                                mode: 'javascript',
                                theme: 'darcula',
                                lineNumbers: false,
                                extraKeys: {
                                    'Ctrl-Space': 'autocomplete',
                                },
                            }}
                            onKeyUp={(editor: Codemirror.Editor, data: KeyboardEvent) =>
                                handleScriptKeyUp({ editor, data })
                            }
                            onBeforeChange={(
                                _editor: Codemirror.Editor,
                                _data: Codemirror.EditorChange,
                                value: string,
                            ) => handleChangeScript(value)}
                        />
                    )}
                </div>
            </div>

            <div className={styles.editorErrors}>
                {selectedItemData &&
                    !isEmptyArray(selectedItemData.logs) &&
                    selectedItemData.logs.map((err, index) => (
                        <div className={styles.errBox} key={index}>
                            <div className={styles.errorBullet} />
                            <div className={cx(styles.alertItem, styles.errorMessage)}>{err.msg.msg}</div>
                        </div>
                    ))}
            </div>

            <div className={styles.checkboxContainer}>
                <Checkbox checked={enabled} label={enabled ? 'Enable' : 'Disable'} onChange={changeEnable} />
            </div>

            <div className="d-flex align-items-center justify-content-between">
                {!isNewItem && (
                    <>
                        <div className="d-flex">
                            <div className="me-3">
                                <Button type="ghost" onClick={openSummary}>
                                    Cancel
                                </Button>
                            </div>

                            <Button onClick={() => saveItem(formData)} disabled={validation}>
                                Save
                            </Button>
                            {isSuccess && <span>Saved!</span>}
                        </div>

                        <div>
                            <Button type="danger" onClick={() => deleteItem(formData)}>
                                Delete Rule
                            </Button>
                        </div>
                    </>
                )}

                {isNewItem && (
                    <div className="d-flex">
                        <div className="me-3">
                            <Button type="ghost" onClick={openSummary}>
                                Cancel
                            </Button>
                        </div>

                        <Button onClick={() => createItem(formData)} disabled={validation}>
                            Create
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};
