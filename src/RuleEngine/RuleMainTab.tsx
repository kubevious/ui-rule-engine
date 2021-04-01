import React, { useEffect, useMemo, useState } from 'react';
import { Controlled as CodeMirrorEditor } from 'react-codemirror2';
import cx from 'classnames';
import { isEmptyArray } from '../utils';
import Codemirror from 'codemirror';
import { snippets } from '../constants';
import $ from 'jquery';

import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/theme/darcula.css';
import 'codemirror/lib/codemirror.css';
import styles from './styles.scss';

import { Log, EditorItem, RuleMainTabProps } from '../types';

const LEFT_WINDOW_CODE_KEY = 91;
const EMPTY_CODE_KEY = 64;

export const RuleMainTab: React.FunctionComponent<RuleMainTabProps> = ({
    selectedItemId,
    selectedItem,
    selectedItemData,
    isSuccess,
    deleteItem,
    openSummary,
    createItem,
    saveItem,
}) => {
    const [formData, setFormData] = useState<EditorItem>({ enabled: false });
    const [formDataId, setFormDataId] = useState<string>('');
    const [visibleEditor, setVisibleEditor] = useState<string>('target');

    useEffect(() => {
        if (selectedItemId !== formDataId || selectedItemId === null) {
            setFormDataId(formDataId);
            setFormData({ ...selectedItem });
        }
    }, [selectedItemId, selectedItem]);

    useEffect(() => {
        $('.editor-container').css('height', `calc(100% - 210px - ${selectedItemData.logs.length * 40}px)`);
    }, [selectedItemData]);

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

    const handleChangeTarget = (
        value: string
    ): void => {
        setFormData({ ...formData, target: value });
    };

    const handleChangeScript = (
        value: string
    ): void => {
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
            return acc
        }, 0) || 0;

    return (
        <>
            <div className={styles.field}>
                <div className={styles.labelWrapper}>
                    <label>Name</label>
                </div>
                <input
                    type="text"
                    className={`${styles.fieldInput} ${styles.name}`}
                    value={name || ''}
                    name="name"
                    onChange={(e) => handleChange(e)}
                />
            </div>

            <div className={styles.editorContainer}>
                <div className={styles.tabs}>
                    <div
                        className={cx(styles.tab, visibleEditor === 'target' && styles.selectedEditorConteinerTab)}
                        onClick={() => setVisibleEditor('target')}
                    >
                        Target
                        {countErrors('target') > 0 && <div className={styles.errorCount}>{countErrors('target')}</div>}
                    </div>

                    <div
                        className={cx(styles.tab, visibleEditor === 'script' && styles.selectedEditorConteinerTab)}
                        onClick={() => setVisibleEditor('script')}
                    >
                        Rule script
                        {countErrors('script') > 0 && <div className={styles.errorCount}>{countErrors('script')}</div>}
                    </div>
                </div>

                <div className={styles.editor}>
                    {visibleEditor === 'target' && (
                        <CodeMirrorEditor
                            value={target || ''}
                            options={{
                                mode: 'javascript',
                                theme: 'darcula',
                                lineNumbers: true,
                                extraKeys: {
                                    'Ctrl-Space': 'autocomplete',
                                },
                            }}
                            onKeyUp={(editor: Codemirror.Editor, data: KeyboardEvent) =>
                                handleTargetKeyUp({ editor, data })
                            }
                            onBeforeChange={(_editor: Codemirror.Editor, _data: Codemirror.EditorChange, value: string) =>
                                handleChangeTarget(value)
                            }
                        />
                    )}

                    {visibleEditor === 'script' && (
                        <CodeMirrorEditor
                            value={script || ''}
                            options={{
                                mode: 'javascript',
                                theme: 'darcula',
                                lineNumbers: true,
                                extraKeys: {
                                    'Ctrl-Space': 'autocomplete',
                                },
                            }}
                            onKeyUp={(editor: Codemirror.Editor, data: KeyboardEvent) =>
                                handleScriptKeyUp({ editor, data })
                            }
                            onBeforeChange={(_editor: Codemirror.Editor, _data: Codemirror.EditorChange, value: string) =>
                                handleChangeScript(value)
                            }
                        />
                    )}
                </div>
            </div>

            <div className={styles.editorErrors}>
                {selectedItemData &&
                    !isEmptyArray(selectedItemData.logs) &&
                    selectedItemData.logs.map((err, index) => (
                        <>
                            {
                                <div className={styles.errBox} key={index}>
                                    <div className={styles.errorBullet} />
                                    <div className={`${styles.alertItem} ${styles.errorMessage}`} />
                                    {err.msg.msg}
                                </div>
                            }
                        </>
                    ))}
            </div>

            <label className={styles.checkboxContainer}>
                {enabled ? 'Enable' : 'Disable'}
                <input
                    type="checkbox"
                    className={styles.enableCheckbox}
                    checked={enabled || false}
                    onChange={() => changeEnable()}
                />
                <span id="checkmark" className={styles.checkmark} />
            </label>

            <div className={styles.btnGroup}>
                {selectedItem.name && (
                    <>
                        <button className={styles.button} onClick={() => deleteItem(formData)}>
                            Delete
                        </button>
                        <button className={styles.button} onClick={() => openSummary()}>
                            Cancel
                        </button>
                        <button className={`${styles.button} ${styles.success}`} onClick={() => saveItem(formData)} disabled={validation}>
                            Save
                        </button>
                        {isSuccess && <span>Saved!</span>}
                    </>
                )}

                {!selectedItem.name && (
                    <>
                        <button className={styles.button} onClick={() => openSummary()}>
                            Cancel
                        </button>
                        <button
                            className={`${styles.button} ${styles.success} ${styles.rule}`}
                            onClick={() => createItem(formData)}
                            disabled={validation}
                        >
                            Create
                        </button>
                    </>
                )}
            </div>
        </>
    );
};
