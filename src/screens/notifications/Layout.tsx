import { Sidebar } from "@components/common";
import { LayoutRightContents } from "@components/common/layout";
import AppLayout from "@components/common/layout/layout";
import {
	FansScreen2,
	FansText,
	FansVerticalDivider,
	FansView,
} from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NotificationsNavigationStacks } from "@usertypes/navigations";
import React from "react";
import { useDeviceContext } from "twrnc";
import NotificationsScreen from "./Notifications";

const Stack = createNativeStackNavigator<NotificationsNavigationStacks>();

const NotificationsNavigator = () => {
	const { dispatch } = useAppContext();
	return (
		<Stack.Navigator
			initialRouteName="Notifications"
			screenOptions={{
				headerTitleAlign: "center",
				headerTitle: ({ children }) => (
					<FansText
						fontFamily="inter-bold"
						fontSize={23}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						{children}
					</FansText>
				),
				headerStyle: {
					backgroundColor: tw.prefixMatch("dark")
						? "#1d1d1d"
						: "#fff",
				},
			}}
		>
			<Stack.Screen
				name="Notifications"
				component={NotificationsScreen}
			/>
		</Stack.Navigator>
	);
};

const NotificationsLayout = () => {
	// useDeviceContext(tw);

	return (
		<AppLayout>
			<NotificationsNavigator />
			<LayoutRightContents />
		</AppLayout>
	);
};

export default NotificationsLayout;
