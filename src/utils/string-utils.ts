import _ from 'the-lodash';

export function isEmptyString(str: any)
{
    if (str) {
        if (_.isString(str)) {
            if (str.length > 0) {
                return false;
            }
        }
    }

    return true;
}