import React from 'react';
import styles from './styles.scss';

export const StartPage = ({ type, createNewItem }: { type: string; createNewItem: () => void }): JSX.Element => {
    return (
        <div className={styles.startRuleContainer}>
            <div className={styles.startWrapper}>
                <div className={styles.startBtnWrapper}>
                    <button id="newRuleBtn" className={`${styles.button} ${styles.success} ${styles.newRuleBtn}`} onClick={() => createNewItem()}>
                        <div className={styles.plus}>+</div>
                        New {type}
                    </button>
                </div>

                <div className={styles.orContainer}>
                    <div className={`${styles.top} ${styles.line}`} />
                    <div className={styles.circle} >or</div>
                    <div className={`${styles.bottom} ${styles.line}`} />
                </div>

                <div className={styles.linksContainer}>
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
};
