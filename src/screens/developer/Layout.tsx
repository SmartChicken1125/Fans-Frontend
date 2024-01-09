import { ChevronLeft1Svg } from "@assets/svgs/common";
import { FansGap, FansSvg, FansText, FansView } from "@components/controls";
import {
	NavigationContainer,
	useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DeveloperNativeStackParams } from "@usertypes/navigations";
import React, { useState } from "react";
import DeveloperPortalScreen from "./DeveloperPortal";
import GettingStartedScreen from "./GettingStarted";
import Sidebar from "./Sidebar";
import ApplicationsLayout from "./applications/Layout";

const DeveloperNativeStack =
	createNativeStackNavigator<DeveloperNativeStackParams>();

const DeveloperLayout = () => {
	const navigationRef =
		useNavigationContainerRef<DeveloperNativeStackParams>();
	const [path, setPath] = useState<string>();

	return (
		<NavigationContainer
			ref={navigationRef}
			independent={true}
			onStateChange={(state) => {
				setPath(navigationRef.getCurrentRoute()?.name);
			}}
		>
			<Sidebar navigationRef={navigationRef} path={path}>
				<DeveloperNativeStack.Navigator
					screenOptions={{
						header: (props) => {
							const { navigation, options } = props;
							const { title } = options;

							const handlePress = () => navigation.goBack();

							return (
								<FansView
									height={{ xs: 64, lg: 103 }}
									alignItems="center"
									backgroundColor="white"
									border={{ b: 1 }}
									borderColor="grey-f0"
									flexDirection="row"
									padding={{ xs: { x: 17.8 }, lg: 0 }}
								>
									<FansView
										touchableOpacityProps={{
											onPress: handlePress,
										}}
										flex="1"
									>
										<FansSvg
											width={6.36}
											height={12.72}
											svg={ChevronLeft1Svg}
											color1="grey-70"
										/>
									</FansView>
									<FansText
										fontFamily="inter-bold"
										fontSize={19}
									>
										{title}
									</FansText>
									<FansGap viewStyle={{ flex: "1" }} />
								</FansView>
							);
						},
					}}
				>
					<DeveloperNativeStack.Screen
						name="DeveloperPortal"
						component={DeveloperPortalScreen}
						options={{ headerShown: false }}
					/>
					<DeveloperNativeStack.Screen
						name="Applications"
						component={ApplicationsLayout}
						options={{ title: "Applications" }}
					/>
					<DeveloperNativeStack.Screen
						name="GettingStarted"
						component={GettingStartedScreen}
						options={{ title: "Getting Started" }}
					/>
				</DeveloperNativeStack.Navigator>
			</Sidebar>
		</NavigationContainer>
	);
};

export default DeveloperLayout;
