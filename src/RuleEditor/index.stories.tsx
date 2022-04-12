import { BurgerMenu, Button, InnerPage, PageHeader } from '@kubevious/ui-components';
import { app } from '@kubevious/ui-framework';
import { Story } from '@storybook/react';
import React, { useEffect } from 'react';
import { RuleService } from '../../test/services/RuleService';
import { useRuleEditorActions } from '../hooks/useRuleEditorActions';

import { RuleEditor } from './';

export default {
    title: 'Rule Editor',
    component: RuleEditor
};



export const ComponentOnly: Story = () => {
    app.registerService({ kind: 'rule' }, () => {
        return new RuleService();
    });

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <RuleEditor />
        </div>
    );
};

export const Default: Story = () => {
    const { burgerMenuItems, createNewItem } = useRuleEditorActions();

    app.registerService({ kind: 'rule' }, () => {
        return new RuleService();
    });

    return (
        <div style={{ minHeight: '100vh', maxWidth: '100vw', width: '100vw', height: '100vh', background: 'black' }}>
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
                fullHeight
            >
                <RuleEditor />
            </InnerPage>
        </div>
    );
};



export const WithPadding: Story = () => {

    app.registerService({ kind: 'rule' }, () => {
        return new RuleService();
    });

    return (
        <div style={{ minHeight: '100vh', maxWidth: '100vw', width: '100vw', height: '100vh', background: 'red' }}>
            <div style={{ padding: '50px', height: '100%', width: '100%' }}>
                <RuleEditor />
            </div>
        </div>
    );
};


export const EmptyList: Story = () => {
    const { createNewItem } = useRuleEditorActions();

    app.registerService({ kind: 'rule' }, () => {
        return new RuleService(true);
    });

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
