const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

module.exports = async function (env, argv) {
	// Set by expo-cli during `expo build:web`
	const isEnvProduction = env.mode === "production";

	const config = await createExpoWebpackConfigAsync(env, argv);
	config.plugins.push(
		sentryWebpackPlugin({
			org: "fyp-llc",
			project: "discords-com",
			authToken: process.env.SENTRY_AUTH_TOKEN,
		}),
	);
	config.plugins.push(
		new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
			const mod = resource.request.replace(/^node:/, "");
			switch (mod) {
				case "buffer":
					resource.request = "buffer";
					break;
				case "stream":
					resource.request = "readable-stream";
					break;
				default:
					throw new Error(`Not found ${mod}`);
			}
		}),
	);
	config.ignoreWarnings = config.ignoreWarnings || [];
	config.ignoreWarnings.push(/Failed to parse source map/);
	config.module.rules.push({
		test: /\.html$/i,
		loader: "html-loader",
	});
	config.output.assetModuleFilename = "assets/[hash][ext]";
	config.output.filename = "assets/[contenthash].js";
	config.output.chunkFilename = "assets/[contenthash].js";

	const cssExtractPlugin = config.plugins.find(
		(plugin) => plugin.constructor.name === "MiniCssExtractPlugin",
	);
	if (cssExtractPlugin) {
		cssExtractPlugin.options.filename = "assets/[contenthash].css";
		cssExtractPlugin.options.chunkFilename = "assets/[contenthash].css";
	}

	if (isEnvProduction) {
		config.plugins.push(
			// Generate a service worker script that will precache, and keep up to date,
			// the HTML & assets that are part of the webpack build.
			new WorkboxWebpackPlugin.InjectManifest({
				swSrc: path.resolve(__dirname, "src/service-worker.js"),
				dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
				exclude: [
					/\.map$/,
					/asset-manifest\.json$/,
					/LICENSE/,
					/\.js\.gz$/,
					// Exclude all apple touch and chrome images because they're cached locally after the PWA is added.
					/(apple-touch-startup-image|chrome-icon|apple-touch-icon).*\.png$/,
				],
				// Bump up the default maximum size (2mb) that's precached,
				// to make lazy-loading failure scenarios less likely.
				// See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
			}),
		);
	}

	console.log(config.plugins);
	return config;
};
