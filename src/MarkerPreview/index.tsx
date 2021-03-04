import React from "react"

export const MarkerPreview = ({
    shape,
    color,
}: {
    shape?: string
    color?: string
}): JSX.Element => {
    return (
        <i
            data-testid="marker-preview"
            className="fa"
            style={{ color: color }}
            dangerouslySetInnerHTML={{ __html: `&#x${shape};` }}
        />
    )
}
