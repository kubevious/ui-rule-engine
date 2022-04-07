import React, { FC } from 'react';

import { PageLink } from '@kubevious/ui-components';

import styles from './styles.module.css';

const RULES_ENGINE_HELP = "https://kubevious.io/docs/features/rules-engine/";
const RULES_LIBRARY = "https://github.com/kubevious/rules-library#kubevious-rules-library";
const KUBEVIOUS_SLACK = "https://kubevious.io/slack/";

export const StartPage: FC = () => (
    <div className={styles.startRuleContainer}>
        <div className={styles.inner}>

            <PageLink name="Learn more about rules engine"
                      path={RULES_ENGINE_HELP}
                      target="_blank"
                      />

            <PageLink name="Browse rules library"
                      path={RULES_LIBRARY}
                      target="_blank"
                      />

            <PageLink name="Get help in slack channel"
                      path={KUBEVIOUS_SLACK}
                      target="_blank"
                      />

        </div>
    </div>
);
