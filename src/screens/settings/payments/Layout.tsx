import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsPaymentsStackParams } from "@usertypes/navigations";
import { useRouter } from "expo-router";
import React from "react";
import SettingsNavigationHeader from "../../../components/screens/settings/SettingsNavigationHeader";
import AddPaymentMethodScreen from "./AddPaymentMethod";
import PaymentsScreen from "./Payments";

const PaymentsNavigator =
	createNativeStackNavigator<SettingsPaymentsStackParams>();

const SettingsPaymentsNativeStack = () => {
	const router = useRouter();

	return (
		<PaymentsNavigator.Navigator
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<PaymentsNavigator.Screen
				name="Payments"
				component={PaymentsScreen}
				options={{
					title: "Payments",
				}}
			/>
			<PaymentsNavigator.Screen
				name="AddPaymentMethod"
				component={AddPaymentMethodScreen}
				options={{
					title: "Payments",
				}}
			/>
		</PaymentsNavigator.Navigator>
	);
};

const PaymentsLayout = () => {
	return SettingsNavigationLayout(<SettingsPaymentsNativeStack />);
};

export default PaymentsLayout;
