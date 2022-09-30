import _ from 'the-lodash';
import React, { FC, useEffect, useState } from 'react';
import cx from 'classnames';
import styles from './styles.module.css';

import { HttpClient } from '@kubevious/ui-framework';

export interface RulesLibraryItemProps {
    bundleUrl: string;
}

export const RulesLibraryItem: FC<RulesLibraryItemProps> = ({
    bundleUrl
}) => {

    const [ruleBundle, setRuleBundle] = useState<any>(null);

    useEffect(() => {
        const client = new HttpClient();
        client.get(bundleUrl)
            .then(res => {
                console.log(res.data);
                setRuleBundle(res.data);
            })

    }, []);

    return (
        <div className={styles.container}>

          {bundleUrl}
            
          {ruleBundle && JSON.stringify(ruleBundle, null, 4)}
        </div>
    );
};

