import 'jest';

import React from 'react';
import { render } from '@testing-library/react';

import { RuleEditor } from '../src';
import { app } from '@kubevious/ui-framework';
import { RuleService } from './services/RuleService';

document.createRange = () => {
    const range = new Range();

    range.getBoundingClientRect = jest.fn();

    // @ts-ignore
    range.getClientRects = jest.fn(() => ({
        item: () => null,
        length: 0,
    }));

    return range;
};

const renderComponent = () => render(<RuleEditor />);

describe('RuleEditor', () => {
    beforeAll(() => {
        app.registerService({ kind: 'rule' }, () => {
            return new RuleService();
        });
    });

    test('should check that the component RuleEditor is rendered', async () => {
        const { findByTestId } = renderComponent();

        const ruleEditor = await findByTestId('rule-editor');

        expect(ruleEditor).toBeTruthy();
    });
});
