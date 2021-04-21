import { app } from '@kubevious/ui-framework';
import { Story } from '@storybook/react';
import React from 'react';
import { RuleService } from '../../test/services/RuleService';
import { MarkerEditor } from '../MarkerEditor';

export default {
    title: 'Marker Editor',
};

app.registerService({ kind: 'marker' }, () => {
    return new RuleService();
});

export const Default: Story = () => (
    <div style={{ background: '#1e1e1e', height: '730px' }}>
        <MarkerEditor />
    </div>
);
