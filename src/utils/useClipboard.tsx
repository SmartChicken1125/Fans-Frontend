import { setStringAsync } from "expo-clipboard";
import React from "react";

const useClipboard = () => {
	async function copyString(text: string): Promise<void> {
		await setStringAsync(text);
	}

	return {
		copyString,
	};
};

export default useClipboard;
