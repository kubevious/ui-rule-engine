import React from 'react';
import { isEmptyArray } from '../utils';
import cx from 'classnames';
import { MarkerPreview } from '../MarkerPreview';
import { BurgerMenu } from '../BurgerMenu';
import { EditorType, IndicatorType, EditorItem, ItemsListProps } from '../types';

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
        return indicatorClass;
    };

    return (
        <div id="rule-list">
            <div className="rule-header">
                <div className="btn-group">
                    <button className="button success new-rule-btn" onClick={() => createNewItem()}>
                        <div className="plus">+</div>
                        <span className="button-text">New {type}</span>
                    </button>

                    <BurgerMenu type={type} service={service} />
                </div>
            </div>

            <div className={cx('rules', { markers: type === EditorType.marker })}>
                {!isEmptyArray(items) &&
                    items.map((item: EditorItem) => (
                        <button
                            key={item.name}
                            className={cx('rule-item-button', {
                                selected: item.name === selectedItemId,
                            })}
                            onClick={() => selectItem(item)}
                        >
                            <div className="item">
                                {type === EditorType.marker && (
                                    <div className="shape-wrapper">
                                        <MarkerPreview shape={item.shape || ''} color={item.color || ''} />
                                    </div>
                                )}

                                <div className="indicators">
                                    {type === EditorType.rule && (
                                        <div className={cx('indicator', ruleIndicatorClass(item))} />
                                    )}
                                    {type === EditorType.rule && !item.is_current && (
                                        <div className="busy-rule-indicator" />
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
