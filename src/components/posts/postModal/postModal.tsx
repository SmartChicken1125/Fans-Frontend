import { FypModal, FypNullableView } from "@components/common/base";
import { FansView } from "@components/controls";
import { defaultPostFormData } from "@constants/defaultFormData";
import { PostsAction } from "@context/reducer/postsReducer";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import { createPost, updatePostById } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import {
	ActionType,
	IconTypes,
	MediaType,
	PostStepTypes,
	PostType,
} from "@usertypes/commonEnums";
import {
	IFundraiserForm,
	IMediaFile,
	IPickerMedia,
	IPollForm,
	IPostForm,
} from "@usertypes/types";
import { getCreatePostData } from "@utils/posts";
import useUploadFiles, {
	IUploadFileParam,
	IUploadedFile,
} from "@utils/useUploadFile";
import useUploadPostForm from "@utils/useUploadPostForm";
import moment from "moment";
import React, { useState } from "react";
import Toast from "react-native-toast-message";
import AddGiveawayScreen from "./addGiveawayScreen";
import AddPollScreen from "./addPollScreen";
import AdvancedSettingsScreen from "./advancedSettingsScreen";
import AnalyzeFansLevelScreen from "./analyzeFansLevelScreen";
import AudioDetailScreen from "./audioDetailScreen";
import CaptionScreen from "./captionScreen";
import CategoriesScreen from "./categoriesScreen";
import FundraiserScreen from "./fundraiserScreen";
import InviteNewUserScreen from "./inviteNewUserScreen";
import LocationScreen from "./locationScreen";
import NewCategoryScreen from "./newCategoryScreen";
import NewTierScreen from "./newTierScreen";
import PaidPostAccessScreen from "./paidPostAccessScreen";
import PaidPostScreen from "./paidPostScreen";
import RoleScreen from "./roleScreen";
import ScheduleScreen from "./scheduleScreen";
import TagPeopleScreen from "./tagPeopleScreen";
import TagPeopleSearchScreen from "./tagPeopleSearchScreen";
import TextScreen from "./textScreen";
import ThumbnailScreen from "./thumbnailScreen";
import VaultScreen from "./vaultScreen";
import ViewSettingScreen from "./viewSettingScreen";

export const titleIcons = {
	[PostType.Media]: IconTypes.Image,
	[PostType.Photo]: IconTypes.Image,
	[PostType.Video]: IconTypes.VideoCamera,
	[PostType.Audio]: IconTypes.Music,
	[PostType.Fundraiser]: IconTypes.Fundraiser,
	[PostType.Poll]: IconTypes.Poll,
	[PostType.Story]: IconTypes.Story,
	[PostType.Text]: IconTypes.Text,
	[PostType.Vault]: IconTypes.Vault,
	[PostType.Products]: IconTypes.Text,
	[PostType.GoLive]: IconTypes.Text,
};

const PostModal = () => {
	const { uploadFiles, progress, cancelUpload } = useUploadFiles();
	const [uploadPostForm] = useUploadPostForm();
	const { state, dispatch } = useAppContext();

	const { postForm } = state.posts;
	const { roles, categories, stories, tiers, subscriptionType } =
		state.profile;
	const { visible, step } = state.posts.modal;

	const [roleId, setRoleId] = useState("");
	const [inProgress, setInProgress] = useState(false);
	const [prevScreen, setPrevScreen] = useState<PostStepTypes>(
		PostStepTypes.ViewSetting,
	);

	const handleUpdatePostForm = (data: Partial<IPostForm>) => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: data,
		} as PostsAction);
	};

	const handleClose = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostModal,
			data: {
				visible: false,
				step: PostStepTypes.Empty,
			},
		});
	};

	const handleClearForm = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostModal,
			data: {
				visible: false,
				step: PostStepTypes.Empty,
			},
		});
		dispatch.setPosts({
			type: PostsActionType.initPostForm,
			data: defaultPostFormData,
		});
	};

	const handleChangeTab = (tab: PostStepTypes) => {
		dispatch.setPosts({
			type: PostsActionType.updatePostModal,
			data: {
				visible: true,
				step: tab,
			},
		});
	};

	const createNewStory = async (medias: IPickerMedia[]) => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				medias: medias,
				secondStep: undefined,
			},
		});

		handleClose();

		dispatch.setPosts({
			type: PostsActionType.updateStoryModal,
			data: {
				visible: true,
			},
		});
	};

	const handleSubmit = async () => {
		if (
			postForm.medias.length === 0 &&
			![PostType.Text, PostType.Fundraiser].includes(postForm.type)
		) {
			Toast.show({
				type: "error",
				text1: "Require at least one media",
			});
			return;
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
						.map((el) => ({ url: el.uri, type: el.type })),
					postForm.thumb.isPicker
						? { url: postForm.thumb.uri, type: postForm.thumb.type }
						: undefined,
					...(postForm.paidPost?.thumbs ?? [])
						.filter((media) => media.isPicker)
						.map((el) => ({ url: el.uri, type: el.type })),
					...postForm.uploadFiles.map((el) => ({
						url: el.url,
						type: MediaType.Image,
					})),
					postForm.fundraiser?.cover
						? postForm.fundraiser.cover.isPicker
							? {
									url: postForm.fundraiser.cover.uri,
									type: postForm.fundraiser.cover.type,
							  }
							: undefined
						: undefined,
					postForm.poll.cover
						? postForm.poll.cover.isPicker
							? {
									url: postForm.poll.cover.uri,
									type: postForm.poll.cover.type,
							  }
							: undefined
						: undefined,
					postForm.giveaway.cover.isPicker
						? {
								url: postForm.giveaway.cover.uri,
								type: postForm.giveaway.cover.type,
						  }
						: undefined,
				].filter((el) => !!el && el.url != "") as IMediaFile[],
			),
		];

		const thumbIdx = medias.findIndex(
			(el) => el.url === postForm.thumb.uri,
		);
		const paidPostThumbsIds = postForm.paidPost
			? postForm.paidPost.thumbs
					.map((el) =>
						medias.findIndex((media) => media.url === el.uri),
					)
					.filter((idx) => idx >= 0)
			: [];
		const mediasIdx = postForm.medias
			.map((el) => medias.findIndex((media) => media.url === el.uri))
			.filter((idx) => idx >= 0);
		const uploadFilesIdx = postForm.uploadFiles
			.map((el) => medias.findIndex((media) => media.url === el.url))
			.filter((idx) => idx >= 0);
		const fundraiserCoverIdx = postForm.fundraiser?.cover
			? medias.findIndex(
					(el) => el.url === postForm.fundraiser?.cover?.uri,
			  )
			: -1;
		const pollCoverIdx = postForm.poll.cover
			? medias.findIndex((el) => el.url === postForm.poll.cover?.uri)
			: -1;
		const giveawayCoverIdx = postForm.giveaway.cover
			? medias.findIndex((el) => el.url === postForm.giveaway.cover.uri)
			: -1;

		// const mediaType =
		// 	postForm.type === PostType.Video
		// 		? MediaType.Video
		// 		: postForm.type === PostType.Audio
		// 		? MediaType.Audio
		// 		: MediaType.Image;

		let uploadMedias: IUploadedFile[];

		if (action === ActionType.Create) {
			const files: IUploadFileParam[] = medias.map((media) => ({
				uri: media.url,
				type: media.type,
			}));

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
		const paidPostThumbIds = [
			...paidPostThumbsIds.map((idx) => uploadMedias[idx].id),
		];
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
			postForm: postForm,
			thumbId: thumb,
			mediaIds,
			formIds,
			paidPostThumbIds: paidPostThumbIds,
			fundraiserCover,
			pollCover,
			giveawayCover,
		});
		console.log(requestData, postForm);

		const resp =
			action === ActionType.Create
				? await createPost(requestData)
				: await updatePostById(requestData, { id: postForm.id });
		const selectedId = postForm.id;
		setInProgress(false);
		handleClearForm();
		dispatch.setPosts({
			type: PostsActionType.initPostForm,
			data: defaultPostFormData,
		});
		if (resp.ok) {
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
					postType: postForm.type,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleCreatePollPost = async (poll: IPollForm) => {
		setInProgress(true);
		let coverImgId = "";
		if (poll.cover && poll.cover.uri !== "") {
			const uploaded = await uploadFiles(
				poll.cover
					? [{ uri: poll.cover.uri, type: MediaType.Image }]
					: [],
			);
			if (uploaded.ok) {
				coverImgId = uploaded.data[0].id;
			} else {
				Toast.show({
					type: "error",
					text1: uploaded.error?.message ?? "Failed to upload files",
				});
			}
		}
		const { cover, ..._poll } = poll;
		const postBody = {
			title: "",
			type: PostType.Poll,
			caption: "",
			poll: {
				..._poll,
				thumbId: coverImgId,
				endDate: moment(poll.endDate).utcOffset("+000", true).format(),
			},
		};
		const resp = await createPost(postBody);
		setInProgress(false);
		handleClearForm();
		dispatch.setPosts({
			type: PostsActionType.initPostForm,
			data: defaultPostFormData,
		});
		if (resp.ok) {
			dispatch.setPosts({
				type: PostsActionType.updateLiveModal,
				data: {
					visible: true,
					postId: resp.data.id,
					postType: PostType.Poll,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleCreateFundraiserPost = async (fundraiser: IFundraiserForm) => {
		setInProgress(true);
		let coverImgId = "";
		if (fundraiser.cover && fundraiser.cover.uri !== "") {
			const uploaded = await uploadFiles(
				fundraiser.cover
					? [{ uri: fundraiser.cover.uri, type: MediaType.Image }]
					: [],
			);
			if (uploaded.ok) {
				coverImgId = uploaded.data[0].id;
			} else {
				Toast.show({
					type: "error",
					text1: uploaded.error?.message ?? "Failed to upload files",
				});
			}
		}

		const fundraiserPrice = parseFloat(fundraiser.price);
		if (isNaN(fundraiserPrice) || fundraiserPrice <= 0) {
			Toast.show({
				type: "error",
				text1: "Invalid price",
			});
			return;
		}

		const postBody = {
			title: "",
			type: PostType.Fundraiser,
			caption: "",
			fundraiser: {
				...fundraiser,
				price: fundraiserPrice,
				thumbId: coverImgId,
				startDate: moment(fundraiser.startDate)
					.utcOffset("+000", true)
					.format(),
				endDate: moment(fundraiser.endDate)
					.utcOffset("+000", true)
					.format(),
			},
		};
		const resp = await createPost(postBody);
		setInProgress(false);
		handleClearForm();
		dispatch.setPosts({
			type: PostsActionType.initPostForm,
			data: defaultPostFormData,
		});
		if (resp.ok) {
			dispatch.setPosts({
				type: PostsActionType.updateLiveModal,
				data: {
					visible: true,
					postId: resp.data.id,
					postType: PostType.Fundraiser,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	return (
		<FypModal
			visible={visible}
			onDismiss={handleClose}
			width={{
				xs: "screen",
				md: ![PostStepTypes.Thumbnail, PostStepTypes.Vault].includes(
					step,
				)
					? 950
					: 740,
				xl: ![PostStepTypes.Thumbnail, PostStepTypes.Vault].includes(
					step,
				)
					? 1150
					: 740,
			}}
		>
			<FansView
				position="relative"
				style={tw.style("pt-[50px] md:pt-[100px]")}
			>
				<FypNullableView
					visible={
						![PostType.Text].includes(postForm.type) &&
						step !== PostStepTypes.Vault
					}
				>
					<ThumbnailScreen
						inProgress={inProgress}
						data={postForm}
						handlePrev={handleClearForm}
						titleIcon={titleIcons[postForm.type]}
						handleCreateStory={createNewStory}
						handleChangeTab={handleChangeTab}
						step={step}
						dispatch={dispatch}
						progress={progress}
						handleCancelUpload={cancelUpload}
					/>
				</FypNullableView>

				<FypNullableView visible={step === PostStepTypes.Vault}>
					<VaultScreen
						data={postForm}
						handlePrev={handleClearForm}
						titleIcon={titleIcons[postForm.type]}
						dispatch={dispatch}
						handleChangeTab={handleChangeTab}
					/>
				</FypNullableView>

				<FypNullableView visible={step === PostStepTypes.Text}>
					<TextScreen
						data={postForm}
						titleIcon={titleIcons[postForm.type]}
						handlePrev={handleClearForm}
						handleChangeTab={handleChangeTab}
						dispatch={dispatch}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.Caption}>
					<CaptionScreen
						data={postForm}
						inProgress={inProgress}
						progress={progress}
						titleIcon={titleIcons[postForm.type]}
						handleClearForm={handleClearForm}
						handleNext={handleSubmit}
						handleChangeTab={handleChangeTab}
						handleUpdatePostForm={handleUpdatePostForm}
					/>
				</FypNullableView>
				<FypNullableView
					visible={step === PostStepTypes.AdvancedSettings}
				>
					<AdvancedSettingsScreen
						data={postForm}
						handlePrev={() =>
							handleChangeTab(PostStepTypes.Caption)
						}
						dispatch={dispatch}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.Schedule}>
					<ScheduleScreen
						data={postForm}
						handlePrev={() =>
							handleChangeTab(PostStepTypes.Caption)
						}
						dispatch={dispatch}
						handleChangeTab={handleChangeTab}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.ViewSetting}>
					<ViewSettingScreen
						data={postForm}
						inProgress={inProgress}
						roles={roles}
						tiers={tiers}
						subscriptionType={subscriptionType}
						handleChangeTab={handleChangeTab}
						handleChangeRole={(roleId) => {
							setRoleId(roleId);
							setPrevScreen(PostStepTypes.ViewSetting);
							handleChangeTab(PostStepTypes.Role);
						}}
						setInProgress={setInProgress}
						handleUpdatePostForm={handleUpdatePostForm}
						dispatch={dispatch}
						setPrevScreen={setPrevScreen}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.Role}>
					<RoleScreen
						data={postForm}
						inProgress={inProgress}
						roles={roles}
						roleId={roleId}
						handleChangeTab={handleChangeTab}
						setInProgress={setInProgress}
						dispatch={dispatch}
						prevScreen={prevScreen}
					/>
				</FypNullableView>
				<FypNullableView
					visible={step === PostStepTypes.AnalyzeFansLevels}
				>
					<AnalyzeFansLevelScreen
						data={postForm}
						handleChangeTab={handleChangeTab}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.Categories}>
					<CategoriesScreen
						categories={categories}
						data={postForm}
						handleChangeTab={handleChangeTab}
						dispatch={dispatch}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.NewCategory}>
					<NewCategoryScreen
						data={postForm}
						roles={roles}
						inProgress={inProgress}
						handleChangeTab={handleChangeTab}
						setInProgress={setInProgress}
						handleChangeRole={(roleId) => {
							setRoleId(roleId);
							setPrevScreen(PostStepTypes.NewCategory);
							handleChangeTab(PostStepTypes.Role);
						}}
						dispatch={dispatch}
						categories={categories}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.Location}>
					<LocationScreen
						data={postForm}
						handleChangeTab={handleChangeTab}
						handleUpdatePostForm={handleUpdatePostForm}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.PaidPost}>
					<PaidPostScreen
						data={postForm}
						tiers={tiers}
						roles={roles}
						inProgress={inProgress}
						handleChangeTab={handleChangeTab}
						handleUpdatePostForm={handleUpdatePostForm}
					/>
				</FypNullableView>
				<FypNullableView
					visible={step === PostStepTypes.PaidPostAccess}
				>
					<PaidPostAccessScreen
						data={postForm}
						tiers={tiers}
						roles={roles}
						inProgress={inProgress}
						handleChangeTab={handleChangeTab}
						handleUpdatePostForm={handleUpdatePostForm}
					/>
				</FypNullableView>
				<FypNullableView
					visible={
						step === PostStepTypes.AddPoll ||
						step === PostStepTypes.NewPollPost
					}
				>
					<AddPollScreen
						data={postForm}
						handleChangeTab={handleChangeTab}
						handleCreate={handleCreatePollPost}
						step={step}
						handleCloseModal={handleClose}
						dispatch={dispatch}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.TagPeople}>
					<TagPeopleScreen
						data={postForm}
						handleChangeTab={handleChangeTab}
						dispatch={dispatch}
					/>
				</FypNullableView>
				<FypNullableView
					visible={step === PostStepTypes.TagPeopleSearch}
				>
					<TagPeopleSearchScreen
						data={postForm}
						handleChangeTab={handleChangeTab}
						dispatch={dispatch}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.InviteNewUser}>
					<InviteNewUserScreen
						data={postForm}
						inProgress={inProgress}
						setInProgress={setInProgress}
						handleChangeTab={handleChangeTab}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.AddGiveaway}>
					<AddGiveawayScreen
						data={postForm}
						handleChangeTab={handleChangeTab}
						handleUpdatePostForm={handleUpdatePostForm}
					/>
				</FypNullableView>
				<FypNullableView
					visible={
						step === PostStepTypes.AddFundraiser ||
						step === PostStepTypes.NewFundraiserPost
					}
				>
					<FundraiserScreen
						data={postForm}
						step={step}
						handleChangeTab={handleChangeTab}
						handleCreatePost={handleCreateFundraiserPost}
						handleCloseModal={handleClose}
						dispatch={dispatch}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.AudioDetail}>
					<AudioDetailScreen
						data={postForm}
						inProgress={inProgress}
						dispatch={dispatch}
						handleChangeTab={handleChangeTab}
					/>
				</FypNullableView>
				<FypNullableView visible={step === PostStepTypes.NewTier}>
					<NewTierScreen
						data={postForm}
						tiers={tiers}
						dispatch={dispatch}
						prevScreen={prevScreen}
						handleChangeTab={handleChangeTab}
					/>
				</FypNullableView>
			</FansView>
		</FypModal>
	);
};

export default PostModal;
