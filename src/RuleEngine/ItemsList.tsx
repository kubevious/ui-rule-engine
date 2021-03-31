import React from 'react';
import { isEmptyArray } from '../utils';
import cx from 'classnames';
import { MarkerPreview } from '../MarkerPreview';
import { BurgerMenu } from '../BurgerMenu';
import { EditorType, IndicatorType, EditorItem, ItemsListProps } from '../types';
import styles from './styles.scss';

export const ItemsList: React.FunctionComponent<ItemsListProps> = ({
    type,
    items,
    selectedItemId,
    selectItem,
    createNewItem,
    service,
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
        <div id="rule-list">
            <div className={styles.ruleHeader}>
                <div className={styles.btnGroup}>
                    <button className={`${styles.button} ${styles.success} ${styles.newRuleBtn}`} onClick={() => createNewItem()}>
                        <div className={styles.plus}>+</div>
                        <span className={styles.buttonText}>New {type}</span>
                    </button>

                    <BurgerMenu type={type} service={service} />
                </div>
            </div>

            <div className={cx(styles.rules, type === EditorType.marker && styles.markers)}>
                {!isEmptyArray(items) &&
                    items.map((item: EditorItem, index: number) => (
                        <button
                            key={index}
                            className={cx(styles.ruleItemButton, {
                                selected: item.name === selectedItemId,
                            })}
                            onClick={() => selectItem(item)}
                        >
                            <div className={styles.item}>
                                {type === EditorType.marker && (
                                    <div className={styles.shapeWrapper}>
                                        <MarkerPreview shape={item.shape || ''} color={item.color || ''} />
                                    </div>
                                )}

                                <div className={styles.indicators}>
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
