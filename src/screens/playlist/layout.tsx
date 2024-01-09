import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PlaylistNavigationStacks } from "@usertypes/navigations";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import PlaylistDetailScreen from "./playlistDetailScreen";

const Stack = createNativeStackNavigator<PlaylistNavigationStacks>();

const Layout = () => {
	const { id } = useLocalSearchParams();
	return (
		<Stack.Navigator initialRouteName="Detail">
			<Stack.Screen
				name="Detail"
				component={PlaylistDetailScreen}
				initialParams={{ id: id as string }}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
};

export default Layout;
