import { faFileDownload, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { BurgerMenuItem } from '@kubevious/ui-components/dist/BurgerMenu/types';
import { useService, useSharedState } from '@kubevious/ui-framework';
import { exportFile } from '../utils/exportFile';
import { uploadFile } from '../utils/uploadFile';

export interface RuleEditorMenuActions {
    burgerMenuItems: BurgerMenuItem[];
    createNewItem: () => void;
}

export const useRuleEditorActions = (): RuleEditorMenuActions => {
    const service = useService({ kind: 'rule' });
    const sharedState = useSharedState();

    const handleAddNewRule = () => {
        sharedState?.set('rule_editor_selected_rule_key', null);
        sharedState?.set('rule_editor_is_new_rule', true);
    };

    const burgerMenuItems = [
        {
            key: 'rule-export',
            text: 'Export rules',
            icon: faFileExport,
            action: () => exportFile({ service }),
        },
        {
            key: 'rule-import',
            text: 'Import rules',
            icon: faFileImport,
            action: () => uploadFile({ service, deleteExtra: false, selector: 'rule-import' }),
            isUploadFile: true,
        },
        {
            key: 'rule-replace',
            text: 'Replace rules',
            icon: faFileDownload,
            action: () => uploadFile({ service, deleteExtra: true, selector: 'rule-replace' }),
            isUploadFile: true,
        },
    ];

    return { burgerMenuItems, createNewItem: handleAddNewRule };
};
