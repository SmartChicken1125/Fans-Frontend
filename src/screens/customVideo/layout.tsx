import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CustomVideoStackParams } from "@usertypes/navigations";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import CustomVideoScreen from "./customVideoScreen";

const Stack = createNativeStackNavigator<CustomVideoStackParams>();

const CustomVideoLayout = () => {
	const params = useLocalSearchParams();

	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen
				name="Home"
				component={CustomVideoScreen}
				options={{
					headerShown: false,
				}}
				initialParams={{
					username: params.username as string,
				}}
			/>
		</Stack.Navigator>
	);
};

export default CustomVideoLayout;
