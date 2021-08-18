import { BurgerMenu, Button, InnerPage, PageHeader } from '@kubevious/ui-components';
import { app } from '@kubevious/ui-framework';
import { Story } from '@storybook/react';
import React from 'react';
import { RuleService } from '../../test/services/RuleService';
import { useRuleEditorActions } from '../hooks/useRuleEditorActions';
import { RuleEditor } from '../RuleEditor';

export default {
    title: 'Rule Editor',
};

app.registerService({ kind: 'rule' }, () => {
    return new RuleService();
});

export const Default: Story = () => {
    const { burgerMenuItems, createNewItem } = useRuleEditorActions();

    return (
        <div style={{ minHeight: '100vh', maxWidth: '100vw', width: '100vw', height: '100vh' }}>
            <div style={{ background: '#2f3036', height: '100%', width: '100%', position: 'relative' }}>
                <InnerPage
                    header={
                        <PageHeader title="Rules">
                            <div className="d-flex">
                                <BurgerMenu items={burgerMenuItems} />

                                <Button type="success" onClick={createNewItem} spacingLeft>
                                    Add New Rule
                                </Button>
                            </div>
                        </PageHeader>
                    }
                >
                    <RuleEditor />
                </InnerPage>
            </div>
        </div>
    );
};


export const WithHeader: Story = () => {
    const { createNewItem } = useRuleEditorActions();

    return (
        <div style={{ minHeight: '100vh', maxWidth: '100vw', width: '100vw', height: '100vh' }}>
            <div style={{ background: '#2f3036', height: '100%', width: '100%', position: 'relative' }}>
                <RuleEditor itemListHeader={
                    <Button type="success" onClick={createNewItem} spacingLeft>
                        Add New Rule
                    </Button>} 
                />
            </div>
        </div>
    );
};
