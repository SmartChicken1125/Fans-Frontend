import { ChevronLeft1Svg } from "@assets/svgs/common";
import AppLayout from "@components/common/layout";
import { FansGap, FansSvg, FansText, FansView } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import {
	NavigationContainer,
	useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { VaultNavigationStacks } from "@usertypes/navigations";
import { useRouter } from "expo-router";
import React from "react";
import VaultScreen from "./vaultScreen";

const Stack = createNativeStackNavigator<VaultNavigationStacks>();

const VaultNativeStack = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="Home"
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
								touchableOpacityProps={{
									onPress: handlePress,
								}}
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
				name="Home"
				component={VaultScreen}
				options={{
					title: "Vault",
				}}
			/>
		</Stack.Navigator>
	);
};

const Layout = () => {
	const navigationRef = useNavigationContainerRef<VaultNavigationStacks>();
	const { dispatch } = useAppContext();

	return tw.prefixMatch("md") ? (
		<AppLayout title={`Vault | FYP.Fans`}>
			<NavigationContainer independent ref={navigationRef}>
				<VaultNativeStack />
			</NavigationContainer>
		</AppLayout>
	) : (
		<NavigationContainer independent ref={navigationRef}>
			<VaultNativeStack />
		</NavigationContainer>
	);
};

export default Layout;
