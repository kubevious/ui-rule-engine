import { MarkerConfig, MarkerStatus } from '@kubevious/ui-middleware/dist/services/marker';
import { RuleConfig, RuleStatus } from '@kubevious/ui-middleware/dist/services/rule';
import { ReactNode } from 'react';
import { COLORS, SHAPES } from './constants';

export type DnOptions = {
    relativeTo?: string;
};

export interface SelectedData {
    dn: string;
    id?: number;
    errors?: number;
    warnings?: number;
    options?: DnOptions;
    markers?: string[];
}

export type Log = {
    kind: string;
    msg: {
        source: string[];
        msg: string;
    };
};

export type RuleMainTabProps = {
    selectedItem?: RuleConfig;
    selectedItemData?: SelectedItemData;
    saveItem: (data: RuleConfig) => void;
    deleteItem: (data: RuleConfig) => void;
    createItem: (data: RuleConfig) => void;
    openSummary: () => void;
    isNewItem?: boolean;
};

export type RuleEditorState = {
    items: RuleStatus[];
    selectedItemData: SelectedItemData;
    selectedItem: RuleConfig | null;
    selectedItemKey: string | null;
    isNewItem: boolean;
};

export type MarkerMainTabProps = {
    selectedItem?: MarkerConfig;
    saveItem: (data: MarkerConfig) => void;
    deleteItem: (data: MarkerConfig) => void;
    createItem: (data: MarkerConfig) => void;
    openSummary: () => void;
    isNewItem?: boolean
};

export type MarkerEditorState = {
    items: MarkerStatus[];
    selectedItem: MarkerConfig | null;
    selectedItemData: SelectedItemData;
    selectedItemKey: string | null;
    isNewItem: boolean;
};

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
    header?: ReactNode
};

export type SelectedItemData = {
    name?: string;
    items: SelectedData[];
    item_count: number;
    is_current?: boolean;
    logs: Log[];
};

export enum EditorType {
    rule = 'rule',
    marker = 'marker',
}

export enum IndicatorType {
    disabled = 'disabled',
    invalid = 'invalid',
    enabled = 'enabled',
}

export function makeNewRule() : RuleConfig
{
    return {
        name: '',
        target: '',
        script: '',
        enabled: true,
    }
}


export function makeNewMarker() : MarkerConfig
{
    return {
        name: '',
        shape: SHAPES[0],
        color: COLORS[0],
        propagate: false
    }
}