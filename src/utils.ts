import { MarkerConfig } from "@kubevious/ui-middleware/dist/services/marker";
import { RuleConfig } from "@kubevious/ui-middleware/dist/services/rule";
import { COLORS, SHAPES } from "./constants";

export const isEmptyArray = (arr: any[]): boolean => {
    return !arr || arr.length === 0;
};

export const isEmptyObject = (obj: {}): boolean => {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
};

export function makeNewRule() : RuleConfig
{
    return {
        name: '',
        target: '',
        script: '',
        enabled: true,
    }
}


export function makeNewMarker() : MarkerConfig
{
    return {
        name: '',
        shape: SHAPES[0],
        color: COLORS[0],
        propagate: false
    }
}