import 'jest';

import React from 'react';
import { render } from '@testing-library/react';

import { app } from '@kubevious/ui-framework';
import { MarkerEditor } from '../src';
import { MarkerService } from './services/MarkerService';

function renderMarkerEditor() {
    return render(<MarkerEditor />);
}

describe('MarkerEditor', () => {

    beforeAll(() => {
        app.registerService({ kind: 'marker'}, () => {
            return new MarkerService();
        })
    })

    test('Should check that the component MarkerEditor is rendered', async () => {
        const { findByTestId } = renderMarkerEditor();

        const markerEditor = await findByTestId('marker-editor');

        expect(markerEditor);
    });
});
