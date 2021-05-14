import { ReactNode } from 'react';

export type SiderMenuItem = {
    key: string;
    title: ReactNode;
    extraText?: ReactNode;
    icon: ReactNode;
};

export type SiderProps = {
    type: string;
    items: SiderMenuItem[];
    onSelect: (key: string) => void;
    selectedItemKey: string | null;
    header?: ReactNode;
};

export enum EditorType {
    rule = 'rule',
    marker = 'marker',
}