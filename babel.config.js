process.env.EXPO_ROUTER_APP_ROOT = "../../app";
module.exports = function (api) {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		env: {
			production: {
				plugins: ["react-native-paper/babel"],
			},
		},
		plugins: [
			"@babel/plugin-proposal-export-namespace-from",
			"expo-router/babel",
			"react-native-reanimated/plugin",
			[
				"module-resolver",
				{
					root: ["./src"],
					alias: {
						"@screens": "./src/screens",
						"@components": "./src/components",
						"@context": "./src/context",
						"@assets": "./src/assets",
						"@constants": "./src/constants",
						"@state": "./src/state",
						"@usertypes": "./src/types",
						"@lib": "./src/lib",
						"@utils": "./src/utils",
						"@helper": "./src/helper",
					},
				},
			],
			[
				"module:react-native-dotenv",
				{
					envName: "APP_ENV",
					moduleName: "@env",
					path: ".env",
					allowlist: [
						"API_URL",
						"BUILD_NUMBER",
						"CDN_URL",
						"DISCORD_CLIENT_ID",
						"GOOGLE_CLIENT_ID",
						"TWITTER_CONSUMER_KEY",
						"TWITTER_CONSUMER_SECRET",
						"STRIPE_PUBLISHABLE_KEY",
						"AUTHORIZE_NET_ENVIRONMENT",
						"AUTHORIZE_NET_API_LOGIN_ID",
						"AUTHORIZE_NET_CLIENT_KEY",
						"TWITTER_CLIENT_ID",
						"GEM_EXCHANGE_RATE",
						"PRODUCTION_MODE",
						"SENTRY_DSN",
						"SIFT_ACCOUNT_ID",
						"SIFT_BEACON_KEY",
						"SIFT_SERVER_URL_FORMAT",
						"GIPHY_API_KEY",
					],
					safe: false,
					allowUndefined: true,
				},
			],
		],
	};
};
