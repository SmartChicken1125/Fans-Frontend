import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PrivacyPolicyNavigationStacks } from "@usertypes/navigations";
import { useRouter } from "expo-router";
import React from "react";
import PrivacyPolicyScreen from "./privacyPolicyScreen";

const Stack = createNativeStackNavigator<PrivacyPolicyNavigationStacks>();

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
				component={PrivacyPolicyScreen}
				options={{
					title: "Privacy Policy",
				}}
			/>
		</Stack.Navigator>
	);
};

const Layout = () => {
	return SettingsNavigationLayout(<SettingsPrivacyNativeStack />);
};

export default Layout;
