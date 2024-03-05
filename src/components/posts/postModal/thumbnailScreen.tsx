import {
	Photos1Svg,
	TransformSvg,
	ImageSvg,
	LockSvg,
	Check1Svg,
} from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import {
	FypNullableView,
	FypSvg,
	FypVideo,
	FypText,
} from "@components/common/base";
import { ImageEditor } from "@components/common/imageEditor/imageEditor";
import {
	FansGap,
	FansIconButton,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import { AudioItem } from "@components/posts/common";
import { IAppDispatch } from "@context/appContext";
import { PostsActionType } from "@context/reducer/postsReducer";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import {
	IconTypes,
	MediaType,
	PostStepTypes,
	PostType,
	ResizeMode,
	UserRoleTypes,
} from "@usertypes/commonEnums";
import { IPickerMedia, IPostForm } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import { Image as ExpoImage } from "expo-image";
import React, { FC, useEffect, useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import PostLockIcon from "../common/postLockIcon";
import UploadProgress from "../common/uploadProgress";
import AddResourceBar from "./addResourceBar";
import ModalHeader from "./modalHeader";

interface FileDropzoneProps {
	onPress: () => void;
}

const FileDropzone: FC<FileDropzoneProps> = (props) => {
	const { onPress } = props;
	return (
		<FansView alignItems="center" justifyContent="center" height="full">
			<TouchableOpacity onPress={onPress}>
				<FansView
					style={tw.style(
						"h-[162px] w-70",
						"border border-fans-grey-dark border-dashed rounded-[7px]",
						"flex justify-center items-center",
					)}
				>
					<FansSvg width={77.44} height={70.96} svg={Photos1Svg} />
					<FansGap height={13.3} />
					<FansText style={tw.style("text-[17px]")}>
						Drop image here or{" "}
						<FansText
							style={tw.style(
								"font-inter-semibold",
								"text-[17px] text-fans-purple",
							)}
						>
							browse
						</FansText>
					</FansText>
				</FansView>
			</TouchableOpacity>
			<FansView style={tw.style("w-70 mt-5")}>
				<RoundButton onPress={onPress}>Pick from computer</RoundButton>
			</FansView>
		</FansView>
	);
};

interface PaidPostViewTypeProps {
	viewType: UserRoleTypes;
	onChange: (val: UserRoleTypes) => void;
	post: IPostForm;
}

const PaidPostViewType: FC<PaidPostViewTypeProps> = (props) => {
	const { viewType, onChange, post } = props;

	return (
		<FansView padding={{ t: 14, x: 75 }}>
			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
			>
				<FansView flexDirection="row" alignItems="center" gap={8}>
					<FypSvg
						svg={ImageSvg}
						width={14}
						height={14}
						color="fans-grey-48 dark:fans-grey-b1"
					/>
					<FypText
						fontSize={17}
						fontWeight={500}
						lineHeight={22}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
						)}
					>
						{post.medias.length}
					</FypText>
				</FansView>
				<FansView flexDirection="row" alignItems="center" gap={7}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={500}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
						)}
					>
						{`$${post.paidPost?.price ?? 0}`}
					</FypText>
					<FypSvg
						width={10}
						height={13}
						svg={LockSvg}
						color="fans-grey-48 dark:fans-grey-b1"
					/>
				</FansView>
			</FansView>
			<FansGap height={14} />
			<FypText
				fontSize={17}
				fontWeight={600}
				lineHeight={22}
				textAlign="center"
				margin={{ b: 16 }}
			>
				Viewing as
			</FypText>
			<FansView
				width={358}
				height={42}
				alignSelf="center"
				flexDirection="row"
				padding={{ x: 5, y: 4 }}
				style={tw.style(
					viewType === UserRoleTypes.Creator
						? "bg-fans-grey-48 dark:bg-fans-grey-b1"
						: "bg-fans-purple",
				)}
				borderRadius={42}
			>
				<FansView
					flex="1"
					alignItems="center"
					justifyContent="center"
					position="relative"
					borderRadius={40}
					style={tw.style(
						viewType === UserRoleTypes.Creator
							? "bg-fans-white dark:bg-fans-black-1d"
							: "",
					)}
					pressableProps={{
						onPress: () => onChange(UserRoleTypes.Creator),
					}}
				>
					<FypSvg
						svg={Check1Svg}
						width={18}
						height={14}
						color="fans-black dark:fans-white"
						style={tw.style(
							"absolute left-[14px] top-[10px]",
							viewType === UserRoleTypes.Fan ? "hidden" : "",
						)}
					/>
					<FypText
						fontSize={18}
						fontWeight={
							viewType === UserRoleTypes.Creator ? 600 : 500
						}
						lineHeight={24}
						style={tw.style(
							viewType === UserRoleTypes.Creator
								? "text-fans-black dark:text-fans-white"
								: "text-fans-white",
						)}
					>
						Creator
					</FypText>
				</FansView>
				<FansView
					flex="1"
					alignItems="center"
					justifyContent="center"
					position="relative"
					borderRadius={40}
					style={tw.style(
						viewType === UserRoleTypes.Fan
							? "bg-fans-white dark:bg-fans-black-1d"
							: "",
					)}
					pressableProps={{
						onPress: () => onChange(UserRoleTypes.Fan),
					}}
				>
					<FypSvg
						svg={Check1Svg}
						width={18}
						height={14}
						color="fans-black dark:fans-white"
						style={tw.style(
							"absolute left-[14px] top-[10px]",
							viewType === UserRoleTypes.Creator ? "hidden" : "",
						)}
					/>
					<FypText
						fontSize={18}
						fontWeight={viewType === UserRoleTypes.Fan ? 600 : 500}
						lineHeight={24}
						style={tw.style(
							viewType === UserRoleTypes.Fan
								? "text-fans-black dark:text-fans-white"
								: "text-fans-white",
						)}
					>
						Fans
					</FypText>
				</FansView>
			</FansView>
		</FansView>
	);
};

interface MediaCarouselProps {
	medias: IPickerMedia[];
	carouselSize: number;
	carouselIndex: number;
}

const MediaCarousel: FC<MediaCarouselProps> = (props) => {
	const { medias, carouselSize, carouselIndex } = props;
	const offset = useSharedValue(carouselIndex);
	const carouselStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withSpring(offset.value * carouselSize * -1, {
						damping: 100,
						stiffness: 200,
					}),
				},
			],
		};
	}, [offset.value]);

	useEffect(() => {
		offset.value = carouselIndex;
	}, [carouselIndex]);

	return (
		<Animated.View
			style={[
				tw.style("absolute flex-row top-0 bg-fans-black left-0"),
				carouselStyles,
			]}
		>
			{medias.map((media, index) => (
				<FansView
					key={index}
					width={carouselSize}
					height={carouselSize}
					style={[tw.style("bg-fans-black")]}
				>
					<FypNullableView visible={media.type === MediaType.Image}>
						<Image
							source={{
								uri: cdnURL(media.uri),
							}}
							style={[
								tw.style("w-full h-full"),
								{
									borderBottomLeftRadius: 15,
								},
							]}
							resizeMode="contain"
						/>
					</FypNullableView>

					<FypNullableView visible={media.type === MediaType.Video}>
						<FypVideo
							source={{
								uri: cdnURL(media.uri),
							}}
							style={[
								tw.style("w-full h-full"),
								{
									borderBottomLeftRadius: 15,
								},
							]}
							resizeMode={ResizeMode.CONTAIN}
						/>
					</FypNullableView>
				</FansView>
			))}
		</Animated.View>
	);
};

interface Props {
	data: IPostForm;
	inProgress: boolean;
	progress: number;
	step: PostStepTypes;
	handlePrev: () => void;
	titleIcon: IconTypes;
	handleCreateStory: (medias: IPickerMedia[]) => void;
	handleChangeTab: (tab: PostStepTypes) => void;
	handleCancelUpload: () => void;
	dispatch: IAppDispatch;
}

const ThumbnailScreen: FC<Props> = (props) => {
	const {
		data,
		inProgress,
		progress,
		step,
		handlePrev,
		titleIcon,
		handleCreateStory,
		handleChangeTab,
		handleCancelUpload,
		dispatch,
	} = props;

	const { medias, type, carouselIndex } = data;
	const [pickerMedias, setPickerMedias] = useState<IPickerMedia[]>([]);
	const [openImageEditor, setOpenImageEditor] = useState(false);
	const [viewType, setViewType] = useState<UserRoleTypes>(
		UserRoleTypes.Creator,
	);

	const carouselSize =
		(tw.prefixMatch("xl") ? 770 : 600) -
		(step === PostStepTypes.PaidPost ? 150 : 0);

	const { useVideoPicker, useAudioPicker, useImagePicker, useMediaPicker } =
		useDocumentPicker();

	const handleImageOpenPicker = async () => {
		const result = await useImagePicker(type === PostType.Photo);
		if (result.ok) {
			setPickerMedias(result.data);
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	const handleOpenVideoPicker = async () => {
		const result = await useVideoPicker();
		if (result.ok) {
			setPickerMedias(result.data);
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	const handleOpenAudioPicker = async () => {
		const result = await useAudioPicker();
		if (result.ok) {
			setPickerMedias(result.data);
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	const handleOpenMediaPicker = async () => {
		const result = await useMediaPicker();
		if (result.ok) {
			setPickerMedias(result.data);
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	const handleClickPicker = () => {
		if (type === PostType.Media) {
			handleOpenMediaPicker();
		} else if (type === PostType.Audio) {
			handleOpenAudioPicker();
		} else if (type === PostType.Video) {
			handleOpenVideoPicker();
		} else {
			handleImageOpenPicker();
		}
	};

	const handleSubmit = () => {
		if (pickerMedias.length === 0) {
			return;
		}
		if (type === PostType.Audio) {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					medias: pickerMedias,
				},
			});
			handleChangeTab(PostStepTypes.AudioDetail);
		} else if (type === PostType.Story) {
			handleCreateStory(pickerMedias);
		} else {
			handleChangeTab(
				data.secondStep === PostStepTypes.PaidPost
					? PostStepTypes.PaidPost
					: PostStepTypes.Caption,
			);
			if (type === PostType.Video) {
				dispatch.setPosts({
					type: PostsActionType.updatePostForm,
					data: {
						medias: pickerMedias,
						secondStep: undefined,
					},
				});
			} else {
				dispatch.setPosts({
					type: PostsActionType.updatePostForm,
					data: {
						thumb: pickerMedias[0],
						medias: pickerMedias,
						secondStep: undefined,
					},
				});
			}
		}
	};

	const handleImageEditingComplete = (uri: string) => {
		setOpenImageEditor(false);
		const updatedMedias = pickerMedias.map((media, index) =>
			index === carouselIndex ? { ...media, uri: uri } : media,
		);
		setPickerMedias(updatedMedias);
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				medias: updatedMedias,
			},
		});
	};

	const getPaidPostPreview = () => {
		if (data.paidPost && data.paidPost.thumbs) {
			if (data.paidPost.thumbs[0]?.uri) {
				return data.paidPost.thumbs[0].uri;
			}
		}
		return require("@assets/images/posts/paid-post-preview.webp");
	};

	useEffect(() => {
		if (medias) {
			setPickerMedias(medias);
		}
	}, [medias]);

	useEffect(() => {
		if (step === PostStepTypes.Thumbnail) {
			if (pickerMedias.length >= 0 && type === PostType.Media) {
				handleSubmit();
			}
		}
	}, [pickerMedias, type]);

	return (
		<FansView
			style={tw.style(
				step === PostStepTypes.Thumbnail
					? "relative"
					: "absolute top-[101px] z-10",
			)}
		>
			<FypNullableView visible={step === PostStepTypes.Thumbnail}>
				<ModalHeader
					title={
						data.type === PostType.Story ? "New story" : "New post"
					}
					rightLabel="Next"
					onClickRight={handleSubmit}
					onClickLeft={handlePrev}
					titleIcon={titleIcon}
					loading={inProgress}
				/>
			</FypNullableView>

			<FansView
				style={tw.style(
					step === PostStepTypes.Thumbnail
						? "py-5"
						: "hidden md:flex",
				)}
			>
				<FansView
					style={tw.style(
						"w-150 h-150 mx-auto",
						step === PostStepTypes.Thumbnail
							? "xl:w-[670px] xl:h-[670px]"
							: "xl:w-[770px] xl:h-[770px]",
					)}
				>
					<FypNullableView visible={inProgress}>
						<UploadProgress
							onCancel={handleCancelUpload}
							progress={progress}
						/>
					</FypNullableView>

					<FypNullableView
						visible={
							step === PostStepTypes.Thumbnail && !inProgress
						}
					>
						<FypNullableView visible={pickerMedias.length === 0}>
							<FileDropzone onPress={handleClickPicker} />
						</FypNullableView>
						{pickerMedias.length > 0 && (
							<FypNullableView visible={pickerMedias.length > 0}>
								<FansView width="full" height="full">
									<FypNullableView
										visible={
											(type === PostType.Media &&
												pickerMedias[0].type ===
													MediaType.Image) ||
											type === PostType.Photo ||
											type === PostType.Story
										}
									>
										<Image
											source={{
												uri: cdnURL(
													pickerMedias[0]?.uri,
												),
											}}
											style={[tw.style("w-full h-full")]}
											resizeMode="cover"
										/>
									</FypNullableView>

									<FypNullableView
										visible={
											(type === PostType.Media &&
												pickerMedias[0].type ===
													MediaType.Video) ||
											type === PostType.Video
										}
									>
										<FypVideo
											source={{
												uri:
													cdnURL(
														pickerMedias[0]?.uri,
													) ?? "",
											}}
											resizeMode={ResizeMode.CONTAIN}
											style={[tw.style("w-full h-full")]}
										/>
									</FypNullableView>
									<FypNullableView
										visible={type === PostType.Audio}
									>
										<AudioItem
											data={pickerMedias[0]}
											onDelete={() => setPickerMedias([])}
										/>
									</FypNullableView>
								</FansView>
							</FypNullableView>
						)}
					</FypNullableView>

					<FypNullableView
						visible={
							step !== PostStepTypes.Thumbnail && !inProgress
						}
					>
						<FypNullableView visible={!openImageEditor}>
							<FansView
								position="relative"
								width="full"
								height="full"
								style={[
									tw.style("mx-auto"),
									{ overflow: "hidden" },
									{
										borderBottomLeftRadius: 15,
									},
								]}
							>
								<FypNullableView
									visible={type !== PostType.Audio}
								>
									<FansView
										width={carouselSize}
										height={carouselSize}
										position="relative"
										style={tw.style(
											"mx-auto overflow-hidden",
										)}
									>
										<FypNullableView
											visible={
												step !==
													PostStepTypes.PaidPost ||
												viewType ===
													UserRoleTypes.Creator
											}
										>
											<MediaCarousel
												medias={pickerMedias}
												carouselIndex={carouselIndex}
												carouselSize={carouselSize}
											/>
										</FypNullableView>

										<FypNullableView
											visible={
												step ===
													PostStepTypes.PaidPost &&
												viewType === UserRoleTypes.Fan
											}
										>
											<ExpoImage
												source={getPaidPostPreview()}
												style={tw.style(
													"w-full h-full",
												)}
												pointerEvents="none"
											/>
										</FypNullableView>

										<FypNullableView
											visible={
												step === PostStepTypes.PaidPost
											}
										>
											<PostLockIcon />
										</FypNullableView>
									</FansView>
								</FypNullableView>

								<FypNullableView
									visible={type === PostType.Audio}
								>
									<FansView padding={{ x: 40, t: 20 }}>
										<AudioItem data={pickerMedias[0]} />
									</FansView>
								</FypNullableView>

								<AddResourceBar
									data={data}
									dispatch={dispatch}
									style={tw.style(
										step === PostStepTypes.PaidPost
											? "bottom-[186px]"
											: "bottom-9",
									)}
								/>

								<FypNullableView
									visible={
										pickerMedias[carouselIndex] &&
										pickerMedias[carouselIndex].type ===
											MediaType.Image
									}
								>
									<FansIconButton
										size={40}
										backgroundColor="bg-fans-black/50 dark:bg-fans-white/50"
										onPress={() => setOpenImageEditor(true)}
										style={tw.style(
											"absolute bottom-9 left-9 z-1",
										)}
									>
										<TransformSvg color="#fff" size={18} />
									</FansIconButton>
								</FypNullableView>

								<FypNullableView
									visible={step === PostStepTypes.PaidPost}
								>
									<PaidPostViewType
										post={data}
										viewType={viewType}
										onChange={setViewType}
									/>
								</FypNullableView>
							</FansView>
						</FypNullableView>
						<FypNullableView visible={openImageEditor}>
							<FansView width="full" height="full">
								<ImageEditor
									visible={openImageEditor}
									onCloseEditor={() =>
										setOpenImageEditor(false)
									}
									imageUri={
										pickerMedias[carouselIndex]?.uri ?? ""
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
						</FypNullableView>
					</FypNullableView>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default ThumbnailScreen;
