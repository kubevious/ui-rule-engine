import { IMarkerService } from '@kubevious/ui-middleware';
import {
    MarkerConfig,
    MarkerListItem,
    MarkerResult,
    MarkersExportData,
    MarkerStatus,
} from '@kubevious/ui-middleware/dist/services/marker';

export class MarkerService implements IMarkerService {
    getList(): Promise<MarkerListItem[]> {
        return Promise.resolve([
            {
                name: 'markerName',
                shape: 'f164',
                color: '#A5A5A5',
            },
        ]);
    }

    getItem(name: string): Promise<MarkerConfig> {
        return Promise.resolve({
            name: name,
            shape: 'f164',
            color: '#A5A5A5',
            propagate: false,
        });
    }

    createItem(config: MarkerConfig, name: string): Promise<MarkerConfig> {
        console.log(config);
        return Promise.resolve({
            name: name,
            shape: 'f164',
            color: '#A5A5A5',
            propagate: false,
        });
    }

    deleteItem(name: string): Promise<void> {
        console.log(name);
        return Promise.resolve();
    }

    exportItems(): Promise<MarkersExportData> {
        return Promise.resolve({
            kind: 'markers',
            items: [],
        });
    }

    importItems(data): Promise<void> {
        console.log(data);
        return Promise.resolve();
    }

    getItemStatuses(): Promise<MarkerStatus[]> {
        return Promise.resolve([]);
    }

    getItemResult(name: string): Promise<MarkerResult> {
        return Promise.resolve({
            name: name,
            items: [],
        });
    }

    backendExportItems(cb: (data: any) => any): void {
        cb([]);
    }

    backendImportItems(markers: any, cb: (data: any) => any): void {
        console.log(markers);
        cb({});
    }

    subscribeItemStatuses(cb: (items: MarkerStatus[]) => void) {
        return this.getItemStatuses().then((result) => cb(result));
    }

    subscribeItemResult(cb: (result: MarkerResult) => void) {
        return {
            update: (markerName: string | null) => {
                if (markerName) {
                    this.getItemResult(markerName).then((result) => cb(result));
                }
            },
            close: () => {},
        };
    }

    close() {}
}
