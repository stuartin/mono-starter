import antfu, { Awaitable, TypedFlatConfigItem } from "@antfu/eslint-config";

const config = (...args: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]) => {
    antfu({
        type: "app",
        typescript: true,
        svelte: true,
        formatters: true,
        stylistic: {
            indent: 4,
            semi: true,
            quotes: "double",
        },
        ignores: [
            "README.md",
            "package.json",
        ],
    }, {
        rules: {
            "no-console": ["off"],
            "antfu/no-top-level-await": ["off"],
            "node/prefer-global/process": ["off"],
            "perfectionist/sort-imports": ["error", {
                internalPattern: ["^#/.*"],
            }],
            "unicorn/filename-case": ["error", {
                case: "kebabCase",
                ignore: [/^[A-Z].md*/i],
            }],
        },
    },
        ...args
    )
}

export default config