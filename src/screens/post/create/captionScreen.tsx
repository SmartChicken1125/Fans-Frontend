import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import UploadProgress from "@components/posts/common/uploadProgress";
import { CaptionForm } from "@components/posts/share";
import { defaultPostFormData } from "@constants/defaultFormData";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import { createPost } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType, PostStepTypes, PostType } from "@usertypes/commonEnums";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { getCreatePostData, getPostTitleIcon } from "@utils/posts";
import useUploadFiles, { IUploadFileParam } from "@utils/useUploadFile";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const CaptionScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Caption">,
) => {
	const { navigation } = props;
	const insets = useSafeAreaInsets();
	const router = useRouter();

	const { uploadFiles, progress, cancelUpload, isUploading } =
		useUploadFiles();

	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;
	const [inProgress, setInProgress] = useState(false);

	const handleCreate = async () => {
		if (postForm.medias.length === 0 && postForm.type !== PostType.Text) {
			Toast.show({
				type: "error",
				text1: "Require at least one media",
			});
		}
		setInProgress(true);

		const medias = [
			...new Set(
				[
					...postForm.medias
						.filter((media) => media.isPicker)
						.map((el) => el.uri),
					postForm.thumb.isPicker ? postForm.thumb.uri : undefined,
					postForm.paidPost?.thumb.isPicker
						? postForm.paidPost?.thumb.uri
						: undefined,
					...postForm.uploadFiles.map((el) => el.url),
					postForm.fundraiser?.cover
						? postForm.fundraiser.cover.isPicker
							? postForm.fundraiser.cover.uri
							: undefined
						: undefined,
					postForm.poll.cover
						? postForm.poll.cover.isPicker
							? postForm.poll.cover.uri
							: undefined
						: undefined,
					postForm.giveaway.cover.isPicker
						? postForm.giveaway.cover.uri
						: undefined,
				].filter((el) => !!el) as string[],
			),
		];

		const thumbIdx = medias.findIndex((el) => el === postForm.thumb.uri);
		const paidPostThumbIdx = postForm.paidPost
			? medias.findIndex((el) => el === postForm.paidPost?.thumb.uri)
			: -1;
		const mediasIdx = postForm.medias
			.map((el) => medias.findIndex((media) => media === el.uri))
			.filter((idx) => idx >= 0);
		const uploadFilesIdx = postForm.uploadFiles
			.map((el) => medias.findIndex((media) => media === el.url))
			.filter((idx) => idx >= 0);
		const fundraiserCoverIdx = postForm.fundraiser?.cover
			? medias.findIndex((el) => el === postForm.fundraiser?.cover?.uri)
			: -1;
		const pollCoverIdx = postForm.poll.cover
			? medias.findIndex((el) => el === postForm.poll.cover?.uri)
			: -1;
		const giveawayCoverIdx = postForm.giveaway.cover
			? medias.findIndex((el) => el === postForm.giveaway.cover.uri)
			: -1;

		const mediaType =
			postForm.type === PostType.Video
				? MediaType.Video
				: postForm.type === PostType.Audio
				? MediaType.Audio
				: MediaType.Image;

		const files: IUploadFileParam[] = medias.map((uri) => ({
			uri,
			type: MediaType.Image,
		}));
		for (const idx of mediasIdx) {
			files[idx].type = mediaType;
		}

		const uploadResp = await uploadFiles(files);
		if (files.length > 0 && !uploadResp.ok) {
			Toast.show({
				type: "error",
				text1: uploadResp.errorString ?? "Failed to upload files",
			});
			setInProgress(false);
			return;
		}

		const thumb = thumbIdx >= 0 ? uploadResp.data[thumbIdx].id : undefined;
		const paidPostThumb =
			paidPostThumbIdx >= 0
				? uploadResp.data[paidPostThumbIdx].id
				: undefined;
		const mediaIds = mediasIdx.map((idx) => uploadResp.data[idx].id);
		const formIds = uploadFilesIdx.map((idx) => uploadResp.data[idx].id);
		const fundraiserCover =
			fundraiserCoverIdx >= 0
				? uploadResp.data[fundraiserCoverIdx].id
				: undefined;
		const pollCover =
			pollCoverIdx >= 0 ? uploadResp.data[pollCoverIdx].id : undefined;
		const giveawayCover =
			giveawayCoverIdx >= 0
				? uploadResp.data[giveawayCoverIdx].id
				: undefined;

		const resp = await createPost(
			getCreatePostData({
				postForm,
				thumbId: thumb,
				mediaIds,
				formIds,
				paidPostThumbId: paidPostThumb,
				fundraiserCover,
				pollCover,
				giveawayCover,
			}),
		);

		setInProgress(false);

		if (resp.ok) {
			dispatch.setPosts({
				type: PostsActionType.initPostForm,
				data: defaultPostFormData,
			});

			dispatch.setPosts({
				type: PostsActionType.updateLiveModal,
				data: {
					visible: true,
					postId: resp.data.id,
				},
			});

			router.push({
				pathname: "profile",
				params: { screen: "Profile" },
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleCancel = () => {
		navigation.goBack();
	};

	const onNavigateLink = (stepType: PostStepTypes) => {
		switch (stepType) {
			case PostStepTypes.ViewSetting:
				return navigation.navigate("ViewSetting");
			case PostStepTypes.Categories:
				return navigation.navigate("Categories");
			case PostStepTypes.PaidPost:
				return navigation.navigate("PaidPost");
			case PostStepTypes.AddPoll:
				return navigation.navigate("Poll");
			case PostStepTypes.TagPeople:
				return navigation.navigate("TagPeople");
			case PostStepTypes.AddGiveaway:
				return navigation.navigate("Giveaway");
			case PostStepTypes.Location:
				return navigation.navigate("Location");
			case PostStepTypes.Schedule:
				return navigation.navigate("Schedule");
			case PostStepTypes.AddFundraiser:
				return navigation.navigate("Fundraiser");
			case PostStepTypes.AdvancedSettings:
				return navigation.navigate("AdvancedSettings");
			default:
				return navigation.navigate("ViewSetting");
		}
	};

	const onChangeCaption = (val: string) => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				caption: val,
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
				title="New post"
				onClickLeft={handleCancel}
				onClickRight={handleCreate}
				rightLabel="Share"
				titleIcon={getPostTitleIcon(postForm.type)}
				loading={inProgress}
			/>
			{inProgress ? (
				<UploadProgress progress={progress} onCancel={cancelUpload} />
			) : (
				<ScrollView
					contentContainerStyle={{
						paddingBottom: insets.bottom,
						paddingTop: 24,
						paddingHorizontal: 18,
					}}
				>
					<CaptionForm
						data={postForm}
						caption={postForm.caption}
						onChangeCaption={onChangeCaption}
						onNavigateLink={(link) => onNavigateLink(link.stepType)}
					/>
				</ScrollView>
			)}
		</FansView>
	);
};

export default CaptionScreen;
