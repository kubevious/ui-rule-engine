import React, { useEffect, useState } from 'react';
import { isEmptyArray, isEmptyObject } from '../utils';
import cx from 'classnames';
import { AffectedObjects } from './AffectedObjects';
import { StartPage } from './StartPage';
import { RuleMainTab } from './RuleMainTab';
import { MarkerMainTab } from './MarkerMainTab';
import { EditorType, EditorProps } from '../types';
import styles from './styles.scss';

export const Editor: React.FunctionComponent<EditorProps> = ({
    type,
    items,
    isNewItem,
    selectedItem,
    selectedItemData,
    selectedItemId,
    createNewItem,
    saveItem,
    deleteItem,
    createItem,
    openSummary,
    isSuccess,
}) => {
    const [selectedTab, setSelectedTab] = useState<string>('main');

    let itemCount = 0;
    if (selectedItemData.items) {
        itemCount = selectedItemData.items.length;
    } else {
        itemCount = selectedItemData.item_count;
    }

    if (type === EditorType.marker && selectedItemData.items) {
        for (const item of selectedItemData.items) {
            if (selectedItem.name) {
                item.markers = [selectedItem.name];
            }
        }
    }

    useEffect(() => {
        setSelectedTab('main');
    }, [selectedItemId]);

    const detectEditor = (): JSX.Element => {
        return (
            <>
                {type === EditorType.rule ? (
                    <RuleMainTab
                        key={selectedItemId}
                        selectedItemId={selectedItemId}
                        selectedItem={selectedItem}
                        selectedItemData={selectedItemData}
                        deleteItem={deleteItem}
                        openSummary={openSummary}
                        saveItem={saveItem}
                        createItem={createItem}
                        isSuccess={isSuccess}
                    />
                ) : (
                    <MarkerMainTab
                        selectedItem={selectedItem}
                        deleteItem={deleteItem}
                        openSummary={openSummary}
                        saveItem={saveItem}
                        createItem={createItem}
                        isSuccess={isSuccess}
                    />
                )}
            </>
        );
    };

    const renderLoading = (): false | JSX.Element => {
        return (
            !isNewItem &&
            selectedItemData &&
            type === EditorType.rule &&
            !selectedItemData.is_current && <div className={styles.busyRuleIndicator} />
        );
    };

    const renderEditor = (): JSX.Element => {
        return (
            <>
                <div className={styles.editorTitle}>
                    {renderLoading()}
                    {isNewItem && <div className={styles.editorTitle} >Create new {type}</div>}
                    {!isNewItem && (
                        <>
                            <div
                                className={cx(`${styles.tab} ${styles.ruleTab}`, {
                                    selected: selectedTab === 'main',
                                })}
                                onClick={() => setSelectedTab('main')}
                            >
                                Edit {type}
                            </div>
                            <div
                                className={cx(`${styles.tab} ${styles.objectTab}`, {
                                    selected: selectedTab === 'object',
                                })}
                                onClick={() => setSelectedTab('object')}
                            >
                                Affected objects[{itemCount}]
                            </div>
                        </>
                    )}
                </div>

                {selectedTab === 'main' && detectEditor()}

                {selectedTab === 'object' && !isEmptyArray(selectedItemData.items) && (
                    <AffectedObjects selectedItemData={selectedItemData} />
                )}
            </>
        );
    };

    return (
        <div id="rule-editor">
            <div className={styles.ruleContainer}>
                {isEmptyObject(items) && isEmptyObject(selectedItem) && (
                    <StartPage type={type} createNewItem={createNewItem} />
                )}

                {!isEmptyObject(selectedItem) && renderEditor()}

                {!isEmptyObject(items) && isEmptyObject(selectedItem) && (
                    <StartPage type={type} createNewItem={createNewItem} />
                )}
            </div>
        </div>
    );
};
