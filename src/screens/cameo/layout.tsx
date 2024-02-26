import { ChevronLeft1Svg } from "@assets/svgs/common";
import {
	FypText,
	FypLinearGradientView,
	FypSvg,
} from "@components/common/base";
import { SettingsLayout } from "@components/common/layout";
import { FansGap, FansView } from "@components/controls";
import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import tw from "@lib/tailwind";
import {
	createNativeStackNavigator,
	NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import {
	SettingsCameoSetupNativeStackParams,
	SettingsCameoSetupNativeStackScreens,
} from "@usertypes/navigations";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import React, { FC, useEffect } from "react";
import { Dimensions } from "react-native";
import EditScreen from "./editScreen";
import SetUpFaqScreen from "./setUpFaqScreen";
import SetUpScreen from "./setUpScreen";

const dimensions = Dimensions.get("window");

const Stack = createNativeStackNavigator<SettingsCameoSetupNativeStackParams>();

interface Props {
	routeName: SettingsCameoSetupNativeStackScreens;
}

const CameoNativeStack: FC<Props> = (props) => {
	const { routeName } = props;
	const router = useRouter();
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SettingsCameoSetupNativeStackParams>
		>();
	useEffect(() => {
		navigation.navigate(routeName);
	}, [routeName]);

	return (
		<Stack.Navigator
			initialRouteName="Faq"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="Faq"
				component={SetUpFaqScreen}
				options={{
					title: "Set up custom video",
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
									router.replace("/posts");
								}
							}
						};

						return (
							<FansView style={tw.style("overflow-hidden")}>
								<FypLinearGradientView
									colors={["#D27EFE", "#A854F5", "#651CD6"]}
									start={[0, 1]}
									end={[1, 0]}
									style={{
										width: "100%",
										height: tw.prefixMatch("lg")
											? 733
											: 320 +
											  (dimensions.width - 36) * 0.65,
										position: "absolute",
									}}
								/>

								<FansView
									height={{ xs: 64, lg: 103 }}
									alignItems="center"
									border={{ b: 1 }}
									borderColor="grey-f0"
									flexDirection="row"
									padding={{ x: 24 }}
								>
									<FansView
										touchableOpacityProps={{
											onPress: handlePress,
										}}
										width={40}
										height={40}
										padding={{ x: 4, y: 12 }}
									>
										<FypSvg
											width={8}
											height={16}
											svg={ChevronLeft1Svg}
											color="fans-white"
										/>
									</FansView>
									<FansGap viewStyle={{ flex: "1" }} />
									<FypText
										fontWeight={600}
										fontSize={19}
										style={tw.style("text-fans-white")}
									>
										{title}
									</FypText>
									<FansGap viewStyle={{ flex: "1" }} />
									<FansGap width={40} />
								</FansView>
							</FansView>
						);
					},
				}}
			/>
			<Stack.Screen
				name="Setup"
				component={SetUpScreen}
				options={{ title: "Set up custom video" }}
			/>
			<Stack.Screen
				name="Edit"
				component={EditScreen}
				options={{ title: "Custom video orders" }}
			/>
		</Stack.Navigator>
	);
};

const CameoLayout = () => {
	const { screen } = useLocalSearchParams();
	return (
		<SettingsLayout>
			<CameoNativeStack
				routeName={
					(screen as SettingsCameoSetupNativeStackScreens) ?? "Faq"
				}
			/>
		</SettingsLayout>
	);
};

export default CameoLayout;
