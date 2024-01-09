import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { AnalyzeFansLevelsContents } from "@components/posts/share";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import React from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnalyzeFansLevelsScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "FansLevels">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="Analyze your fans levels"
				onClickLeft={() => navigation.goBack()}
			/>
			<ScrollView
				style={{
					paddingTop: 28,
					paddingHorizontal: 18,
				}}
			>
				<AnalyzeFansLevelsContents />
			</ScrollView>
		</FansView>
	);
};

export default AnalyzeFansLevelsScreen;
