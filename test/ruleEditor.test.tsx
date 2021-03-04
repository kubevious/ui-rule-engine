import 'jest';

import React from 'react';
import { render } from '@testing-library/react';

import { RuleEditor } from '../src';

function renderRuleEditor() {
    return render(<RuleEditor />);
}

describe('RuleEditor', () => {
    test('Should check that the component RuleEditor is rendered', async () => {
        const { findByTestId } = renderRuleEditor();

        const ruleEditor = await findByTestId('rule-editor');

        expect(ruleEditor);
    });
});
