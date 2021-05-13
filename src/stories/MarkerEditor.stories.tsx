import { faFileDownload, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { BurgerMenu, Button, InnerPage, PageHeader } from '@kubevious/ui-components';
import { app } from '@kubevious/ui-framework';
import { sharedState } from '@kubevious/ui-framework/dist/global';
import { Story } from '@storybook/react';
import React from 'react';
import { MarkerService } from '../../test/services/MarkerService';
import { MarkerEditor } from '../MarkerEditor';
import { exportFile } from '../utils/exportFile';
import { uploadFile } from '../utils/uploadFile';

export default {
    title: 'Marker Editor',
};

app.registerService({ kind: 'marker' }, () => {
    return new MarkerService();
});

export const Default: Story = () => {
    const service = app.serviceRegistry.resolveService({ kind: 'marker' });

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
        sharedState.set('marker_editor_selected_marker_key', null);
        sharedState.set('marker_editor_is_new_marker', true);
    };

    return (
        <div style={{ background: '#2f3036', height: '100vh' }}>
            <InnerPage
                header={
                    <PageHeader title="Markers">
                        <div className="d-flex">
                            <BurgerMenu items={burgerMenuItems} />

                            <Button type="success" onClick={handleAddNewMarker} spacingLeft>
                                Add New Marker
                            </Button>
                        </div>
                    </PageHeader>
                }
            >
                <MarkerEditor />
            </InnerPage>
        </div>
    );
};
