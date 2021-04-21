import React, { FC } from 'react';

export interface MarkerPreviewProps {
    shape?: string;
    color?: string;
}

export const MarkerPreview: FC<MarkerPreviewProps> = ({ shape, color }) => (
    <i
        data-testid="marker-preview"
        className="fa"
        style={{ color: color }}
        dangerouslySetInnerHTML={{ __html: `&#x${shape};` }}
    />
);
