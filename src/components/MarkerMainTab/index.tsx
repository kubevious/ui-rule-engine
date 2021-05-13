import { Input } from '@kubevious/ui-components';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { COLORS, SHAPES } from '../../constants';
import cx from 'classnames';
import { MarkerPreview } from '../../MarkerPreview';
import { MarkerMainTabProps } from '../../types';

import styles from './styles.module.css';
import commonStyles from '../../common.module.css';
import { Button } from '@kubevious/ui-components/dist';
import { MarkerConfig } from '@kubevious/ui-middleware/dist/services/marker';
import { makeNewMarker } from '../../utils';

export const MarkerMainTab: FC<MarkerMainTabProps> = ({
    selectedItem,
    deleteItem,
    openSummary,
    createItem,
    saveItem,
    isNewItem = false,
}) => {
    const [formData, setFormData] = useState<MarkerConfig>(makeNewMarker());

    useEffect(() => {
        if (selectedItem) {
            setFormData(selectedItem);
        } else {
            setFormData(makeNewMarker());
        }
    }, [selectedItem]);

    const { name, color, shape } = formData;

    const validation = useMemo(() => formData.name === '', [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangeShape = (name: string): void => {
        setFormData({ ...formData, shape: name });
    };

    const handleChangeColor = (color: string): void => {
        setFormData({ ...formData, color: color });
    };

    return (
        <>
            {isNewItem && <div className={commonStyles.newItemTitle}>Create new marker</div>}

            <div className={styles.field}>
                <Input
                    label="Name"
                    type="text"
                    id="fieldInput"
                    value={name || ''}
                    name="name"
                    onChange={handleChange}
                />
            </div>

            <div className={styles.markerInfoWrapper}>
                <div className={styles.field}>
                    <div className={commonStyles.labelWrapper}>Icon</div>
                    <div className={styles.markerArea}>
                        <div className={styles.areaWrapper}>
                            {SHAPES.map((item, index) => (
                                <div
                                    className={cx(styles.markerWrapper, item === shape && styles.selectedMarkerWrapper)}
                                    key={`${item}-${index}`}
                                    onClick={() => handleChangeShape(item)}
                                >
                                    <div key={item} style={{ color: color }} className={styles.iconWrapper}>
                                        <MarkerPreview shape={item} color={color || ''} />
                                    </div>
                                </div>
                            ))}
                            <span className={styles.empty} />
                        </div>
                    </div>
                </div>

                <div className={styles.field}>
                    <div className={commonStyles.labelWrapper}>Color</div>
                    <div className={styles.markerArea}>
                        <div className={styles.areaWrapper}>
                            {COLORS.map((item, index) => (
                                <div
                                    className={cx(styles.markerWrapper, {
                                        [styles.selectedMarkerWrapper]: item === color,
                                    })}
                                    key={index}
                                    onClick={() => handleChangeColor(item)}
                                >
                                    <div style={{ color: color }} className={styles.iconWrapper}>
                                        <MarkerPreview shape={shape || ''} color={item} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center justify-content-between">
                {!isNewItem && (
                    <>
                        <div className="d-flex">
                            <div className="me-3">
                                <Button type="ghost" onClick={openSummary}>
                                    Cancel
                                </Button>
                            </div>
                            <Button onClick={() => saveItem(formData)} disabled={validation}>
                                Save
                            </Button>
                        </div>

                        <div>
                            <Button type="danger" onClick={() => deleteItem(formData)}>
                                Delete
                            </Button>
                        </div>
                    </>
                )}

                {isNewItem && (
                    <div className="d-flex">
                        <div className="me-3">
                            <Button type="ghost" onClick={() => openSummary()}>
                                Cancel
                            </Button>
                        </div>
                        <Button id="markerCreateButton" onClick={() => createItem(formData)} disabled={validation}>
                            Create
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};
