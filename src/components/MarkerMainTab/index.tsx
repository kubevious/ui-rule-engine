import React, { FC, useEffect, useMemo, useState } from 'react';
import { Input, Button, MarkerPreview } from '@kubevious/ui-components';
import { COLORS, SHAPES } from '../../constants';
import cx from 'classnames';
import { MarkerMainTabProps } from '../../types';

import styles from './styles.module.css';
import commonStyles from '../../common.module.css';
import { MarkerConfig } from '@kubevious/ui-middleware/dist/services/marker';
import { makeNewMarker } from '../../utils';
import { ChromePicker } from 'react-color';
import { ScrollbarComponent } from '@kubevious/ui-components/dist';

export const MarkerMainTab: FC<MarkerMainTabProps> = ({
    selectedItem,
    deleteItem,
    openSummary,
    createItem,
    saveItem,
    isNewItem = false,
}) => {
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
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
        <div className={styles.container}>
            {isNewItem && <div className={commonStyles.newItemTitle}>Create new marker</div>}

            <div>
                <Input
                    label="Name"
                    type="text"
                    value={name || ''}
                    name="name"
                    onChange={handleChange}
                    autoComplete="off"
                />
            </div>

            <div className={styles.markerIconWrapper}>
                <div className={styles.labelWrapper}>Icon</div>
                <div className={styles.markerArea}>
                    <ScrollbarComponent>
                        <div className={styles.itemsContents}>
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
                        </div>
                    </ScrollbarComponent>
                </div>
            </div>

            <div className={styles.markerColorWrapper}>
                <div className={cx(commonStyles.labelWrapper, 'd-flex')}>
                    Color
                    <div className="position-relative">
                        <button
                            className={styles.customColor}
                            onClick={() => setDisplayColorPicker(!displayColorPicker)}
                        >
                            Pick custom color
                        </button>
                        {displayColorPicker && (
                            <div className={styles.colorPopover}>
                                <div className={styles.cover} onClick={() => setDisplayColorPicker(false)} />
                                <ChromePicker onChange={(color) => handleChangeColor(color.hex)} color={color} />
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.markerArea}>
                    <ScrollbarComponent>
                        <div className={styles.itemsContents}>
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
                    </ScrollbarComponent>
                </div>

            </div>

            {!isNewItem && (
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <Button type="ghost" onClick={openSummary} spacingRight>
                            Cancel
                        </Button>
                        <Button onClick={() => saveItem(formData)} disabled={validation}>
                            Save
                        </Button>
                    </div>

                    <div>
                        <Button type="danger" onClick={() => deleteItem(formData)} bordered={false}>
                            Delete marker
                        </Button>
                    </div>
                </div>
            )}

            {isNewItem && (
                <div className="d-flex align-items-center">
                    <Button type="ghost" onClick={() => openSummary()} spacingRight>
                        Cancel
                    </Button>

                    <Button id="markerCreateButton" onClick={() => createItem(formData)} disabled={validation}>
                        Create
                    </Button>
                </div>
            )}
        </div>
    );
};
