import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrivacyScreen from "@screens/settings/privacy/Privacy";
import {
	PrivacyNativeStackParams,
	SettingsNativeStackScreenProps,
} from "@usertypes/navigations";
import React from "react";

const PrivacyNavigator = createNativeStackNavigator<PrivacyNativeStackParams>();

const PrivacyLayout = (props: SettingsNativeStackScreenProps<"Privacy">) => {
	return (
		<PrivacyNavigator.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<PrivacyNavigator.Screen name="Privacy" component={PrivacyScreen} />
		</PrivacyNavigator.Navigator>
	);
};

export default PrivacyLayout;
