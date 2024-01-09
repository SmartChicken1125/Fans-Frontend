module.exports = {
	env: {
		es6: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:prettier/recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"prettier",
	],
	globals: {
		Atomics: "readonly",
		SharedArrayBuffer: "readonly",
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "prettier"],
	rules: {
		"linebreak-style": ["error", "unix"],
		semi: ["error", "always"],
		"no-unused-vars": "off",
		// TODO(alula): enable when we have time for refactoring or way to automate this
		// "no-restricted-syntax": [
		// 	"warn",
		// 	"ExportAllDeclaration",
		// 	"ExportNamedDeclaration[source!=null]",
		// ],
		"@typescript-eslint/no-explicit-any": "error",
		"prettier/prettier": "error",
		"import/default": "off",
		"import/no-namespace": "error",
		"import/no-unresolved": [
			"error",
			{
				ignore: ["@env", "twrnc/dist/esm/types"],
			},
		],
		"import/no-cycle": "error",
		"import/order": [
			"error",
			{
				"newlines-between": "never",
				alphabetize: { order: "asc" },
				groups: [
					["builtin", "external", "internal"],
					"parent",
					"sibling",
					"index",
				],
			},
		],
	},
	settings: {
		"import/resolver": "typescript",
	},
	overrides: [
		{
			files: ["app/**/*", "*.d.ts"],
			rules: {
				"no-restricted-syntax": "off",
			},
		},
		{
			files: ["src/assets/svgs/**/*"],
			rules: {
				"no-restricted-syntax": "off",
			},
		},
	],
};
