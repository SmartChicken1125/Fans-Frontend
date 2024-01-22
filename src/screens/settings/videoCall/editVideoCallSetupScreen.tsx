import { FypNullableView, FypText } from "@components/common/base";
import { FansScreen2, FansView } from "@components/controls";
import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import tw from "@lib/tailwind";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsVideoCallSetupNativeStackParams } from "@usertypes/navigations";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList } from "react-native";
import ActiveOrdersForm from "./activeOrdersForm";
import PastOrdersForm from "./pastOrdersForm";
import RefundedOrdersForm from "./refundedOrdersForm";
import SettingsForm from "./settingsForm";

const Stack =
	createNativeStackNavigator<SettingsVideoCallSetupNativeStackParams>();

const SettingsVideoCallSetupNativeStack = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="EditVideoCallSetup"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="EditVideoCallSetup"
				component={EditVideoCallSetupContentView}
				options={{ title: "Video calls" }}
			/>
		</Stack.Navigator>
	);
};

const tabs = ["Settings", "Active orders", "Past orders", "Refunded orders"];

const EditVideoCallSetupContentView = () => {
	const [tab, setTab] = useState(tabs[0]);
	return (
		<FansScreen2>
			<FansView
				style={tw.style(
					"w-full md:max-w-[674px] md:mx-auto",
					"pt-6 md:pt-[46px]",
				)}
			>
				<FansView margin={{ b: 28 }} flexDirection="row">
					<FlatList
						data={tabs}
						horizontal
						pagingEnabled
						keyExtractor={(item) => item}
						renderItem={({ item }) => (
							<FansView
								key={item}
								padding={{ y: 6, x: 18 }}
								margin={{ r: 5 }}
								borderRadius={40}
								pressableProps={{
									onPress: () => setTab(item),
								}}
								style={tw.style(
									tab === item
										? "bg-fans-purple"
										: "bg-fans-grey-f0 dark:bg-fans-grey-43",
								)}
							>
								<FypText
									fontSize={17}
									lineHeight={22}
									style={tw.style(
										tab === item
											? "text-fans-white"
											: "text-fans-black dark:text-fans-white",
									)}
								>
									{item}
								</FypText>
							</FansView>
						)}
					/>
				</FansView>
				<FansView style={tw.style("pb-10 md:pb-15")}>
					<FypNullableView visible={tab === "Settings"}>
						<SettingsForm handleNext={() => setTab(tabs[1])} />
					</FypNullableView>
					<FypNullableView visible={tab === "Active orders"}>
						<ActiveOrdersForm />
					</FypNullableView>
					<FypNullableView visible={tab === "Past orders"}>
						<PastOrdersForm />
					</FypNullableView>
					<FypNullableView visible={tab === "Refunded orders"}>
						<RefundedOrdersForm />
					</FypNullableView>
				</FansView>
			</FansView>
		</FansScreen2>
	);
};

const EditVideoCallSetupScreen = () => {
	return SettingsNavigationLayout(<SettingsVideoCallSetupNativeStack />);
};

export default EditVideoCallSetupScreen;
