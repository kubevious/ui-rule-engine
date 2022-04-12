import React, { FC } from 'react';
import cx from 'classnames';
import { EditorType, SiderProps } from './types';

import styles from './styles.module.css';
import { Label, ScrollbarComponent } from '@kubevious/ui-components';

export const Sider: FC<SiderProps> = ({ type, emptyText, items, selectedItemKey, onSelect }) => (
    <div id="rule-engine-list"
         className={styles.ruleList}>

        {items && <>

            {(items.length > 0) &&
                <ScrollbarComponent>
        
                    <div className={cx(styles.rules, { [styles.markers]: type === EditorType.marker })}>
                        {items.map((item, index) => (
                            <button
                                key={index}
                                id="ruleEngineItemButton"
                                className={cx(styles.ruleItemButton, {
                                    [styles.selectedItemButton]: item.key === selectedItemKey,
                                })}
                                onClick={() => onSelect(item.key)}
                            >
                                <div className={styles.item}>
                                    {item.icon}

                                    {item.title}
                                </div>
                                {item.extraText}
                            </button>
                        ))}
                    </div>

                </ScrollbarComponent>
            }

            {(items.length == 0) && <>
                <div className={styles.noItemsLabel}>

                    <Label
                           text={emptyText}
                           size="large" />

                </div>
            </>}

        </>}                

    </div>
);
