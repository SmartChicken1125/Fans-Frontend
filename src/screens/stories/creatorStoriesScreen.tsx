import { ChevronLeftSvg, ChevronRightSvg } from "@assets/svgs/common";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypSvg } from "@components/common/base";
import CardActions from "@components/common/cardActions";
import { FansIconButton } from "@components/controls";
import { ShareDialog } from "@components/posts/dialogs";
import StoryCommentDialog from "@components/posts/dialogs/commentDialog/storyCommentDialog";
import {
	GradientHeader,
	StoryContents,
	StoryFunctionButtons,
	StoryLayout,
} from "@components/stories";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import {
	createTextMessage,
	getOrCreateConversation,
} from "@helper/endpoints/chat/apis";
import { storyLike, unlikeStoryById } from "@helper/endpoints/stories/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IconTypes } from "@usertypes/commonEnums";
import { StoriesNavigationStacks } from "@usertypes/navigations";
import { ICardAction, IProfile, IStory, MessageType } from "@usertypes/types";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

const CreatorStoriesScreen = (
	props: NativeStackScreenProps<StoriesNavigationStacks, "Creator">,
) => {
	const { route } = props;
	const { userId } = route.params;
	const router = useRouter();
	const { copyString } = useClipboard();
	const { state, dispatch } = useAppContext();
	const { storiesFeed: creators } = state.story;

	const [creator, setCreator] = useState<IProfile>();
	const [stories, setStories] = useState<IStory[]>([]);
	const [storyIndex, setStoryIndex] = useState(0);
	const [creatorIndex, setCreatorIndex] = useState(0);

	const [message, setMessage] = useState("");
	const [openAction, setOpenAction] = useState(false);
	const [openShare, setOpenShare] = useState(false);
	const [loading, setLoading] = useState(false);
	const [openCommentModal, setOpenCommentModal] = useState(false);
	const [storyId, setStoryId] = useState("");

	const isOwner = creator?.userId === state.profile.userId;

	const onChangeStoryIndex = (index: number) => {
		setStoryIndex(index);
	};

	const onClickTip = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSendTipModal,
			data: {
				visible: true,
				creator: creator,
			},
		});
	};

	const onClickComment = () => {
		setStoryId(stories[storyIndex].id);
		setOpenCommentModal(true);
	};

	const onClickShare = () => {
		setOpenShare(true);
	};

	const onClickLike = async () => {
		const story = stories[storyIndex];
		if (story.isLiked) {
			const resp = await unlikeStoryById(null, {
				id: story.id,
			});
			if (resp.ok) {
				setStories(
					stories.map((el, index) =>
						index === storyIndex
							? {
									...el,
									isLiked: resp.data.isLiked,
									likeCount: resp.data.likeCount,
							  }
							: el,
					),
				);
			}
		} else {
			const resp = await storyLike(null, {
				id: story.id,
			});
			if (resp.ok) {
				setStories(
					stories.map((el, index) =>
						index === storyIndex
							? {
									...el,
									isLiked: resp.data.isLiked,
									likeCount: resp.data.likeCount,
							  }
							: el,
					),
				);
			}
		}
	};

	const onClickClose = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace("/");
		}
	};

	const onClickPrev = () => {
		if (storyIndex === 0) {
			if (creatorIndex === 0) {
				onClickClose();
			} else {
				setCreator(creators[creatorIndex - 1]);
				setCreatorIndex(creatorIndex - 1);
				setStories(creators[creatorIndex - 1].stories);
				setStoryIndex(0);
			}
		} else {
			setStoryIndex(storyIndex - 1);
		}
	};

	const onClickNext = () => {
		if (storyIndex === stories.length - 1 || stories.length === 0) {
			if (creatorIndex === creators.length - 1) {
				onClickClose();
			} else {
				setCreator(creators[creatorIndex + 1]);
				setCreatorIndex(creatorIndex + 1);
				setStories(creators[creatorIndex + 1].stories);
				setStoryIndex(0);
			}
		} else {
			setStoryIndex(storyIndex + 1);
		}
	};

	const onUnsubscribe = () => {};

	const onCopyStory = async () => {
		const url = createURL("stories", {
			queryParams: {
				userId: creator?.userId,
				screen: "Profile",
			},
		});
		await copyString(url);
		setOpenAction(false);
	};

	const onHideStory = () => {};

	const onReportStory = () => {};

	const onAddRemoveList = () => {};

	const commentCallback = (storyId: string, commentCounts: number) => {
		setStories(
			stories.map((story) =>
				story.id === storyId
					? {
							...story,
							commentCount: commentCounts,
					  }
					: story,
			),
		);
	};

	const handleSendMessage = async (keyValue: string) => {
		if (keyValue === "Enter" && creator?.userId) {
			const resp = await getOrCreateConversation(
				{},
				{
					userId: creator.userId,
				},
			);
			if (resp.ok) {
				const channelId = resp.data.id;
				const messageRes = await createTextMessage(
					{
						content: message,
						messageType: MessageType.TEXT,
					},
					{
						id: channelId,
					},
				);
				if (messageRes.ok) {
					setMessage("");
					Toast.show({
						type: "success",
						text1: "Sent message!",
					});
				} else {
					Toast.show({
						type: "error",
						text1: "Failed to send message",
					});
				}
			}
		}
	};

	useEffect(() => {
		if (creators.length > 0) {
			setCreator(creators.find((el) => el.userId === userId));
			setStories(
				creators.find((el) => el.userId === userId)?.stories ?? [],
			);
			setCreatorIndex(
				creators.findIndex((user) => user.userId === userId),
			);
		}
	}, [creators, userId]);

	const storyActions: ICardAction[] = [
		{
			title: "Unsubscribe",
			iconType: IconTypes.Unsubscribe,
			onClick: onUnsubscribe,
			hide: isOwner,
		},
		{
			title: "Add/remove from lists",
			iconType: IconTypes.AddRemoveFromLists,
			onClick: onAddRemoveList,
		},
		{
			title: "Copy story",
			iconType: IconTypes.CopyLink,
			onClick: onCopyStory,
		},
		{
			title: "Hide story from feed",
			iconType: IconTypes.EyeHide,
			onClick: onHideStory,
			hide: isOwner,
		},
		{
			title: "Report story",
			iconType: IconTypes.Report,
			iconColor: "#eb2121",
			onClick: onReportStory,
			labelClass: "text-fans-red",
			hide: isOwner,
		},
	];

	return (
		<StoryLayout onClose={onClickClose}>
			<View
				style={tw.style(
					"w-full relative flex-1 md:max-w-[494px] md:mx-auto",
				)}
			>
				<GradientHeader
					creator={creator}
					stories={stories}
					storyIndex={storyIndex}
					onClickClose={onClickClose}
					onClickThreeDots={() => setOpenAction(true)}
					onClickIndicator={onChangeStoryIndex}
				/>

				<StoryContents
					stories={stories}
					storyIndex={storyIndex}
					loading={loading}
					onChangeStoryIndex={onChangeStoryIndex}
					onPrev={onClickPrev}
					onNext={onClickNext}
					onClose={onClickClose}
				/>

				<StoryFunctionButtons
					onClickComment={onClickComment}
					onClickLike={onClickLike}
					onClickTip={onClickTip}
					onClickShare={onClickShare}
					story={stories[storyIndex]}
					isOwner={isOwner}
				/>

				<View
					style={tw.style(
						"px-[18px] pt-4 pb-2 bg-black w-full md:px-0 md:pb-0",
						isOwner && "hidden",
					)}
				>
					<RoundTextInput
						value={message}
						placeholder="Send message"
						onChangeText={(val) => setMessage(val)}
						customStyles="text-white bg-transparent border-white text-white"
						placeholderTextColor="#fff"
						onKeyPress={(e) => handleSendMessage(e.nativeEvent.key)}
					/>
				</View>
				<FansIconButton
					size={30}
					backgroundColor="bg-fans-white/50"
					style={tw.style(
						"absolute top-1/2 left-[-60px] hidden md:flex",
					)}
					onPress={onClickPrev}
				>
					<FypSvg
						svg={ChevronLeftSvg}
						width={12}
						height={12}
						color="fans-black-1d"
					/>
				</FansIconButton>
				<FansIconButton
					size={30}
					backgroundColor="bg-fans-white/50"
					style={tw.style(
						"absolute top-1/2 right-[-60px] hidden md:flex",
					)}
					onPress={onClickNext}
				>
					<FypSvg
						svg={ChevronRightSvg}
						width={12}
						height={12}
						color="fans-black-1d"
					/>
				</FansIconButton>
			</View>

			<CardActions
				open={openAction}
				onClose={() => setOpenAction(false)}
				actions={storyActions}
			/>

			<ShareDialog
				open={openShare}
				onClose={() => setOpenShare(false)}
				onCopyLink={onCopyStory}
			/>
			<StoryCommentDialog
				storyId={storyId}
				visible={openCommentModal}
				onDismiss={() => setOpenCommentModal(false)}
				onCallback={commentCallback}
			/>
		</StoryLayout>
	);
};

export default CreatorStoriesScreen;
