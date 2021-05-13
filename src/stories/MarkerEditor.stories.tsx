import { BurgerMenu, Button, InnerPage, PageHeader } from '@kubevious/ui-components';
import { app } from '@kubevious/ui-framework';
import { Story } from '@storybook/react';
import React from 'react';
import { MarkerService } from '../../test/services/MarkerService';
import { useMarkerEditorActions } from '../hooks/useMarkerEditorActions';
import { MarkerEditor } from '../MarkerEditor';

export default {
    title: 'Marker Editor',
};

app.registerService({ kind: 'marker' }, () => {
    return new MarkerService();
});

export const Default: Story = () => {
    const { burgerMenuItems, createNewItem } = useMarkerEditorActions();

    return (
        <div style={{ background: '#2f3036', height: '100vh' }}>
            <InnerPage
                header={
                    <PageHeader title="Markers">
                        <div className="d-flex">
                            <BurgerMenu items={burgerMenuItems} />

                            <Button type="success" onClick={createNewItem} spacingLeft>
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
