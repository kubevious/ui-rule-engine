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


export const WithHeader: Story = () => {
    const { createNewItem } = useMarkerEditorActions();

    return (
        <div style={{ background: '#2f3036', height: '100vh' }}>
            <MarkerEditor itemListHeader={
                <Button type="success" onClick={createNewItem} spacingLeft>
                    Add New Marker
                </Button>} 
            />
        </div>
    );
};


export const WithPadding: Story = () => {
    return (
        <div style={{ minHeight: '100vh', maxWidth: '100vw', width: '100vw', height: '100vh', background: 'red' }}>
            <div style={{ padding: '50px', height: '100%', width: '100%' }}>
                <MarkerEditor />
            </div>
        </div>
    );
};
