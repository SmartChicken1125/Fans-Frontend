import { UsersSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypNullableView } from "@components/common/base";
import FileDropzone from "@components/common/fileDropzone";
import { FansText, FansView } from "@components/controls";
import UserLine from "@components/posts/dialogs/userListDialog/userLine";
import { defaultPostFormData } from "@constants/defaultFormData";
import { IAppDispatch } from "@context/appContext";
import { PostsActionType } from "@context/useAppContext";
import tw from "@lib/tailwind";
import {
	MediaType,
	PostType,
	RoundButtonType,
	ResizeMode,
	ActionType,
} from "@usertypes/commonEnums";
import {
	IPostForm,
	IUploadForm,
	IPickerMedia,
	IUserTag,
} from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import { Video } from "expo-av";
import React, { FC, useState, useEffect } from "react";
import { Image } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import DraggableUserTag from "./draggableUserTag";
import FixedUsersTag from "./fixedUsersTag";
import UploadDocument from "./uploadDocument";

interface Props {
	postForm: IPostForm;
	dispatch: IAppDispatch;
	onClickInviteNewUser: () => void;
	files: IUploadForm[];
	onDeleteDocument: (url: string) => void;
	onClickDropzone: () => void;
	onCreateNewTagUser: () => void;
}

const TagPeopleForm: FC<Props> = (props) => {
	const {
		onClickInviteNewUser,
		dispatch,
		postForm,
		files,
		onDeleteDocument,
		onClickDropzone,
		onCreateNewTagUser,
	} = props;
	const [openLink] = useBlankLink();
	const { carouselIndex, medias, taggedPeoples } = postForm;
	const [mediaSize, setMediaSize] = useState(0);
	const [media, setMedia] = useState<IPickerMedia | null>();
	const [userTags, setUserTags] = useState<IUserTag[]>([]);
	const action =
		postForm.id === defaultPostFormData.id
			? ActionType.Create
			: ActionType.Update;
	const mediaTabGesture = Gesture.Tap().onEnd((e) => {
		const uploadId = medias[carouselIndex].id ?? "";
		const positionX =
			postForm.type === PostType.Video ? 0 : e.x / mediaSize;
		const positionY =
			postForm.type === PostType.Video ? 0 : e.y / mediaSize;

		let _newUsertags = taggedPeoples;
		if (
			taggedPeoples.find(
				(newUsertag) => newUsertag.postMediaId === uploadId,
			)
		) {
			_newUsertags = taggedPeoples.map((newUsertag) =>
				newUsertag.postMediaId === uploadId
					? {
							...newUsertag,
							tags: [
								...newUsertag.tags,
								{
									id: `${new Date().getTime()}`,
									pointX: positionX,
									pointY: positionY,
								},
							],
					  }
					: newUsertag,
			);
		} else {
			_newUsertags = [
				..._newUsertags,
				{
					postMediaId: uploadId,
					tags: [
						{
							id: `${new Date().getTime()}`,
							pointX: positionX,
							pointY: positionY,
						},
					],
				},
			];
		}
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				taggedPeoples: _newUsertags,
			},
		});
		onCreateNewTagUser();
	});

	const onClickSampleFormLink = async () => {
		openLink(
			"https://drive.google.com/file/d/14wjuaBvP1TFu4G-9LEXyAPCue5m2nRDN/view?usp=sharing",
		);
	};

	const onRemoveTag = (userTagId: string) => {
		setUserTags(userTags.filter((tag) => tag.id !== userTagId));
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				taggedPeoples: taggedPeoples.map((_usertags) =>
					_usertags.postMediaId === medias[carouselIndex].id
						? {
								..._usertags,
								tags: _usertags.tags.filter(
									(_tag) => _tag.id !== userTagId,
								),
						  }
						: _usertags,
				),
			},
		});
	};

	const onUpdateTagPosition = (tagId: string, position: number[]) => {
		const updatedUsertags = userTags.map((tag) =>
			tag.id === tagId
				? {
						...tag,
						position: position,
				  }
				: tag,
		);
		setUserTags(updatedUsertags);
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: {
				taggedPeoples: taggedPeoples.map((_usertags) =>
					_usertags.postMediaId === medias[carouselIndex].id
						? {
								..._usertags,
								tags: updatedUsertags,
						  }
						: _usertags,
				),
			},
		});
	};

	useEffect(() => {
		if (medias.length > 0) {
			setMedia(medias[carouselIndex]);
			// setUserTags(
			// 	taggedPeoples.find(
			// 		(usertags) =>
			// 			usertags.postMediaId === medias[carouselIndex].id,
			// 	)?.tags ?? [],
			// );
			setUserTags(medias[carouselIndex].tags ?? []);
			console.log(postForm);
		} else {
			setMedia(null);
		}
	}, [carouselIndex, taggedPeoples, medias]);

	return (
		<FansView>
			<FansView
				height={mediaSize}
				onLayout={(e) => setMediaSize(e.nativeEvent.layout.width)}
				margin={{ b: 30 }}
				position="relative"
			>
				<FypNullableView visible={!!media && mediaSize !== 0}>
					<GestureDetector gesture={mediaTabGesture}>
						<FansView
							style={tw.style("w-full h-full")}
							position="relative"
						>
							<FypNullableView
								visible={media?.type === MediaType.Image}
							>
								<Image
									source={{
										uri:
											action === ActionType.Create
												? media?.uri
												: "https://fyp-fans-cdn-dev.harvestangels.co/" +
												  media?.uri,
									}}
									style={tw.style("w-full h-full")}
								/>
							</FypNullableView>
							<FypNullableView
								visible={media?.type === MediaType.Video}
							>
								<Video
									source={{
										uri: media?.uri
											? action === ActionType.Create
												? media?.uri
												: "https://fyp-fans-cdn-dev.harvestangels.co/" +
												  media?.uri
											: "",
									}}
									style={tw.style(
										"w-full h-full rounded-[7px] bg-black",
									)}
									resizeMode={ResizeMode.CONTAIN}
									videoStyle={tw.style("w-full my-auto")}
								/>
							</FypNullableView>

							<FypNullableView visible={userTags.length === 0}>
								<FansView
									height={34}
									justifyContent="center"
									padding={{ x: 10 }}
									borderRadius={34}
									width={230}
									style={[
										tw.style(
											"top-1/2 left-1/2 absolute bg-fans-black/50 dark:bg-fans-white/50",
										),
										{
											transform: [
												{ translateX: -115 },
												{ translateY: -17 },
											],
										},
									]}
								>
									<FansText
										fontSize={17}
										lineHeight={22}
										textAlign="center"
										style={tw.style(
											"text-fans-white dark:text-fans-black-1d",
										)}
									>
										Tap photo to tag people
									</FansText>
								</FansView>
							</FypNullableView>
						</FansView>
					</GestureDetector>
				</FypNullableView>
				<FypNullableView
					visible={
						userTags.length > 0 &&
						media?.type === MediaType.Image &&
						mediaSize !== 0
					}
				>
					{userTags.map((userTag) => (
						<DraggableUserTag
							key={`${userTag.id}`}
							visible={true}
							userTag={userTag}
							mediaSize={[mediaSize, mediaSize]}
							onRemove={() => onRemoveTag(userTag.id)}
							onUpdate={(position) =>
								onUpdateTagPosition(userTag.id, position)
							}
						/>
					))}
				</FypNullableView>
				<FypNullableView
					visible={
						userTags.length > 0 && media?.type === MediaType.Video
					}
				>
					<FixedUsersTag
						visible={true}
						usertags={userTags}
						onRemove={onRemoveTag}
					/>
				</FypNullableView>
			</FansView>
			<FansView margin={{ b: 30 }}>
				<FansText
					fontSize={17}
					lineHeight={22}
					style={tw.style(
						"font-semibold mb-4 text-fans-black dark:text-fans-white",
					)}
				>
					Tagged users
				</FansText>
				<FansView margin={{ b: userTags.length > 0 ? 35 : 0 }}>
					{userTags.map((user) => (
						<UserLine
							avatar={user.user?.avatar ?? ""}
							username={user.user?.username ?? ""}
							displayName={user.user?.profile?.displayName}
							key={user.id}
							onDelete={() => onRemoveTag(user.id)}
						/>
					))}
				</FansView>
				<RoundButton
					variant={RoundButtonType.OUTLINE_PRIMARY}
					onPress={onClickInviteNewUser}
				>
					<UsersSvg
						color="#a854f5"
						width={17}
						height={13.64}
						style={tw.style("mr-[10px]")}
					/>
					Invite collaborators
				</RoundButton>
			</FansView>
			<FansView>
				<FansText
					fontSize={17}
					lineHeight={22}
					style={tw.style(
						"font-semibold mb-3 text-fans-black dark:text-fans-white",
					)}
				>
					Release forms
				</FansText>
				<FansText
					fontSize={16}
					lineHeight={21}
					style={tw.style(
						"mb-2 text-fans-grey-70 dark:text-fans-grey-b1",
					)}
				>
					If your content contains someone other than you, you will
					need to provide a copy or their photo ID and release
					documents before the content can be posted
				</FansText>
				<FansText
					color="purple-a8"
					fontSize={17}
					lineHeight={21}
					textDecorationLine="underline"
					style={tw.style("font-semibold")}
					onPress={onClickSampleFormLink}
				>
					Sample of the release form
				</FansText>
				<FansView margin={{ t: 20 }} gap={9}>
					{files.map((file, index) => (
						<UploadDocument
							key={`${file.url}-${index}`}
							data={file}
							onDelete={() => onDeleteDocument(file.url)}
						/>
					))}
					<FileDropzone
						fileCounts={files.length}
						onPress={onClickDropzone}
						mediaType={MediaType.Form}
						textButtonMode
						buttonText="Drop form here"
					/>
				</FansView>
			</FansView>
		</FansView>
	);
};

export default TagPeopleForm;
