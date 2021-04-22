import { Story } from '@storybook/react';
import React from 'react';
import { Tabs } from '../components/Tabs';
import { Tab } from '../components/Tabs/Tab';

export default {
    title: 'Tabs',
};

export const Default: Story = () => (
    <div style={{ background: '#1e1e1e', color: 'white' }}>
        <Tabs>
            <Tab key="1" label="First">
                First
            </Tab>

            <Tab key="2" label="Second">
                Second
            </Tab>
        </Tabs>
    </div>
);
