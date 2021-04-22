import { subscribeToSharedState } from '@kubevious/ui-framework';
import cx from 'classnames';
import React, { FC, ReactElement, useState } from 'react';

import styles from './styles.module.css';

export const Tabs: FC = ({ children }) => {
    const [currentTab, setCurrentTab] = useState(children![0].props.label);

    subscribeToSharedState('rule_editor_selected_rule_id', () => {
        setCurrentTab((children as ReactElement[])[0].props.label);
    });

    return (
        <div className="w-100">
            <div className={styles.header}>
                {(children as ReactElement[]).map((item) => {
                    return (
                        <div
                            key={item.key}
                            className={cx(styles.tab, {
                                [styles.selectedTab]:
                                    currentTab === item.props.label && (children as ReactElement[]).length > 1,
                                [styles.singleTab]: (children as ReactElement[]).length === 1,
                            })}
                            onClick={() => setCurrentTab(item.props.label)}
                        >
                            {item.props.label}
                        </div>
                    );
                })}
            </div>

            <div>
                {(children as ReactElement[]).map((child) => {
                    if (child.props.label !== currentTab) return null;
                    return child.props.children;
                })}
            </div>
        </div>
    );
};
