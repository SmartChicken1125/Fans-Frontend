import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { VideoCallStackParams } from "@usertypes/navigations";
import React from "react";
import CreatorScreen from "./creatorScreen";
import FanScreen from "./fanScreen";

const Stack = createNativeStackNavigator<VideoCallStackParams>();

const VideoCallLayout = () => {
	return (
		<Stack.Navigator initialRouteName="Creator">
			<Stack.Screen
				name="Creator"
				component={CreatorScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Fan"
				component={FanScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Stack.Navigator>
	);
};

export default VideoCallLayout;
