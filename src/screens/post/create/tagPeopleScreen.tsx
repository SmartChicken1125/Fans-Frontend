import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import { TagPeopleForm } from "@components/posts/share";
import { useAppContext, PostsActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { IUploadForm } from "@usertypes/types";
import { getDocumentAsync } from "expo-document-picker";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const TagPeopleScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "TagPeople">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();

	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;

	const [files, setFiles] = useState<IUploadForm[]>([]);

	const onClickInviteNewUser = () => {
		navigation.navigate("Invite");
	};

	const onClickBack = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				uploadFiles: files,
			},
		});
		navigation.goBack();
	};

	const onDeleteDocument = (url: string) => {
		setFiles(files.filter((file) => file.url !== url));
	};

	const onClickDropzone = async () => {
		try {
			const result = await getDocumentAsync({
				multiple: true,
				type: "application/*",
			});

			if (!result.canceled) {
				setFiles([
					...files,
					...result.assets.map((asset) => ({
						id: "0",
						origin: asset.name,
						url: asset.uri,
						isPicker: true,
					})),
				]);
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: error as string,
			});
		}
	};

	const onCreateNewTagUser = () => {
		navigation.navigate("TagPeopleSearch");
	};

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar title="Tag people" onClickLeft={onClickBack} />
			<ScrollView style={tw.style("py-6 px-[18px]")}>
				<TagPeopleForm
					postForm={postForm}
					dispatch={dispatch}
					onClickInviteNewUser={onClickInviteNewUser}
					files={files}
					onDeleteDocument={onDeleteDocument}
					onClickDropzone={onClickDropzone}
					onCreateNewTagUser={onCreateNewTagUser}
				/>
			</ScrollView>
		</FansView>
	);
};

export default TagPeopleScreen;
