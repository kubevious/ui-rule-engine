import React, { useEffect, useMemo, useState } from 'react';
import { COLORS, SHAPES } from '../constants';
import { ChromePicker } from 'react-color';
import cx from 'classnames';
import { MarkerPreview } from '../MarkerPreview';
import { EditorItem, MarkerMainTabProps } from '../types';
import styles from './styles.scss';

export const MarkerMainTab: React.FunctionComponent<MarkerMainTabProps> = ({
    selectedItem,
    isSuccess,
    deleteItem,
    openSummary,
    createItem,
    saveItem,
}) => {
    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
    const [formData, setFormData] = useState<EditorItem>(selectedItem);

    useEffect(() => {
        setFormData({ ...selectedItem });
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
            <div className={styles.fieldName}>
                <div className={styles.labelWrapper}>
                    <label>Name</label>
                </div>
                <div className={styles.nameWrapper}>
                    <div className={`${styles.markerArea} ${styles.nameArea}`}>
                        <div className={styles.shape}>
                            <MarkerPreview shape={shape || ''} color={color || ''} />
                        </div>
                        <input
                            type="text"
                            className={`${styles.fieldInput} ${styles.marker} ${styles.name}`}
                            value={name || ''}
                            name="name"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.markerInfoWrapper}>
                <div className={styles.field}>
                    <div className={styles.labelWrapper}>
                        <label>Shape</label>
                    </div>
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
                    <div className={`${styles.labelWrapper} ${styles.color}`}>
                        <label>Color</label>
                        <button className={styles.customColor} onClick={() => setDisplayColorPicker(!displayColorPicker)}>
                            Pick custom color
                        </button>
                        {displayColorPicker && (
                            <div className={styles.colorPopover}>
                                <div className={styles.cover} onClick={() => setDisplayColorPicker(false)} />
                                <ChromePicker onChange={(color) => handleChangeColor(color.hex)} color={color} />
                            </div>
                        )}
                    </div>
                    <div className={styles.markerArea}>
                        <div className={styles.areaWrapper}>
                            {COLORS.map((item, index) => (
                                <div
                                    className={cx(styles.markerWrapper, item === color && styles.selectedMarkerWrapper)}
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

            <div className={styles.btnGroup}>
                {selectedItem.name && (
                    <>
                        <button className={styles.button} onClick={() => deleteItem(formData)}>
                            Delete
                        </button>
                        <button className={styles.button} onClick={() => openSummary()}>
                            Cancel
                        </button>
                        <button
                            className={`${styles.button} ${styles.success} ${styles.marker}`}
                            onClick={() => saveItem(formData)}
                            disabled={validation}
                        >
                            Save
                        </button>
                        {isSuccess && <span>Saved!</span>}
                    </>
                )}

                {!selectedItem.name && (
                    <>
                        <button className={styles.button} onClick={() => openSummary()}>
                            Cancel
                        </button>
                        <button
                            className={`${styles.button} ${styles.success} ${styles.marker}`}
                            onClick={() => createItem(formData)}
                            disabled={validation}
                        >
                            Create
                        </button>
                    </>
                )}
            </div>
        </>
    );
};
