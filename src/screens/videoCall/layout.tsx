import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { VideoCallStackParams } from "@usertypes/navigations";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import CreatorScreen from "./creatorScreen";
import FanScreen from "./fanScreen";
import OrderVideoCallScreen from "./orderVideoCall";

const Stack = createNativeStackNavigator<VideoCallStackParams>();

const VideoCallLayout = () => {
	const params = useLocalSearchParams();

	return (
		<Stack.Navigator initialRouteName="Order">
			<Stack.Screen
				name="CreatorCall"
				component={CreatorScreen}
				options={{
					headerShown: false,
				}}
				initialParams={{
					id: params.id as string,
				}}
			/>
			<Stack.Screen
				name="FanCall"
				component={FanScreen}
				options={{
					headerShown: false,
				}}
				initialParams={{
					id: params.id as string,
				}}
			/>
			<Stack.Screen
				name="Order"
				component={OrderVideoCallScreen}
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

export default VideoCallLayout;
