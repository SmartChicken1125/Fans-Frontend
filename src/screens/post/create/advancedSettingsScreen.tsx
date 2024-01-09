import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { AdvancedSettingsForm } from "@components/posts/share";
import { useAppContext, PostsActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AdvancedSettingsScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "AdvancedSettings">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();
	const { state, dispatch } = useAppContext();
	const { advanced } = state.posts.postForm;

	const handleCancel = () => {
		navigation.goBack();
	};

	const onChangeSetting = (name: string, val: boolean) => {
		const updatedAdvanced = {
			...advanced,
			[name]: val,
		};
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				advanced: updatedAdvanced,
			},
		});
	};

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="Advancced settings"
				onClickLeft={handleCancel}
				rightLabel="Save"
				onClickRight={() => navigation.navigate("Caption")}
			/>
			<FansView padding={{ x: 18 }} margin={{ t: 24 }}>
				<AdvancedSettingsForm
					data={advanced}
					onChange={onChangeSetting}
				/>
			</FansView>
		</FansView>
	);
};

export default AdvancedSettingsScreen;
