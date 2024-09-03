module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,

    },
    plugins: [
        "@typescript-eslint",
        "simple-import-sort",
        "prettier",
    ],
    extends: [
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "prettier",
    ],
    env: {
        node: true,
        es2020: true,
        es6: true,
        mocha: true,
    },
    ignorePatterns: [
        ".eslintrc.js",
        "node_modules/**",
        "dist/**",
        "coverage/**",
        "services/client"
    ],
    rules: {
        "no-unused-vars": "warn",
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                ts: "never",
            },
        ],
        "import/no-relative-parent-imports": ["error", { "allowRoot": true }],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "import/prefer-default-export": "off",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "@typescript-eslint/no-unused-vars": "off",
        "max-len": ["error", { code: 350 }],
        "linebreak-style": ["error", "unix"],
    },
};
