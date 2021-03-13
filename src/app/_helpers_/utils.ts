
export class Utils {
    static turnEnumToDictionary (values)
    {
        return Object.keys(values)
            .filter(element => !isNaN(+element))
            .map(element => {
                return {
                    id: +element,
                    label: values[element]
                }
            });
    }

    static pluckExclude (object: any, exKeys: Array<string>): any
    {
        return Object.keys(object).reduce((result, key) => {
            if (!exKeys.includes(key)) result[key] = object[key];
            return result;
        }, {});
    }
}