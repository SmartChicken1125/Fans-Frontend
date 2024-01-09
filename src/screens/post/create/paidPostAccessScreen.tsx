import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { PaidPostAccessForm } from "@components/posts/share";
import { useAppContext, PostsActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { IPaidPostAccessForm } from "@usertypes/types";
import React from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PaidPostAccessScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "PaidPostAccess">,
) => {
	const { navigation } = props;

	const insets = useSafeAreaInsets();
	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;
	const { roles, tiers } = state.profile;

	const handleSave = (paidPostAccess: IPaidPostAccessForm) => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				paidPostAccess: paidPostAccess,
			},
		});
		navigation.navigate("PaidPost");
	};

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="Paid post"
				onClickLeft={() => navigation.goBack()}
				onClickRight={() => {}}
			/>
			<ScrollView style={tw.style("pt-6")}>
				<FansView padding={{ x: 18 }}>
					<PaidPostAccessForm
						postForm={postForm}
						handleSave={handleSave}
						roles={roles}
						tiers={tiers}
					/>
				</FansView>
			</ScrollView>
		</FansView>
	);
};

export default PaidPostAccessScreen;
