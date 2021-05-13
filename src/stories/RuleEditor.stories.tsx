import { faFileDownload, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { BurgerMenu, Button, InnerPage, PageHeader } from '@kubevious/ui-components';
import { app } from '@kubevious/ui-framework';
import { sharedState } from '@kubevious/ui-framework/dist/global';
import { Story } from '@storybook/react';
import React from 'react';
import { RuleService } from '../../test/services/RuleService';
import { RuleEditor } from '../RuleEditor';
import { exportFile } from '../utils/exportFile';
import { uploadFile } from '../utils/uploadFile';

export default {
    title: 'Rule Editor',
};

app.registerService({ kind: 'rule' }, () => {
    return new RuleService();
});

export const Default: Story = () => {
    const service = app.serviceRegistry.resolveService({ kind: 'rule' });

    const burgerMenuItems = [
        {
            key: 'rule-export',
            text: 'Export rules',
            icon: faFileExport,
            action: () => exportFile({ service }),
        },
        {
            key: 'rule-import',
            text: 'Import rules',
            icon: faFileImport,
            action: () => uploadFile({ service, deleteExtra: false, selector: 'rule-import' }),
            isUploadFile: true,
        },
        {
            key: 'rule-replace',
            text: 'Replace rules',
            icon: faFileDownload,
            action: () => uploadFile({ service, deleteExtra: true, selector: 'rule-replace' }),
            isUploadFile: true,
        },
    ];

    const handleAddNewRule = () => {
        sharedState.set('rule_editor_selected_rule_key', null);
        sharedState.set('rule_editor_is_new_rule', true);
    };

    return (
        <div style={{ background: '#2f3036', height: '100vh' }}>
            <InnerPage
                header={
                    <PageHeader title="Rules">
                        <div className="d-flex">
                            <BurgerMenu items={burgerMenuItems} />

                            <Button type="success" onClick={handleAddNewRule} spacingLeft>
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
