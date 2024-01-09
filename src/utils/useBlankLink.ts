import { openBrowserAsync } from "expo-web-browser";
import React from "react";
import { Platform } from "react-native";

export const useBlankLink = () => {
	const openLink = (url: string) => {
		if (Platform.OS === "web") {
			window.open(url, "_blank");
		} else {
			openBrowserAsync("https://support.fyp.fans/");
		}
	};

	return [openLink];
};
