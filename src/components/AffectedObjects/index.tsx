import React, { FC } from 'react';
import { DnShortcutComponent } from '@kubevious/ui-components';
import { SelectedItemData } from '../../types';

export interface AffectedObjectsProps {
    selectedItemData: SelectedItemData;
}

export const AffectedObjects: FC<AffectedObjectsProps> = ({ selectedItemData }) => (
    <>
        {selectedItemData.items.map((item, index) => (
            <DnShortcutComponent
                key={index}
                dn={item.dn}
                markers={item.markers}
                errors={item.errors}
                warnings={item.warnings}
            />
        ))}
    </>
);
