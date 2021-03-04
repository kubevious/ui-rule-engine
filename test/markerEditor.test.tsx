import 'jest';

import React from 'react';
import { render } from '@testing-library/react';

import { MarkerEditor } from '../src';

function renderMarkerEditor() {
    return render(<MarkerEditor />);
}

describe('MarkerEditor', () => {
    test('Should check that the component MarkerEditor is rendered', async () => {
        const { findByTestId } = renderMarkerEditor();

        const markerEditor = await findByTestId('marker-editor');

        expect(markerEditor);
    });
});
