import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrivacyScreen from "@screens/settings/privacy/Privacy";
import { PrivacyNativeStackParams } from "@usertypes/navigations";
import { useRouter } from "expo-router";
import React from "react";

const Stack = createNativeStackNavigator<PrivacyNativeStackParams>();

const SettingsPrivacyNativeStack = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="Privacy"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="Privacy"
				component={PrivacyScreen}
				options={{ title: "Privacy & Safety" }}
			/>
		</Stack.Navigator>
	);
};

const PrivacyLayout = () => {
	return SettingsNavigationLayout(<SettingsPrivacyNativeStack />);
};

export default PrivacyLayout;
