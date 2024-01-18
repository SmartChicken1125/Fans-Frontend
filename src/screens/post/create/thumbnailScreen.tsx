import {
	ChevronDownSvg,
	MusicSvg,
	PlusSvg,
	SearchSvg,
} from "@assets/svgs/common";
import { FypNullableView, FypSvg } from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import ImageEditorModal from "@components/common/imageEditor/imageEditorModal";
import { FansIconButton, FansText, FansView } from "@components/controls";
import { AudioItem, ImagePostChip } from "@components/posts/common";
import { defaultPostFormData } from "@constants/defaultFormData";
import {
	PostsActionType,
	ProfileActionType,
	useAppContext,
} from "@context/useAppContext";
import { createStory } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MediaType, PostType } from "@usertypes/commonEnums";
import { PostsNavigationStacks } from "@usertypes/navigations";
import { IPickerMedia } from "@usertypes/types";
import { getPostTitleIcon } from "@utils/posts";
import useDocumentPicker from "@utils/useDocumentPicker";
import useUploadFiles from "@utils/useUploadFile";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const ThumbnailScreen = (
	props: NativeStackScreenProps<PostsNavigationStacks, "Thumbnail">,
) => {
	const { navigation } = props;

	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { state, dispatch } = useAppContext();
	const { postForm } = state.posts;
	const { stories } = state.profile;

	const { uploadFiles } = useUploadFiles();
	const { useVideoPicker, useAudioPicker, useImagePicker } =
		useDocumentPicker();

	const [medias, setMedias] = useState<IPickerMedia[]>([]);
	const [selectedMedias, setSelectedMedias] = useState<IPickerMedia[]>([]);
	const [inProgress, setInProgress] = useState(false);
	const [openImageEditor, setOpenImageEditor] = useState(false);
	const [editingImageId, setEditingEditId] = useState("");

	const createNewStory = async () => {
		setInProgress(true);
		let uploadedUrls: { id: string; url: string }[] = [];
		if (medias.length > 0) {
			const resp = await uploadFiles(
				medias.map((m) => ({ uri: m.uri, type: MediaType.Image })),
			);

			if (resp?.ok) {
				uploadedUrls = resp.data;
			} else {
				Toast.show({
					type: "error",
					text1: "Failed to upload videos",
				});
			}
		}
		const postBody = {
			mediaIds: uploadedUrls.map((el) => el.id),
		};
		const resp = await createStory(postBody);
		setInProgress(false);
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					stories: [...stories, resp.data],
				},
			});
			router.push({
				pathname: "profile",
				params: { screen: "Profile" },
			});
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
		} else {
			Toast.show({
				type: "error",
				text1: "Failed to create new story",
			});
		}
	};

	const handleNext = async () => {
		if (selectedMedias.length === 0) {
			return;
		}
		if (postForm.type === PostType.Audio) {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					medias: medias,
				},
			});
			navigation.navigate("AudioDetail");
		} else if (postForm.type === PostType.Story) {
			createNewStory();
		} else {
			if (postForm.type === PostType.Video) {
				dispatch.setPosts({
					type: PostsActionType.updatePostForm,
					data: {
						medias: selectedMedias,
					},
				});
			} else {
				dispatch.setPosts({
					type: PostsActionType.updatePostForm,
					data: {
						thumb: selectedMedias[0],
						medias: selectedMedias,
					},
				});
			}
			navigation.navigate("Caption");
		}
	};

	const handleCancel = () => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: defaultPostFormData,
		});
		navigation.goBack();
	};

	const onToggleMedia = (media: IPickerMedia) => {
		let reorderedVideos = [];
		if (selectedMedias.map((el) => el.uri).includes(media.uri)) {
			reorderedVideos = selectedMedias.filter(
				(el) => el.uri !== media.uri,
			);
		} else {
			reorderedVideos = [...selectedMedias, media];
		}
		setSelectedMedias(reorderedVideos);
	};

	const onSelectMore = async () => {
		if (postForm.type === PostType.Video) {
			const videoResult = await useVideoPicker(true);
			if (videoResult.ok) {
				setMedias([...medias, ...videoResult.data]);
				setSelectedMedias([
					...selectedMedias,
					...(videoResult.data ?? []),
				]);
			} else {
				Toast.show({
					type: "error",
					text1: videoResult?.message ?? "",
				});
			}
		} else {
			const imgResult = await useImagePicker(true);
			if (imgResult.ok) {
				setMedias([...medias, ...imgResult.data]);
				setSelectedMedias([...selectedMedias, ...imgResult.data]);
			} else {
				Toast.show({
					type: "error",
					text1: imgResult?.message ?? "",
				});
			}
		}
	};

	const openAudioPicker = async () => {
		const result = await useAudioPicker();
		if (result.ok) {
			setMedias(result.data);
			setSelectedMedias(result.data);
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	const handleOpenImageEditor = (id: string) => {
		setEditingEditId(id);
		setOpenImageEditor(true);
	};

	const handleImageEditingComplete = (uri: string) => {
		setOpenImageEditor(false);
		setMedias(
			medias.map((media) =>
				media.id === editingImageId ? { ...media, uri: uri } : media,
			),
		);
		setSelectedMedias(
			selectedMedias.map((media) =>
				media.id === editingImageId ? { ...media, uri: uri } : media,
			),
		);
	};

	useEffect(() => {
		setMedias(postForm.medias);
		setSelectedMedias(postForm.medias);
	}, [postForm.medias]);

	return (
		<FansView
			flex="1"
			position="relative"
			padding={{ t: insets.top }}
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			<CustomTopNavBar
				title={
					postForm.type === PostType.Story ? "New Story" : "New post"
				}
				onClickLeft={handleCancel}
				onClickRight={handleNext}
				rightLabel={
					postForm.type === PostType.Story ? "Publish" : "Next"
				}
				titleIcon={getPostTitleIcon(postForm.type)}
				leftIcon="close"
				loading={inProgress}
			/>
			<FansView flex="1" padding={{ b: insets.bottom }}>
				<FansView flexDirection="row" flexWrap="wrap">
					<FypNullableView
						visible={
							![PostType.Audio, PostType.Story].includes(
								postForm.type,
							)
						}
					>
						{medias.map((media) => (
							<ImagePostChip
								colSpan={medias.length > 1 ? 2 : 1}
								uri={media.uri}
								key={media.uri}
								onPress={() => onToggleMedia(media)}
								orderNumber={
									selectedMedias.findIndex(
										(cell) => cell.uri === media.uri,
									) + 1
								}
								orderAble={
									medias.length > 1 &&
									postForm.type !== PostType.Story &&
									postForm.type !== PostType.Audio
								}
								isVideo={postForm.type === PostType.Video}
								showTransform={postForm.type === PostType.Photo}
								onPressTransform={() =>
									handleOpenImageEditor(media.id ?? "")
								}
							/>
						))}
					</FypNullableView>

					<FypNullableView visible={postForm.type === PostType.Audio}>
						<FansView
							height={393}
							flexDirection="row"
							alignItems="center"
							justifyContent="center"
							width="full"
						>
							<MusicSvg size={58.5} color="#a854f5" />
						</FansView>

						<FansView
							flexDirection="row"
							alignItems="center"
							justifyContent="between"
							padding={{ y: 10, r: 18, l: 30 }}
							width="full"
							style={tw.style(
								"border-b border-fans-grey dark:border-fans-grey-43",
							)}
						>
							<FansView flexDirection="row" alignItems="center">
								<FansText
									style={tw.style(
										"font-bold mr-4 text-fans-black dark:text-fans-white",
									)}
									fontSize={19}
									lineHeight={26}
								>
									Recents
								</FansText>
								<FypSvg
									svg={ChevronDownSvg}
									width={10}
									height={10}
									color="fans-black dark:fans-white"
								/>
							</FansView>

							<FansView
								flexDirection="row"
								gap={8}
								style={tw.style("ml-auto")}
							>
								<Button
									style={tw.style(
										"bg-fans-grey dark:bg-fans-grey-43 ml-auto",
									)}
									labelStyle={tw.style(
										"text-[17px] leading-[22px] m-0 px-5 py-[6px] text-fans-black dark:text-fans-white font-normal",
									)}
									onPress={openAudioPicker}
								>
									Upload audio
								</Button>
								<FansIconButton>
									<FypSvg
										svg={SearchSvg}
										width={13.26}
										height={13.26}
										color="fans-black dark:fans-white"
									/>
								</FansIconButton>
							</FansView>
						</FansView>

						<FansView padding={{ x: 18 }} width="full">
							{medias.map((audio) => (
								<AudioItem
									key={audio.uri}
									data={audio}
									onDelete={() => {
										setMedias([]);
										setSelectedMedias([]);
									}}
									textProps={{
										numberOfLines: 1,
									}}
								/>
							))}
						</FansView>
					</FypNullableView>
				</FansView>
				<FypNullableView visible={postForm.type === PostType.Story}>
					<Image
						source={{
							uri: medias[0]?.uri,
						}}
						style={[tw.style("h-full w-full")]}
					/>
				</FypNullableView>
				<FypNullableView
					visible={
						![PostType.Story, PostType.Audio].includes(
							postForm.type,
						)
					}
				>
					<FansView
						margin={{ t: 48 }}
						padding={{ b: 20 }}
						alignItems="center"
					>
						<FansView
							width={56}
							height={56}
							background="fans-purple"
							touchableOpacityProps={{
								onPress: onSelectMore,
							}}
							borderRadius={56}
							alignItems="center"
							justifyContent="center"
						>
							<FypSvg
								svg={PlusSvg}
								width={24}
								height={24}
								color="fans-white"
							/>
						</FansView>
					</FansView>
				</FypNullableView>
			</FansView>
			<ImageEditorModal
				visible={openImageEditor}
				onCloseEditor={() => setOpenImageEditor(false)}
				imageUri={
					medias.find((media) => media.id === editingImageId)?.uri
				}
				fixedCropAspectRatio={16 / 9}
				lockAspectRatio={false}
				minimumCropDimensions={{
					width: 100,
					height: 100,
				}}
				onEditingComplete={(result) => {
					handleImageEditingComplete(result.uri);
				}}
			/>
		</FansView>
	);
};

export default ThumbnailScreen;
