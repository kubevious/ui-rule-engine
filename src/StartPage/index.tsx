import React, { FC } from 'react';

import styles from './styles.module.css';

export const StartPage: FC = () => (
    <div className={styles.startRuleContainer}>
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
);
