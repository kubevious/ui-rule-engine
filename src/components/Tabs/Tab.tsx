import React from 'react';
import { FC } from 'react';

export interface TabProps {
    label: string;
}

export const Tab: FC<TabProps> = ({ children, label }) => {
    return <div className={`tab-content tab-content-${label}`}>{children}</div>;
};
