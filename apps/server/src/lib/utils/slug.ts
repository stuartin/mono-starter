import slugify from "slugify";

export function slug(str: string) {
    return slugify(str, {
        lower: true,
        trim: true,
        strict: true,
    });
}
