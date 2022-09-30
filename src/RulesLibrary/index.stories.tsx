import { Story } from '@storybook/react';
import React from 'react';

import { RulesLibrary } from './';

export default {
    title: 'Rules Library',
    component: RulesLibrary
};

export const RulesLibraryStory: Story = () => {

    return <div style={{ background: 'black', margin: '20px', padding: '20px', height: '800px' }}>
        <RulesLibrary
            />
    </div>
};