import React, { FC } from 'react';
import { isEmptyArray } from '../../utils';
import cx from 'classnames';
import { EditorType, SiderProps } from './types';

import styles from './styles.module.css';

export const Sider: FC<SiderProps> = ({ type, items, selectedItemKey, onSelect }) => (
    <div id="rule-list" className={styles.ruleList}>
        <div className={cx(styles.rules, { [styles.markers]: type === EditorType.marker })}>
            {!isEmptyArray(items) &&
                items.map((item, index) => (
                    <button
                        key={index}
                        id="ruleItemButton"
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

            {items && (items.length == 0) && <>
                <div className={styles.noItemsLabel}>
                    {(type == 'rule') && <>
                        No rules present
                    </>}
                    {(type == 'marker') && <>
                        No markers present
                    </>}
                </div>
            </>}
        </div>
    </div>
);
