import { MarkerConfig, MarkerResult, MarkerStatus } from '@kubevious/ui-middleware/dist/services/marker';
import { RuleConfig, RuleResult, RuleStatus } from '@kubevious/ui-middleware/dist/services/rule';

export type RuleMainTabProps = {
    selectedItem?: RuleConfig;
    selectedItemData?: RuleResult;
    saveItem: (data: RuleConfig) => void;
    deleteItem: (data: RuleConfig) => void;
    createItem: (data: RuleConfig) => void;
    openSummary: () => void;
    isNewItem?: boolean;
};

export type RuleEditorState = {
    items: RuleStatus[];
    selectedItemData: RuleResult;
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
    isNewItem?: boolean;
};

export type MarkerEditorState = {
    items: MarkerStatus[];
    selectedItem: MarkerConfig | null;
    selectedItemData: MarkerResult;
    selectedItemKey: string | null;
    isNewItem: boolean;
};

export enum IndicatorType {
    disabled = 'disabled',
    invalid = 'invalid',
    enabled = 'enabled',
}
