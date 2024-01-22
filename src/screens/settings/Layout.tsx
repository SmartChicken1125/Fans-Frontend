import { ChevronLeft1Svg } from "@assets/svgs/common";
import {
	FansGap,
	FansScreen3,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import tw from "@lib/tailwind";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import { SettingsScreenContent } from "./Settings";

const SettingsLayout = () => {
	const router = useRouter();

	const handlePress = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace({
				pathname: "posts",
				params: { screen: "Home" },
			});
		}
	};

	if (tw.prefixMatch("lg")) {
		return <Redirect href="/account" />;
	}

	return (
		<>
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
					Settings
				</FansText>
				<FansGap viewStyle={{ flex: "1" }} />
				<FansGap width={40} />
			</FansView>

			<FansScreen3>
				<SettingsScreenContent />
			</FansScreen3>
		</>
	);
};

export default SettingsLayout;
