import React, { FC } from 'react';
import { isEmptyArray } from '../../utils';
import cx from 'classnames';
import { EditorType, SiderProps } from '../../types';

import styles from './styles.module.css';

export const Sider: FC<SiderProps> = ({ type, items, selectedItemKey, onSelect, header }) => (
    <div id="rule-list" className={styles.ruleList}>
        <div className={styles.ruleHeader}>{header}</div>

        <div className={cx(styles.rules, { [styles.markers]: type === EditorType.marker })}>
            {!isEmptyArray(items) &&
                items.map((item) => (
                    <button
                        key={item.key}
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
        </div>
    </div>
);