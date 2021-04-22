import { BurgerMenuItem } from '@kubevious/ui-components/dist/BurgerMenu/types';

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
    selectedItem: EditorItem;
    selectedItemData: SelectedItemData;
    saveItem: (data: EditorItem) => void;
    deleteItem: (data: EditorItem) => void;
    createItem: (data: EditorItem) => void;
    openSummary: () => void;
    selectedItemId: string;
    isSuccess: boolean;
    isNewItem?: boolean;
};

export type RuleEditorState = {
    items: EditorItem[];
    selectedItemData: SelectedItemData;
    selectedItem: EditorItem;
    selectedItemId: string;
    isSuccess: boolean;
    isNewItem: boolean;
};

export type MarkerMainTabProps = {
    selectedItem: EditorItem;
    saveItem: (data: EditorItem) => void;
    deleteItem: (data: EditorItem) => void;
    createItem: (data: EditorItem) => void;
    openSummary: () => void;
    isSuccess: boolean;
};

export type MarkerEditorState = {
    items: EditorItem[];
    selectedItem: EditorItem;
    selectedItemData: SelectedItemData;
    selectedItemId: string;
    isSuccess: boolean;
    isNewItem: boolean;
};

export type SiderProps = {
    type: string;
    items: EditorItem[];
    selectedItemId: string;
    selectItem: (marker: EditorItem) => void;
    createNewItem: () => void;
    burgerMenuItems: BurgerMenuItem[];
};

export type EditorProps = {
    type: string;
    items: EditorItem[];
    isNewItem: boolean;
    selectedItem: EditorItem;
    selectedItemData: SelectedItemData;
    selectedItemId: string;
    createNewItem: () => void;
    saveItem: (data: EditorItem) => void;
    deleteItem: (data: EditorItem) => void;
    createItem: (data: EditorItem) => void;
    openSummary: () => void;
    isSuccess: boolean;
};

export type SelectedItemData = {
    name?: string;
    items: SelectedData[];
    item_count: number;
    is_current?: boolean;
    logs: Log[];
};

export type EditorItem = {
    script?: string;
    target?: string;
    name?: string;
    propagate?: boolean;
    shape?: string;
    color?: string;
    item_count?: number;
    error_count?: number;
    enabled?: boolean;
    is_current?: boolean;
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

export type ExportItem = {
    kind: string;
    items: EditorItem[];
};
