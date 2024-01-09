import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { TextPostForm } from "@components/posts/share";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostType } from "@usertypes/commonEnums";
import { PostsNavigationStacks } from "@usertypes/navigations";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const NewTextPostScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Text">,
) => {
	const { navigation } = props;

	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;

	const [text, setText] = useState("");

	const handleShare = () => {
		const textTrimmed = text.trim();

		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				caption: textTrimmed,
				type: PostType.Text,
			},
		});
		if (textTrimmed.length === 0) {
			Toast.show({
				type: "error",
				text1: "You must enter content of your post.",
			});
			return;
		}
		navigation.navigate("Caption");
	};

	useEffect(() => {
		setText(postForm.caption);
	}, [postForm.caption]);

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title="New post"
				onClickLeft={() => navigation.goBack()}
				onClickRight={handleShare}
				titleIcon="text"
				rightLabel="Share"
			/>

			<FansView style={tw.style("w-full min-h-150 px-8 mt-7")}>
				<TextPostForm value={text} onChange={(val) => setText(val)} />
			</FansView>
		</FansView>
	);
};

export default NewTextPostScreen;
