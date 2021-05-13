import React, { FC, useEffect } from 'react';
import { BurgerMenuItem } from '@kubevious/ui-components/dist/BurgerMenu/types';
import { faFileDownload, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { useService, useSharedState } from '@kubevious/ui-framework/dist';

import { exportFile } from '../utils/exportFile';
import { uploadFile } from '../utils/uploadFile';

export class MarkerEditorMenuActions {
    burgerMenus: BurgerMenuItem[] = [];
    createNewItem: () => void = () => {};
}

export interface MarkerEditorMenuSetupProps {
    setup: (actions: MarkerEditorMenuActions) => void;
}

export const MarkerEditorMenuSetup: FC<MarkerEditorMenuSetupProps> = ({ setup }) => {
    const service = useService({ kind: 'marker' });
    const sharedState = useSharedState();

    useEffect(() => {
        const burgerMenuItems = [
            {
                key: 'marker-export',
                text: 'Export markers',
                icon: faFileExport,
                action: () => exportFile({ service }),
            },
            {
                key: 'marker-import',
                text: 'Import markers',
                icon: faFileImport,
                action: () => uploadFile({ service, deleteExtra: false, selector: 'marker-import' }),
                isUploadFile: true,
            },
            {
                key: 'marker-replace',
                text: 'Replace markers',
                icon: faFileDownload,
                action: () => uploadFile({ service, deleteExtra: true, selector: 'marker-replace' }),
                isUploadFile: true,
            },
        ];

        const handleAddNewMarker = () => {
            sharedState?.set('marker_editor_selected_marker_key', null);
            sharedState?.set('marker_editor_is_new_marker', true);
        };

        setup({
            burgerMenus: burgerMenuItems,
            createNewItem: handleAddNewMarker,
        });
    }, [service, sharedState]);

    return <></>;
};
