import 'jest';

import React from 'react';
import { render } from '@testing-library/react';

import { BurgerMenu } from '../src';

function renderBurgerMenu() {
    return render(<BurgerMenu type="test" />);
}

describe('BurgerMenu', () => {
    test('Should check that the component BurgerMenu is rendered', async () => {
        const { findByTestId } = renderBurgerMenu();

        const burgerMenu = await findByTestId('burger-menu');

        expect(burgerMenu);
    });
});
