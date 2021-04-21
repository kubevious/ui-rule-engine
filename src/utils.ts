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
