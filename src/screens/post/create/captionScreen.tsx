import CustomTopNavBar from "@components/common/customTopNavBar";
import { FansView } from "@components/controls";
import UploadProgress from "@components/posts/common/uploadProgress";
import { CaptionForm } from "@components/posts/share";
import { defaultPostFormData } from "@constants/defaultFormData";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import { createPost, updatePostById } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
	ActionType,
	MediaType,
	PostStepTypes,
	PostType,
} from "@usertypes/commonEnums";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { getCreatePostData, getPostTitleIcon } from "@utils/posts";
import useUploadFiles, {
	IUploadFileParam,
	IUploadedFile,
} from "@utils/useUploadFile";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
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
	const [caption, setCaption] = useState("");

	const handleSubmit = async () => {
		if (postForm.medias.length === 0 && postForm.type !== PostType.Text) {
			Toast.show({
				type: "error",
				text1: "Require at least one media",
			});
		}

		const action =
			postForm.id === defaultPostFormData.id
				? ActionType.Create
				: ActionType.Update;

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

		// const mediaType =
		// 	postForm.type === PostType.Video
		// 		? MediaType.Video
		// 		: postForm.type === PostType.Audio
		// 		? MediaType.Audio
		// 		: MediaType.Image;
		let uploadMedias: IUploadedFile[];

		if (action === ActionType.Create) {
			const mediaType = postForm.medias[0].type;

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
			uploadMedias = uploadResp.data;
		} else {
			uploadMedias = postForm.medias.map((v) => ({
				id: v.id ?? "",
				url: v.url ?? "",
			}));
		}

		const thumb = thumbIdx >= 0 ? uploadMedias[thumbIdx].id : undefined;
		const paidPostThumb =
			paidPostThumbIdx >= 0
				? uploadMedias[paidPostThumbIdx].id
				: undefined;
		const mediaIds = [
			...postForm.medias
				.filter((media) => !media.isPicker)
				.map((el) => el.id ?? ""),
			...mediasIdx.map((idx) => uploadMedias[idx].id),
		];
		const formIds = uploadFilesIdx.map((idx) => uploadMedias[idx].id);
		const fundraiserCover =
			fundraiserCoverIdx >= 0
				? uploadMedias[fundraiserCoverIdx].id
				: undefined;
		const pollCover =
			pollCoverIdx >= 0 ? uploadMedias[pollCoverIdx].id : undefined;
		const giveawayCover =
			giveawayCoverIdx >= 0
				? uploadMedias[giveawayCoverIdx].id
				: undefined;

		const requestData = getCreatePostData({
			postForm: {
				...postForm,
				caption: caption,
				taggedPeoples: postForm.taggedPeoples.map((tag) => ({
					...tag,
					postMediaId:
						mediaIds[
							postForm.medias.findIndex(
								(media) => media.id === tag.postMediaId,
							)
						],
				})),
			},
			thumbId: thumb,
			mediaIds,
			formIds,
			paidPostThumbId: paidPostThumb,
			fundraiserCover,
			pollCover,
			giveawayCover,
		});

		const resp =
			action === ActionType.Create
				? await createPost(requestData)
				: await updatePostById(requestData, { id: postForm.id });
		const selectedId = postForm.id;

		setInProgress(false);

		if (resp.ok) {
			dispatch.setPosts({
				type: PostsActionType.initPostForm,
				data: defaultPostFormData,
			});

			dispatch.setPosts({
				type: PostsActionType.updateLiveModal,
				data: {
					action,
					visible: true,
					postId:
						action === ActionType.Create
							? resp.data.id
							: selectedId,
					schedule: resp.data.schedule,
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
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				caption: caption,
			},
		});
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
		setCaption(val);
	};

	useEffect(() => {
		setCaption(postForm.caption);
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
				onClickLeft={handleCancel}
				onClickRight={handleSubmit}
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
						caption={caption}
						onChangeCaption={onChangeCaption}
						onNavigateLink={(link) => onNavigateLink(link.stepType)}
					/>
				</ScrollView>
			)}
		</FansView>
	);
};

export default CaptionScreen;
