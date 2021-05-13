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
        <div style={{ background: '#2f3036', height: '100vh' }}>
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
    );
};
