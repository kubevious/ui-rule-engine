import React, { FC } from 'react';
import cx from 'classnames';

import styles from './styles.module.css';
import commonStyles from '../common.module.css';

export interface StartPageProps {
    type: string;
    createNewItem: () => void;
}

export const StartPage: FC<StartPageProps> = ({ type, createNewItem }) => (
    <div className={styles.startRuleContainer}>
        <div>
            <div className="d-flex justify-content-center">
                <button
                    id="newRuleBtn"
                    className={cx(commonStyles.button, commonStyles.success, commonStyles.newRuleBtn)}
                    onClick={createNewItem}
                >
                    <div className={commonStyles.plus}>+</div>
                    New {type}
                </button>
            </div>

            <div className={styles.orContainer}>
                <div className={`${styles.top} ${styles.line}`} />
                <div className={styles.circle}>or</div>
                <div className={`${styles.bottom} ${styles.line}`} />
            </div>

            <div className="d-flex flex-column">
                <a
                    href="https://github.com/kubevious/kubevious/blob/master/docs/rules-engine.md#rules-engine"
                    target="_blank"
                    className={styles.startText}
                >
                    Learn more about rules engine
                </a>
                <a
                    href="https://github.com/kubevious/rules-library#kubevious-rules-library"
                    target="_blank"
                    className={styles.startText}
                >
                    Browse rules library
                </a>
                <a href="https://kubevious.io/slack/" target="_blank" className={styles.startText}>
                    Get help in slack channel
                </a>
            </div>
        </div>
    </div>
);
