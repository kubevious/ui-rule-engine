import React, { FC } from 'react';
import { isEmptyArray } from '../../utils';
import cx from 'classnames';
import { MarkerPreview } from '../../MarkerPreview';
import { EditorType, IndicatorType, EditorItem, SiderProps } from '../../types';
import { BurgerMenu } from '@kubevious/ui-components';

import styles from './styles.module.css';
import commonStyles from '../../common.module.css';

export const Sider: FC<SiderProps> = ({
    type,
    items,
    selectedItemId,
    selectItem,
    createNewItem,
    burgerMenuItems,
}) => {
    const ruleIndicatorClass = (x: EditorItem): string => {
        let indicatorClass: string;
        if (!x.enabled) {
            indicatorClass = IndicatorType.disabled;
        } else if (x.error_count) {
            indicatorClass = IndicatorType.invalid;
        } else {
            indicatorClass = IndicatorType.enabled;
        }
        return styles[indicatorClass];
    };

    return (
        <div id="rule-list" className={styles.ruleList}>
            <div className={styles.ruleHeader}>
                <div className="d-flex align-items-center btn-group">
                    <button
                        className={cx(commonStyles.button, commonStyles.success, commonStyles.newRuleBtn, 'flex-grow-1')}
                        onClick={createNewItem}
                    >
                        <div className={commonStyles.plus}>+</div>
                        <span>New {type}</span>
                    </button>

                    <BurgerMenu items={burgerMenuItems} />
                </div>
            </div>

            <div className={cx(styles.rules, { [styles.markers]: type === EditorType.marker })}>
                {!isEmptyArray(items) &&
                    items.map((item, index) => (
                        <button
                            key={index}
                            id="ruleItemButton"
                            className={cx(
                                styles.ruleItemButton,
                                item.name === selectedItemId && styles.selectedItemButton,
                            )}
                            onClick={() => selectItem(item)}
                        >
                            <div className={styles.item}>
                                {type === EditorType.marker && (
                                    <div className={styles.shapeWrapper}>
                                        <MarkerPreview shape={item.shape || ''} color={item.color || ''} />
                                    </div>
                                )}

                                <div className="d-flex align-items-center">
                                    {type === EditorType.rule && (
                                        <div className={cx(styles.indicator, ruleIndicatorClass(item))} />
                                    )}
                                    {type === EditorType.rule && !item.is_current && (
                                        <div className={styles.busyRuleIndicator} />
                                    )}
                                </div>

                                {item.name}
                            </div>
                            {item.item_count && item.item_count > 0 && `[${item.item_count}]`}
                        </button>
                    ))}
            </div>
        </div>
    );
};
