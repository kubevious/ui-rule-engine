import { MarkerConfig } from '@kubevious/ui-middleware/dist/services/marker';
import { RuleConfig } from '@kubevious/ui-middleware/dist/services/rule';
import { COLORS, SHAPES } from './constants';

export const isEmptyArray = (arr: any[]): boolean => !arr || arr.length === 0;

export const makeNewRule = (): RuleConfig => ({
    name: '',
    target: '',
    script: '',
    enabled: true,
});

export const makeNewMarker = (): MarkerConfig => ({
    name: '',
    shape: SHAPES[0],
    color: COLORS[0],
    propagate: false,
});
