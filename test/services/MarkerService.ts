import _ from "the-lodash"
import { IMarkerService } from "@kubevious/ui-middleware"
import { MarkerConfig, MarkerListItem, MarkerResult, MarkersExportData, MarkerStatus } from "@kubevious/ui-middleware/dist/services/marker";

export class MarkerService implements IMarkerService {


    getMarkerList(): Promise<MarkerListItem[]> {
        return Promise.resolve([{
            name: 'markerName',
            shape: 'f164',
            color: '#A5A5A5'
        }])
    }

    getMarker(name: string): Promise<MarkerConfig> {
        return Promise.resolve({
            name: name,
            shape: 'f164',
            color: '#A5A5A5',
            propagate: false
        })
    }

    createMarker(config: MarkerConfig, name: string): Promise<MarkerConfig> {
        console.log(config);
        return Promise.resolve({
            name: name,
            shape: 'f164',
            color: '#A5A5A5',
            propagate: false
        })
    }

    deleteMarker(name: string): Promise<void> {
        console.log(name);
        return Promise.resolve();
    }

    exportMarkers(): Promise<MarkersExportData> {
        return Promise.resolve({
            kind: 'markers',
            items: []
        });
    }

    importMarkers(data: MarkersExportData): Promise<void> {
        console.log(data);
        return Promise.resolve();
    }

    getMarkerStatuses(): Promise<MarkerStatus[]> {
        return Promise.resolve([])
    }
    
    getMarkerResult(name: string): Promise<MarkerResult> {
        return Promise.resolve({
            name: name,
            items: [],
        })
    }

    backendExportItems(cb: (data: any) => any) : void {
        cb([])
    }

    backendImportItems(markers: any, cb: (data: any) => any) : void {
        console.log(markers);
        cb({})
    }
    
    subscribeMarkerStatuses(cb: ((items: MarkerStatus[]) => void))
    {
        return this.getMarkerStatuses()
            .then(result => cb(result));
    }

    subscribeMarkerResult(cb: ((result: MarkerResult) => void))
    {
        return {
            update: (markerName : string) => {
             
                return this.getMarkerResult(markerName)
                    .then(result => cb(result));
            },
            close: () => {
            }
        }
    }

    close()
    {

    }   


}
