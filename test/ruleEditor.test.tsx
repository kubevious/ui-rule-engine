import 'jest';

import React from 'react';
import { render } from '@testing-library/react';

import { RuleEditor } from '../src';
import { app } from '@kubevious/ui-framework';
import { RuleService } from './services/RuleService';

function renderRuleEditor() {
    return render(<RuleEditor />);
}

describe('RuleEditor', () => {

    beforeAll(() => {
        app.registerService({ kind: 'rule'}, () => {
            return new RuleService();
        })
    })

    test('Should check that the component RuleEditor is rendered', async () => {
        const { findByTestId } = renderRuleEditor();

        const ruleEditor = await findByTestId('rule-editor');

        expect(ruleEditor);
    });
});
