import React, { FC } from 'react';
import { Button, DnComponent, Label } from '@kubevious/ui-components';
import { CodeControl } from '@kubevious/ui-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { AssistantProps } from './types';

import styles from './styles.module.css';

export const Assistant: FC<AssistantProps> = ({
    dn,
    scripts,
    handleInsert
}) => {

    return (
        <div className={styles.container}>

            <Label text="Assistant Target:" size="xlarge" />

            <div>
                <DnComponent dn={dn} />
            </div>

            {scripts && scripts.map((script, index) => (
                <div key={index} className={styles.snippetContainer}>

                    <div className={styles.nameWrapper}>
                        <Button className={styles.pasteButton}
                                onClick={() => {
                                    if (handleInsert) {
                                        handleInsert(script)
                                    }
                                }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Button>

                        <Label text={script.name} />
                    </div>

                    <div>
                        <CodeControl value={script.code}
                                    syntax='javascript'
                                    sizeToContent
                                    />
                    </div>

                </div>
            ))}
        </div>
    );
};

