import { BUILD_NUMBER, SENTRY_DSN } from "@env";
// eslint-disable-next-line import/no-namespace
import * as Sentry from "sentry-expo";

const buildNumber = BUILD_NUMBER || "dev";

console.log(`[init] Build number: ${buildNumber}`);

if (SENTRY_DSN) {
	console.log("[init] Sentry enabled");
	Sentry.init({
		dsn: SENTRY_DSN,
	});
}

import("expo-router/entry");
