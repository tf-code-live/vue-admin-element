module.exports = {
	root: true,
	parserOptions: {
		parser: 'babel-eslint',
		sourceType: 'module'
	},
	env: {
		browser: true,
		node: true,
		es6: true,
	},
  	extends: ['plugin:vue/recommended', 'eslint:recommended'], //  

	// add your custom rules here
	//it is base on https://github.com/vuejs/eslint-config-vue
	rules: {
		"vue/html-indent": [2, 4],
		"vue/no-unused-components": "off",
		"vue/require-default-prop": "off",
		"indent": [2, 4],
		"no-empty": "off",
		"no-console": "off",
		"no-unused-vars": "off",
		"no-mixed-spaces-and-tabs": "off"
	}
}
