import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { TagPeopleSearchForm } from "@components/posts/share";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import React from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TagPeopleSearchScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "TagPeopleSearch">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();
	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;

	const onBack = () => {
		navigation.navigate("TagPeople");
	};

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="Tag people"
				onClickLeft={onBack}
				rightLabel="Save"
				onClickRight={onBack}
			/>
			<ScrollView style={tw.style("py-6 px-[18px]")}>
				<TagPeopleSearchForm
					postForm={postForm}
					dispatch={dispatch}
					onSaveCallback={onBack}
				/>
			</ScrollView>
		</FansView>
	);
};

export default TagPeopleSearchScreen;
