import _ from 'the-lodash';
import { Promise } from 'the-promise';

import { IMarkerService } from '@kubevious/ui-middleware';
import {
    MarkerConfig,
    MarkerListItem,
    MarkerResult,
    MarkerResultItem,
    MarkersExportData,
    MarkerStatus,
} from '@kubevious/ui-middleware/dist/services/marker';

interface MarkerMockData
{
    config: MarkerConfig,
    items: MarkerResultItem[];
}

export class MarkerService implements IMarkerService {

    private _markers : Record<string, MarkerMockData> = {};

    constructor(empty?: boolean)
    {
        if (empty) {
            return;
        }
        
        for(let i = 1; i <= 50; i++)
        {
            const name = `marker ${i}`;

            const config : MarkerConfig = {
                name: name,
                shape: `f164`,
                color: '#A5A5A5',
                propagate: false
            }

            const items: MarkerResultItem[] = [];
            if ((i % 10) > 5) {
                for(let j = 1; j <= i * 5; j++)
                {
                    items.push({ 
                        dn: 'root/ns-[kube-system]'
                    });
                }
            }

            this._markers[name] = {
                config: config,
                items: items
            };
        }
    }

    getList(): Promise<MarkerListItem[]> {
        return Promise.resolve(_.values(this._markers).map(x => ({
            name: x.config.name,
            shape: x.config.shape,
            color: x.config.color
        })));
    }

    getItem(name: string): Promise<MarkerConfig> {
        return Promise.resolve()
            .then(() => {
                const item = this._markers[name];
                if (!item) {
                    throw new Error("zz");
                }
                return item.config;
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

    importItems(data: any): Promise<void> {
        console.log(data);
        return Promise.resolve();
    }

    getItemStatuses(): Promise<MarkerStatus[]> {
        return Promise.resolve(_.values(this._markers).map(x => ({
            name: x.config.name,
            shape: x.config.shape,
            color: x.config.color,
            item_count: x.items.length
        })));
    }

    getItemResult(name: string): Promise<MarkerResult> {
        return Promise.resolve()
            .then(() => {
                const item = this._markers[name];
                if (!item) {
                    throw new Error("xxx");
                }

                const result : MarkerResult = {
                    name: item.config.name,
                    items: item.items
                };
                return result;
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
