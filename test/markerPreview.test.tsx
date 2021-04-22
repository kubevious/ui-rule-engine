import 'jest';

import React from 'react';
import { render } from '@testing-library/react';

import { MarkerPreview } from '../src';

const renderComponent = () => render(<MarkerPreview />);

describe('MarkerPreview', () => {
    test('should check that the component MarkerPreview is rendered', async () => {
        const { findByTestId } = renderComponent();

        const markerPreview = await findByTestId('marker-preview');

        expect(markerPreview).toBeTruthy();
    });
});
