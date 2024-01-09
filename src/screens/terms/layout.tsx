import { ChevronLeftSvg } from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import tw from "@lib/tailwind";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TermsNavigationStacks } from "@usertypes/navigations";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable } from "react-native";
import BenefitGuidelinesScreen from "./benefitGuidelinesScreen";
import CommunityGuidelinesScreen from "./communityGuidelinesScreen";
import CookiePolicyScreen from "./cookiePolicyScreen";
import DataAgreementScreen from "./dataAgreementScreen";
import FeeScheduleScreen from "./feeScheduleScreen";
import ReturnsPolicyScreen from "./returnsPolicyScreen";
import SanctionPolicyScreen from "./sanctionPolicyScreen";
import SecurityPolicyScreen from "./securityPolicyScreen";
import TermsServiceScreen from "./termsServiceScreen";

const Stack = createNativeStackNavigator<TermsNavigationStacks>();

const Layout = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="Terms"
			screenOptions={{
				headerTintColor: tw.prefixMatch("dark") ? "#fff" : "#000",
				headerStyle: tw.style("bg-fans-white dark:bg-fans-black-1d"),
				headerLeft: () => (
					<Pressable
						style={tw.style("pl-[15px]")}
						onPress={() => router.back()}
					>
						<FypSvg
							svg={ChevronLeftSvg}
							width={12}
							height={12}
							color="fans-black dark:fans-white"
						/>
					</Pressable>
				),
			}}
		>
			<Stack.Screen
				name="Terms"
				component={TermsServiceScreen}
				options={{
					title: "Terms of Service",
					headerTitleAlign: "center",
				}}
			/>
			<Stack.Screen
				name="Benefits"
				component={BenefitGuidelinesScreen}
				options={{
					title: "Benefits Guidelines",
					headerTitleAlign: "center",
				}}
			/>
			<Stack.Screen
				name="Community"
				component={CommunityGuidelinesScreen}
				options={{
					title: "Community Guidelines",
					headerTitleAlign: "center",
				}}
			/>
			<Stack.Screen
				name="Sanction"
				component={SanctionPolicyScreen}
				options={{
					title: "Sanction policy",
					headerTitleAlign: "center",
				}}
			/>
			<Stack.Screen
				name="Security"
				component={SecurityPolicyScreen}
				options={{
					title: "Security policy",
					headerTitleAlign: "center",
				}}
			/>
			<Stack.Screen
				name="Cookies"
				component={CookiePolicyScreen}
				options={{
					title: "Cookie policy",
					headerTitleAlign: "center",
				}}
			/>
			<Stack.Screen
				name="DataAgreement"
				component={DataAgreementScreen}
				options={{
					title: "Data Agreement",
					headerTitleAlign: "center",
				}}
			/>
			<Stack.Screen
				name="Fees"
				component={FeeScheduleScreen}
				options={{
					title: "Fee Structure",
					headerTitleAlign: "center",
				}}
			/>
			<Stack.Screen
				name="Returns"
				component={ReturnsPolicyScreen}
				options={{
					title: "Return Policy",
					headerTitleAlign: "center",
				}}
			/>
		</Stack.Navigator>
	);
};

export default Layout;
