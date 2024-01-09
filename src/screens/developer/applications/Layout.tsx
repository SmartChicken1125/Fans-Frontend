import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
	AppDetailsScreen,
	MyApplicationsScreen,
} from "@screens/developer/applications";
import {
	DeveloperApplicationsNativeStackParams,
	DeveloperNativeStackScreenProps,
} from "@usertypes/navigations";
import React from "react";

const ApplicationsNativeStack =
	createNativeStackNavigator<DeveloperApplicationsNativeStackParams>();

const ApplicationsLayout = (
	props: DeveloperNativeStackScreenProps<"Applications">,
) => {
	return (
		<ApplicationsNativeStack.Navigator
			initialRouteName="MyApplications"
			screenOptions={{
				headerShown: false,
			}}
		>
			<ApplicationsNativeStack.Screen
				name="MyApplications"
				component={MyApplicationsScreen}
			/>
			<ApplicationsNativeStack.Screen
				name="AppDetails"
				component={AppDetailsScreen}
			/>
		</ApplicationsNativeStack.Navigator>
	);
};

export default ApplicationsLayout;
