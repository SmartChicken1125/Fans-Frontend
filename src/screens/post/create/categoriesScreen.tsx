import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { CategoriesForm } from "@components/posts/share";
import { useAppContext, PostsActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import React from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CategoriesScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Categories">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;
	const { categories } = state.profile;

	const handleClickNewCategory = () => {
		navigation.navigate("NewCategory");
	};

	const onUpdateCategories = (categoryIds: string[]) => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				categories: categoryIds,
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
				title="Add to category"
				onClickLeft={() => navigation.goBack()}
				rightLabel="Save"
				onClickRight={() => navigation.goBack()}
			/>
			<ScrollView
				style={{
					paddingTop: 24,
					paddingHorizontal: 18,
				}}
			>
				<CategoriesForm
					postForm={postForm}
					categories={categories}
					onClickNewCategory={handleClickNewCategory}
					onUpdateCategories={onUpdateCategories}
				/>
			</ScrollView>
		</FansView>
	);
};

export default CategoriesScreen;
