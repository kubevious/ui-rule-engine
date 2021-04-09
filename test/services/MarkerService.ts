import _ from "the-lodash"
import { IMarkerService } from "@kubevious/ui-middleware"
import { MarkerResult, MarkerStatus } from "@kubevious/ui-middleware/dist/services/marker";

export class MarkerService implements IMarkerService {

    constructor() {
       
    }

    close()
    {

    }
    
    subscribeMarkerStatuses(cb: ((items: MarkerStatus[]) => void))
    {
      cb([]);
    }

    subscribeMarkerResult(cb: ((result: MarkerResult) => void))
    {
        return {
            update: (markerName : string) => {
             
                cb({
                    name: markerName,
                    items: [],
                    item_count: 0,
                    is_current: false,
                    logs: []
                })
            },
            close: () => {
            }
        }
    }

    backendFetchMarkerList(cb: (data: any) => any) : void {
        cb([{
            name: 'markerName',
            shape: 'f164',
            color: '#A5A5A5',
            items: [],
            logs: [],
            is_current: true,
        }])
    }

    backendFetchMarker(name: string, cb: (data: any) => any) : void {
        cb({
            name: name,
            shape: 'f164',
            color: '#A5A5A5',
            items: [],
            logs: [],
            is_current: true,
        })
    }

    backendCreateMarker(marker: any, name: string, cb: (data: any) => any) : void {
        console.log(marker);
        cb({
            name: name,
            shape: 'f164',
            color: '#A5A5A5',
            items: [],
            logs: [],
            is_current: true,
        })
    }

    backendDeleteMarker(name: string, cb: (data: any) => any) : void{
        console.log(name);
        cb({})
    }

    backendExportItems(cb: (data: any) => any) : void {
        cb([])
    }

    backendImportItems(markers: any, cb: (data: any) => any) : void {
        console.log(markers);
        cb({})
    }

}
