import _ from 'the-lodash';
import { app } from '@kubevious/ui-framework';
import { MarkerConfig } from '@kubevious/ui-middleware/dist/services/marker';

export const MARKER_FOO = 'foo';
export const MARKER_BAR = 'bar';

export const MARKER_LIST : MarkerConfig[] = [];

const SHAPE_OPTIONS = [ 'f164', 'f135', 'f165' ];
const COLOR_OPTIONS = [ '#D5CEC2', '#11E7E9' ];

for(let i = 0; i <= 50; i++)
{
    MARKER_LIST.push({
        name: `marker ${i}`,
        shape: SHAPE_OPTIONS[i % SHAPE_OPTIONS.length],
        color: COLOR_OPTIONS[i % COLOR_OPTIONS.length],
        propagate: false
    })
}

export const MARKERS_DICT = _.makeDict(MARKER_LIST, x => x.name, x => x);

app.sharedState.set('markers_dict', MARKERS_DICT);