import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { NewTierForm } from "@components/posts/share";
import {
	useAppContext,
	PostsActionType,
	ProfileActionType,
} from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { ISubscriptionTier } from "@usertypes/types";
import React from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NewTierScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "NewTier">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;
	const { tiers } = state.profile;

	const onCreateTierCallback = (newTier: ISubscriptionTier) => {
		dispatch.setProfile({
			type: ProfileActionType.updateProfile,
			data: {
				tiers: [...tiers, newTier],
			},
		});
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				tiers: [...postForm.tiers, newTier.id],
			},
		});
		navigation.goBack();
	};

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="New Tier"
				onClickLeft={() => navigation.goBack()}
			/>
			<ScrollView style={tw.style("pt-6")}>
				<FansView padding={{ x: 18, b: 24 }}>
					<NewTierForm
						onCreateCallback={(tier) => {
							onCreateTierCallback(tier);
						}}
					/>
				</FansView>
			</ScrollView>
		</FansView>
	);
};

export default NewTierScreen;
