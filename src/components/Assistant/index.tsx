import React, { FC } from 'react';
import { DnComponent, Label } from '@kubevious/ui-components';
import { CodeControl } from '@kubevious/ui-components';

import { AssistantProps } from './types';

import styles from './styles.module.css';

export const Assistant: FC<AssistantProps> = ({
    dn,
    scripts
}) => {
 
    return (
        <div className={styles.container}>

            <Label text="Assistant Target:" size="xlarge" />

            <div>
                <DnComponent dn={dn} />
            </div>

            {scripts && scripts.map((script, index) => (
                <div key={index} className={styles.snippetContainer}>
                    <Label text={script.name} />

                    <CodeControl
                        value={script.code}
                        syntax='javascript'
                    />
                    
                </div>
            ))}
        </div>
    );
};

