/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

// A no-op "cleanup" service worker, to remove old buggy service worker code.

function doNothing() {}

self.addEventListener("install", () => {
	doNothing(self.__WB_MANIFEST);
	// Skip over the "waiting" lifecycle state, to ensure that our
	// new service worker is activated immediately, even if there's
	// another tab open controlled by our older service worker code.
	self.skipWaiting();
});
