import { Sidebar } from "@components/common";
import {
	FansGap,
	FansScreen3,
	FansVerticalDivider,
	FansView,
} from "@components/controls";
import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import tw from "@lib/tailwind";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SupportNativeStackParams } from "@usertypes/navigations";
import { useRouter } from "expo-router";
import React from "react";
import ContactUsScreen from "./ContactUs";
import LawEnforcementGuideScreen from "./LawEnforcementGuide";

const ContactNativeStackNavigator =
	createNativeStackNavigator<SupportNativeStackParams>();

const router = useRouter();

const SupportNativeStack = () => (
	<ContactNativeStackNavigator.Navigator
		screenOptions={{
			header: (props) => SettingsNavigationHeader(props, router),
		}}
	>
		<ContactNativeStackNavigator.Screen
			name="ContactUs"
			component={ContactUsScreen}
			options={{ title: "Contact us" }}
		/>
		<ContactNativeStackNavigator.Screen
			name="LawEnforcementGuide"
			component={LawEnforcementGuideScreen}
			options={{ title: "Low enforcement guide" }}
		/>
	</ContactNativeStackNavigator.Navigator>
);

const SupportLayout = () => {
	// useDeviceContext(tw);

	return tw.prefixMatch("lg") ? (
		<FansScreen3 contentStyle1={{ padding: 0 }}>
			<FansView style={tw.style("mx-[140px]")} flexDirection="row" grow>
				<Sidebar />
				<FansVerticalDivider />
				<FansGap width={170} />
				<FansView grow>
					<NavigationContainer independent>
						<SupportNativeStack />
					</NavigationContainer>
				</FansView>
			</FansView>
		</FansScreen3>
	) : (
		<SupportNativeStack />
	);
};

export default SupportLayout;
