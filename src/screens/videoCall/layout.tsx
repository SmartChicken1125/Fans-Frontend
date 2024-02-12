import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { VideoCallStackParams } from "@usertypes/navigations";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import CreatorScreen from "./creatorScreen";
import FanScreen from "./fanScreen";

const Stack = createNativeStackNavigator<VideoCallStackParams>();

const VideoCallLayout = () => {
	const params = useLocalSearchParams();
	return (
		<Stack.Navigator initialRouteName="Creator">
			<Stack.Screen
				name="Creator"
				component={CreatorScreen}
				options={{
					headerShown: false,
				}}
				initialParams={{
					id: params.id as string,
				}}
			/>
			<Stack.Screen
				name="Fan"
				component={FanScreen}
				options={{
					headerShown: false,
				}}
				initialParams={{
					id: params.id as string,
				}}
			/>
		</Stack.Navigator>
	);
};

export default VideoCallLayout;
