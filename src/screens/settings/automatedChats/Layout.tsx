import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsAutomatedChatsNativeStackParams } from "@usertypes/navigations";
import { useRouter } from "expo-router";
import React from "react";
import AutomatedChatsScreen from "./AutomatedChats";
import MessageCreateScreen from "./MessageCreate";
import MessageImageScreen from "./MessageImage";

const Stack =
	createNativeStackNavigator<SettingsAutomatedChatsNativeStackParams>();

const SettingsAutomatedChatNativeStack = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="AutomatedChats"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="AutomatedChats"
				component={AutomatedChatsScreen}
				options={{
					title: "Automated chats",
				}}
			/>
			<Stack.Screen name="MessageImage" component={MessageImageScreen} />
			<Stack.Screen
				name="MessageCreate"
				component={MessageCreateScreen}
			/>
		</Stack.Navigator>
	);
};

const AutomatedChatsLayout = () => {
	return SettingsNavigationLayout(<SettingsAutomatedChatNativeStack />);
};

export default AutomatedChatsLayout;
