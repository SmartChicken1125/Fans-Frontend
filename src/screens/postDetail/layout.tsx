import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PostDetailNavigationStacks } from "@usertypes/navigations";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import PostDetailScreen from "./postDetailScreen";

const Stack = createNativeStackNavigator<PostDetailNavigationStacks>();

const Layout = () => {
	const { id } = useLocalSearchParams();
	return (
		<Stack.Navigator initialRouteName="Detail">
			<Stack.Screen
				name="Detail"
				component={PostDetailScreen}
				options={{
					headerShown: false,
				}}
				initialParams={{ id: id as string }}
			/>
		</Stack.Navigator>
	);
};

export default Layout;
