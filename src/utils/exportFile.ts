import { IMarkerService, IRuleService } from '@kubevious/ui-middleware/dist';
import { MarkersExportData } from '@kubevious/ui-middleware/dist/services/marker';
import { RulesExportData } from '@kubevious/ui-middleware/dist/services/rule';

export const exportFile = ({ service }: { service: undefined | IRuleService | IMarkerService }): void => {
    service?.exportItems().then((response: RulesExportData | MarkersExportData) => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response));
        const exportElem: HTMLElement | null = document.getElementById('exportAnchor');

        if (exportElem) {
            exportElem.setAttribute('href', dataStr);
            exportElem.setAttribute('download', `${response.kind}.json`);
            exportElem.click();
        }
    });
};
