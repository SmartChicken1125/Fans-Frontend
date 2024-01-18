import { ChevronLeft1Svg } from "@assets/svgs/common";
import { FansGap, FansSvg, FansText, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Router } from "expo-router/build/types";
import React from "react";

const SettingsNavigationHeader = (
	props: NativeStackHeaderProps,
	router: Router,
) => {
	const { options } = props;
	const { title } = options;

	const handlePress = () => {
		const { navigation } = props;
		if (navigation.canGoBack()) {
			navigation.goBack();
		} else {
			if (router.canGoBack()) {
				router.back();
			} else {
				router.replace({
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
					color1={tw.prefixMatch("dark") ? "grey-b1" : "grey-70"}
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
};

export default SettingsNavigationHeader;
