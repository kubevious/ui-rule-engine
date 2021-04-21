import { app } from '@kubevious/ui-framework';
import { Story } from '@storybook/react';
import React from 'react';
import { RuleService } from '../../test/services/RuleService';
import { RuleEditor } from '../RuleEditor';

export default {
    title: 'Rule Editor',
};

app.registerService({ kind: 'rule' }, () => {
    return new RuleService();
});

export const Default: Story = () => (
    <div style={{ background: '#1e1e1e', height: '730px' }}>
        <RuleEditor />
    </div>
);
