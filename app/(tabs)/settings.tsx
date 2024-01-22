import tw from "@lib/tailwind";
import AccountScreen from "@screens/settings/Account";
import SettingsLayout from "@screens/settings/Layout";
import React from "react";

const Screen = () => {
	if (tw.prefixMatch("lg")) {
		return <AccountScreen />;
	} else {
		return <SettingsLayout />;
	}
};

export default Screen;
