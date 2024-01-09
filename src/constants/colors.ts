import { Colors } from "@usertypes/styles";
export const ACTIVE_COLOR = "#A854F5";
export const INACTIVE_COLOR = "#000000";

interface ThemeColors {
	light: {
		[key: string]: Colors;
	};
	dark: {
		[key: string]: Colors;
	};
}

export const colors: ThemeColors = {
	light: {
		black: "black",
		"black-1d": "black-1d",
		blue: "blue",
		"blue-6d": "blue-6d",
		"brown-3b": "brown-3b",
		green: "green",
		"green-4d": "green-4d",
		"green-65": "green-65",
		grey: "grey",
		"grey-66": "grey-66",
		"grey-70": "grey-70",
		"grey-b1": "grey-b1",
		"grey-de": "grey-de",
		"grey-f0": "grey-f0",
		"grey-9d": "grey-9d",
		purple: "purple",
		"purple-5f": "purple-5f",
		"purple-a8": "purple-a8",
		"purple-f6": "purple-f6",
		"purple-6a": "purple-6a",
		red: "red",
		"red-FF": "red-FF",
		"red-eb": "red-eb",
		"red-fd": "red-fd",
		white: "white",
		"black-2e": "black-2e",
		yellow: "yellow",
	},
	dark: {
		white: "black-1d",
		purple: "purple",
		"purple-5f": "purple-5f",
		"purple-f6": "purple-47",
		"purple-a8": "purple-a8",
		green: "green-29",
		"red-eb": "red-eb",
		black: "white",
		"grey-70": "grey-b1",
		"grey-b1": "grey-70",
		"grey-de": "grey-50",
		"grey-f0": "grey-43",
		grey: "grey-43",

		"black-1d": "black-1d",
		blue: "blue",
		"blue-6d": "blue-6d",
		"brown-3b": "brown-3b",
		"green-4d": "green-4d",
		"green-65": "green-65",
		"grey-66": "grey-66",
		"grey-9d": "grey-9d",
		"purple-6a": "purple-6a",
		red: "red",
		"red-FF": "red-FF",
		"red-fd": "red-fd",
		"black-2e": "black-2e",
		yellow: "yellow",
	},
};
