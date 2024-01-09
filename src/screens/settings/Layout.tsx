import { ChevronLeft1Svg } from "@assets/svgs/common";
import { Sidebar } from "@components/common";
import { LoadingModal } from "@components/common/dialog";
import {
	FansGap,
	FansScreen2,
	FansSvg,
	FansText,
	FansVerticalDivider,
	FansView,
} from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import {
	NavigationContainer,
	useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameoSetup from "@screens/cameo/CameoSetup";
import FanProfileSetup from "@screens/profile/fans/FanProfileSetup";
import ScheduledPostsScreen from "@screens/settings/ScheduledPosts";
import AutomatedChatsLayout from "@screens/settings/automatedChats/Layout";
import PaymentsLayout, {
	AddPaymentMethodScreen,
} from "@screens/settings/payments";
import PrivacyLayout from "@screens/settings/privacy/Layout";
import ReferralProgramLayout from "@screens/settings/referral/Layout";
import {
	SettingsNativeStackParams,
	SettingsNativeStackScreens,
} from "@usertypes/navigations";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import React, { useMemo, useState } from "react";
import AccountScreen from "./Account";
import AnalyticsScreen from "./Analytics";
import ChangePasswordScreen from "./ChangePassword";
import ConnectionsScreen from "./Connections";
import EmailScreen from "./Email";
import NotificationsScreen from "./Notifications";
import PhoneScreen from "./Phone";
import ReportAbuseScreen from "./ReportAbuse";
import SettingsScreen, { SettingsScreenContent } from "./Settings";
import SubscriptionsScreen from "./Subscriptions";
import UsernameScreen from "./Username";
import VerifyEmailScreen from "./VerifyEmail";
import EditVideoCallSetup from "./VideoCalls/EditVideoCallSetup";
import VideoCallSetup from "./VideoCalls/VideoCallSetup";
import VideoCallSetupTOS from "./VideoCalls/VideoCallSetupTOS";
import ReferCreatorsAnalyticsScreen from "./referCreators/Analytics";
import ReferCreatorsPaymentsScreen from "./referCreators/Payments";
import ReferCreatorsPayoutSetupScreen from "./referCreators/PayoutSetup";
import ReferCreatorsEarnScreen from "./referCreators/ReferAndEarn";

const Stack = createNativeStackNavigator<SettingsNativeStackParams>();

interface Props {
	screen: SettingsNativeStackScreens;
}

const SettingsNativeStack = (props: Props) => {
	const { screen } = props;
	const { returnPopup, subscriptionId } = useLocalSearchParams();

	const router = useRouter();
	const segments = useSegments();

	const initialScreen = useMemo(() => {
		if (segments[0] === "(tabs)") {
			switch (segments[1]) {
				case "referrals":
					return "ReferCreators";
				case "refer-analytics":
					return "ReferralAnalytics";
				case "refer-payout":
					return "ReferralPayments";
			}
		}
		if (screen === "Settings" && tw.prefixMatch("lg")) {
			return "Account";
		}
		return screen;
	}, [screen, segments]);

	return (
		<Stack.Navigator
			initialRouteName={initialScreen}
			screenOptions={{
				header: (props) => {
					const { navigation, options } = props;
					const { title } = options;

					const handlePress = () => {
						if (navigation.canGoBack()) {
							navigation.goBack();
						} else {
							if (router.canGoBack()) {
								router.back();
							} else {
								router.push({
									pathname: "posts",
									params: { screen: "Home" },
								});
							}
						}
					};

					return (
						<FansView
							height={{ xs: 64, lg: 103 }}
							alignItems="center"
							flexDirection="row"
							padding={{ x: 24 }}
							style={tw.style(
								"bg-fans-white dark:bg-fans-black-1d",
								"border-b border-fans-grey-f0 dark:border-fans-grey-43",
							)}
						>
							<FansView
								touchableOpacityProps={{ onPress: handlePress }}
								width={40}
								height={40}
								padding={{ x: 4, y: 12 }}
							>
								<FansSvg
									width={8}
									height={16}
									svg={ChevronLeft1Svg}
									color1={
										tw.prefixMatch("dark")
											? "grey-b1"
											: "grey-70"
									}
								/>
							</FansView>
							<FansGap viewStyle={{ flex: "1" }} />
							<FansText fontFamily="inter-bold" fontSize={19}>
								{title}
							</FansText>
							<FansGap viewStyle={{ flex: "1" }} />
							<FansGap width={40} />
						</FansView>
					);
				},
			}}
		>
			<Stack.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					title: "Settings",
				}}
			/>
			<Stack.Screen
				name="Account"
				component={AccountScreen}
				options={{
					title: "Account",
				}}
			/>
			<Stack.Screen
				name="Payments"
				component={PaymentsLayout}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="Analytics"
				component={AnalyticsScreen}
				options={{
					title: "Analytics",
				}}
			/>
			<Stack.Screen
				name="AutomatedChats"
				component={AutomatedChatsLayout}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ChangePassword"
				component={ChangePasswordScreen}
				options={{
					title: "Change password",
				}}
			/>
			<Stack.Screen
				name="Connections"
				component={ConnectionsScreen}
				options={{
					title: "Connections",
				}}
			/>
			<Stack.Screen
				name="Email"
				component={EmailScreen}
				options={{
					title: "Email",
				}}
			/>
			<Stack.Screen
				name="Notifications"
				component={NotificationsScreen}
				options={{
					title: "Notifications",
				}}
			/>
			<Stack.Screen
				name="Phone"
				component={PhoneScreen}
				options={{
					title: "Phone",
				}}
			/>
			<Stack.Screen
				name="Privacy"
				component={PrivacyLayout}
				options={{ title: "Privacy & Safety", headerShown: false }}
			/>
			<Stack.Screen
				name="REPORTABUSE"
				component={ReportAbuseScreen}
				options={{ title: "Report abuse" }}
			/>
			<Stack.Screen
				name="Subscriptions"
				component={SubscriptionsScreen}
				options={{
					title: "Subscriptions",
				}}
				initialParams={{ returnPopup, subscriptionId }}
			/>
			<Stack.Screen
				name="Username"
				component={UsernameScreen}
				options={{
					title: "Username",
				}}
			/>
			<Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
			<Stack.Screen
				name="ReferralProgram"
				component={ReferralProgramLayout}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ReferCreators"
				component={ReferCreatorsEarnScreen}
				options={{
					title: "Refer and earn",
				}}
			/>
			<Stack.Screen
				name="ReferralAnalytics"
				component={ReferCreatorsAnalyticsScreen}
				options={{
					title: "Refer creator analytics",
				}}
			/>
			<Stack.Screen
				name="ReferralPayments"
				component={ReferCreatorsPaymentsScreen}
				options={{
					title: "Payments",
				}}
			/>
			<Stack.Screen
				name="ReferralPayoutSetup"
				component={ReferCreatorsPayoutSetupScreen}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="AddPaymentMethod"
				component={AddPaymentMethodScreen}
				options={{
					title: "Add payment method",
				}}
			/>

			<Stack.Screen
				name="ScheduledPosts"
				component={ScheduledPostsScreen}
				options={{ title: "Scheduled posts" }}
			/>
			<Stack.Screen
				name="VideoCallSetup"
				component={VideoCallSetup}
				options={{ title: "Set up video calls" }}
			/>
			<Stack.Screen
				name="VideoCallSetupTOS"
				component={VideoCallSetupTOS}
				options={{ title: "Set up video calls" }}
			/>
			<Stack.Screen
				name="CameoSetup"
				component={CameoSetup}
				options={{ title: "Set up custom video" }}
			/>
			<Stack.Screen
				name="FanProfileSetup"
				component={FanProfileSetup}
				options={{ title: "Set up profile" }}
			/>
			<Stack.Screen
				name="EditVideoCallSetup"
				component={EditVideoCallSetup}
				options={{ title: "Video calls" }}
			/>
			{/* <Stack.Screen
				name="ChatRoom"
				component={ChatRoom}
				options={({ navigation, route }) => ({
					header: (props) => (
						<ChatRoomHeader
							{...props}
							navigation={navigation}
							route={route}
						/>
					),
					headerStyle: {
						backgroundColor: "black",
					},
					headerTintColor: "white",
					headerTitle: "",
				})}
			/> */}
		</Stack.Navigator>
	);
};

const SettingsLayout = () => {
	const segments = useSegments();
	const { dispatch } = useAppContext();
	const { screen } = useLocalSearchParams<{
		screen: SettingsNativeStackScreens;
	}>();
	console.log(`props = ${screen}`);
	const navigationRef =
		useNavigationContainerRef<SettingsNativeStackParams>();
	const router = useRouter();

	const [active, setActive] = useState<SettingsNativeStackScreens>(
		screen ??
			(segments[0] === "(tabs)" &&
			["referrals", "refer-analytics", "refer-payout"].includes(
				segments[1],
			)
				? "ReferCreators"
				: tw.prefixMatch("lg")
				? "Account"
				: "Settings"),
	);

	const handleNavigate = (screen: SettingsNativeStackScreens) => {
		switch (screen) {
			case "Payments":
				navigationRef.navigate(screen, { screen: "Payments" });
				break;
			case "Subscriptions":
				navigationRef.navigate(screen, { screen: "Subscriptions" });
				break;
			case "Privacy":
				navigationRef.navigate(screen, { screen: "Privacy" });
				break;
			case "AutomatedChats":
				navigationRef.navigate(screen, { screen: "AutomatedChats" });
				break;
			case "VerifyEmail":
				break;

			default:
				navigationRef.navigate(screen);
				break;
		}
	};

	const handleStateChange = () => {
		setActive(
			(navigationRef.getCurrentRoute()
				?.name as SettingsNativeStackScreens) ??
				(segments[0] === "(tabs)" &&
				["referrals", "refer-analytics", "refer-payout"].includes(
					segments[1],
				)
					? "ReferCreators"
					: tw.prefixMatch("lg")
					? "Account"
					: "Settings"),
		);
	};

	const handleNavigateBack = () => {
		if (navigationRef.canGoBack()) {
			navigationRef.goBack();
			return;
		}
		router.push({
			pathname: "posts",
			params: { screen: "Home" },
		});
	};

	return tw.prefixMatch("lg") ? (
		<FansScreen2>
			<FansView style={tw.style("ml-[140px]")} flexDirection="row" grow>
				<Sidebar />
				<FansVerticalDivider />
				<FansView width={434}>
					<SettingsScreenContent
						active={active}
						onNavigate={handleNavigate}
						onNavigateBack={handleNavigateBack}
					/>
				</FansView>
				<FansVerticalDivider />
				<FansView grow>
					<NavigationContainer
						independent
						ref={navigationRef}
						onStateChange={handleStateChange}
					>
						<SettingsNativeStack screen={active} />
					</NavigationContainer>
				</FansView>
				<LoadingModal />
			</FansView>
		</FansScreen2>
	) : (
		<NavigationContainer
			independent
			ref={navigationRef}
			onStateChange={handleStateChange}
		>
			<SettingsNativeStack screen={active} />
			<LoadingModal />
		</NavigationContainer>
	);
};

export default SettingsLayout;
