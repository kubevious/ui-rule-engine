import React, { useState } from 'react';
import styles from './styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faFileDownload, faFileExport, faFileImport } from '@fortawesome/free-solid-svg-icons';
import cx from 'classnames';
import { IMarkerService, IRuleService } from '@kubevious/ui-middleware';
import { ExportItem } from '../types';

export const BurgerMenu = ({
    type,
    service,
}: {
    type: string;
    service?: IMarkerService | IRuleService;
}): JSX.Element => {
    const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
    const [deleteExtra, setDeleteExtra] = useState<boolean>(false);

    const exportItems = (): void => {
        service && service.backendExportItems((response: ExportItem) => {
            const dataStr: string = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response));
            const exportElem: HTMLElement | null = document.getElementById('exportAnchor');
            if (exportElem) {
                exportElem.setAttribute('href', dataStr);
                exportElem.setAttribute('download', `${response.kind}.json`);
                exportElem.click();
            }
        });
    };

    const uploadFile = (): void => {
        const input = document.getElementById(`upload-${type}`) as HTMLInputElement;

        if (input?.files?.length === 0) {
            console.error('No file selected.');
            return;
        }

        const reader: FileReader = new FileReader();

        reader.onload = () => {
            const importData: {
                data: {};
                deleteExtra: boolean;
            } = {
                // @ts-ignore: Unreachable code error
                data: JSON.parse(reader.result),
                deleteExtra,
            };
            service && service.backendImportItems(importData, () => {
                input.value = '';
            });
        };

        input.files && reader.readAsText(input.files[0]);
    };

    return (
        <div
            data-testid="burger-menu"
            className={styles.burgerMenuContainer}
            onMouseEnter={() => setIsMenuVisible(true)}
            onMouseLeave={() => setIsMenuVisible(false)}
        >
            <input type="file" id={`upload-${type}`} name={`upload-${type}`} onChange={() => uploadFile()} />

            <div className={cx(styles.buttonWrapper, isMenuVisible && styles.hovered)}>
                <FontAwesomeIcon icon={faBars} />
            </div>

            <div className={cx(styles.menu, !isMenuVisible && styles.hidden)}>
                <a id="exportAnchor" style={{ display: 'none' }} />

                <div className={styles.menuItem} onClick={() => exportItems()}>
                    <div className={styles.icon}>
                        <FontAwesomeIcon icon={faFileExport} />
                    </div>
                    Export {type}s
                </div>
                <div className={styles.menuItem}>
                    <label htmlFor={`upload-${type}`} onClick={() => setDeleteExtra(false)}>
                    <div className={styles.icon}>
                            <FontAwesomeIcon icon={faFileImport} />
                        </div>
                        Import {type}s
                    </label>
                </div>
                <div className={styles.menuItem}>
                    <label htmlFor={`upload-${type}`} onClick={() => setDeleteExtra(true)}>
                    <div className={styles.icon}>
                            <FontAwesomeIcon icon={faFileDownload} />
                        </div>
                        Replace {type}s
                    </label>
                </div>
            </div>
        </div>
    );
};
