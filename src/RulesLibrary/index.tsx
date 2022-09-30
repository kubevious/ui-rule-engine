import _ from 'the-lodash';
import React, { FC, useEffect, useState } from 'react';
import cx from 'classnames';
import styles from './styles.module.css';

import { HttpClient } from '@kubevious/ui-framework';
import { ItemDetailsList } from '@kubevious/ui-components';

import { RulesLibraryItem } from './RulesLibraryItem';

const LIBRARY_INDEX_URL = 'https://raw.githubusercontent.com/kubevious/rules-library/master/library/index.json';

export interface RulesLibraryProps {
}

export const RulesLibrary: FC<RulesLibraryProps> = ({
}) => {

    const [rules, setRules] = useState<any[]>([]);

    useEffect(() => {
        const client = new HttpClient();
        client.get(LIBRARY_INDEX_URL)
            .then(res => {
                console.log(res.data);
                setRules(res.data);
            })

    }, []);

    return (
        <div className={styles.container}>

            {/* Rules Library */}

            <ItemDetailsList 
                items={rules.map(x => ({
                    key: x.id,
                    text: x.name,
                    data: x
                }))}
                onRenderDetails={(item) => {
                    if (!item) {
                        return <></>;
                    }
                    return <RulesLibraryItem bundleUrl={item.data.bundleUrl} />
                }}
            />
            
        </div>
    );
};

