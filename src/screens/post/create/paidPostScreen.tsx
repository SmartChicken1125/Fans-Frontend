import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { PaidPostForm } from "@components/posts/share";
import { defaultPickerMedia } from "@constants/common";
import { PostsAction } from "@context/reducer/postsReducer";
import { useAppContext, PostsActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { IPostForm, IPickerMedia } from "@usertypes/types";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PaidPostScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "PaidPost">,
) => {
	const { navigation } = props;

	const insets = useSafeAreaInsets();
	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;
	const { roles, tiers } = state.profile;

	const [price, setPrice] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [coverImg, setCoverImg] = useState<IPickerMedia>(defaultPickerMedia);

	const handleUpdatePostForm = (data: Partial<IPostForm>) => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: data,
		} as PostsAction);
	};

	const handlePressAccess = () => {
		handleUpdatePostForm({
			paidPost: {
				currency: "USD",
				price: price,
				thumb: coverImg,
			},
		});
		navigation.navigate("PaidPostAccess");
	};

	const handleSave = () => {
		setIsSubmitted(true);
		if (
			price === "" ||
			parseFloat(price) > 200 ||
			parseFloat(price ?? "0") < 2
		) {
			return;
		}
		handleUpdatePostForm({
			paidPost: {
				currency: "USD",
				price: price,
				thumb: coverImg,
			},
		});
		navigation.navigate("Caption");
	};

	useEffect(() => {
		setPrice(postForm.paidPost?.price as string);
		if (postForm.paidPost) {
			setCoverImg(postForm.paidPost.thumb);
		}
	}, []);

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
				onClickRight={handleSave}
				rightLabel="Save"
			/>
			<ScrollView style={tw.style("pt-6")}>
				<PaidPostForm
					postForm={postForm}
					inProgress={false}
					tiers={tiers}
					roles={roles}
					handleUpdatePostForm={handleUpdatePostForm}
					handlePressAccess={handlePressAccess}
					handleSave={handleSave}
					price={price}
					coverImg={coverImg}
					onChangeCoverImage={(img) => setCoverImg(img)}
					isSubmitted={isSubmitted}
					onChangePrice={setPrice}
				/>
			</ScrollView>
		</FansView>
	);
};

export default PaidPostScreen;
