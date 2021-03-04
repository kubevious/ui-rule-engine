import 'jest';

import React from 'react';
import { render } from '@testing-library/react';

import { MarkerPreview } from '../src';

function renderMarkerPreview() {
    return render(<MarkerPreview />);
}

describe('MarkerPreview', () => {
    test('Should check that the component MarkerPreview is rendered', async () => {
        const { findByTestId } = renderMarkerPreview();

        const markerPreview = await findByTestId('marker-preview');

        expect(markerPreview);
    });
});
