export function omitEmpty<T extends Record<string, any>>(obj: T) {
    const result = {} as { [K in keyof T]: NonNullable<T[K]> };

    for (const key in obj) {
        if (obj[key] != null) {
            result[key] = obj[key];
        }
    }
    return result;
}
