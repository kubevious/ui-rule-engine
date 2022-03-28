import { FASolidIcons } from '@kubevious/ui-components';
import { BurgerMenuItem } from '@kubevious/ui-components/dist/BurgerMenu/types';
import { useService, useSharedState } from '@kubevious/ui-framework';
import { IMarkerService } from '@kubevious/ui-middleware/dist';
import { exportFile } from '../utils/exportFile';
import { uploadFile } from '../utils/uploadFile';

export interface MarkerEditorMenuActions {
    burgerMenuItems: BurgerMenuItem[];
    createNewItem: () => void;
}

export const useMarkerEditorActions = (): MarkerEditorMenuActions => {
    const service: IMarkerService | undefined = useService({ kind: 'marker' });
    const sharedState = useSharedState();

    const handleAddNewMarker = () => {
        sharedState?.set('marker_editor_selected_marker_key', null);
        sharedState?.set('marker_editor_is_new_marker', true);
    };

    const burgerMenuItems = [
        {
            key: 'marker-export',
            text: 'Export markers',
            icon: FASolidIcons.faFileExport,
            action: () => exportFile({ service }),
        },
        {
            key: 'marker-import',
            text: 'Import markers',
            icon: FASolidIcons.faFileImport,
            action: () => uploadFile({ service, deleteExtra: false, selector: 'marker-import' }),
            isUploadFile: true,
        },
        {
            key: 'marker-replace',
            text: 'Replace markers',
            icon: FASolidIcons.faFileDownload,
            action: () => uploadFile({ service, deleteExtra: true, selector: 'marker-replace' }),
            isUploadFile: true,
        },
    ];

    return { burgerMenuItems, createNewItem: handleAddNewMarker };
};
