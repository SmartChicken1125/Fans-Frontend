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
import { defaultProfileData } from "@constants/common";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import {
	createTextMessage,
	getOrCreateConversation,
} from "@helper/endpoints/chat/apis";
import {
	getHighlightById,
	getProfileById,
} from "@helper/endpoints/profile/apis";
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

const HighlightStoryScreen = (
	props: NativeStackScreenProps<StoriesNavigationStacks, "Highlight">,
) => {
	const { route } = props;
	const { highlightId, userId, storyId: paramStoryId } = route.params;
	const router = useRouter();
	const { copyString } = useClipboard();

	const { state, dispatch } = useAppContext();
	const { highlightStory } = state.story;
	const [profile, setProfile] = useState<IProfile>(defaultProfileData);

	const isOwner = userId === state.profile.userId;

	const [stories, setStories] = useState<IStory[]>([]);

	const [storyIndex, setStoryIndex] = useState(0);
	const [message, setMessage] = useState("");
	const [openAction, setOpenAction] = useState(false);

	const [openShare, setOpenShare] = useState(false);
	const [openCommentModal, setOpenCommentModal] = useState(false);

	const onChangeStoryIndex = (index: number) => {
		setStoryIndex(index);
		router.push({
			pathname: "stories",
			params: {
				screen: "Highlight",
				highlightId: highlightId,
				userId: profile.userId,
				storyId: stories[index].id,
			},
		});
	};

	const onClickTip = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSendTipModal,
			data: {
				visible: true,
				creator: highlightStory.profile,
			},
		});
	};

	const onClickComment = () => {
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

	const onClickPrev = () => {
		if (storyIndex === 0 || stories.length === 0) {
			onClickClose();
		} else {
			setStoryIndex(storyIndex - 1);
			router.push({
				pathname: "stories",
				params: {
					screen: "Highlight",
					highlightId: highlightId,
					userId: profile.userId,
					storyId: stories[storyIndex - 1].id,
				},
			});
		}
	};

	const onClickNext = () => {
		if (storyIndex === stories.length - 1 || stories.length === 0) {
			return;
		}
		setStoryIndex(storyIndex + 1);
		router.push({
			pathname: "stories",
			params: {
				screen: "Highlight",
				highlightId: highlightId,
				userId: profile.userId,
				storyId: stories[storyIndex + 1].id,
			},
		});
	};

	const onClickClose = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			if (profile?.profileLink) {
				router.replace(`/${profile.profileLink}`);
			} else {
				router.replace("/");
			}
		}
	};
	const onUnsubscribe = () => {};

	const onCopyStory = async () => {
		const url = createURL("stories", {
			queryParams: {
				highlightId: highlightId,
				userId: userId,
				screen: "Highlight",
				storyId: paramStoryId ? paramStoryId : stories[storyIndex].id,
			},
		});
		await copyString(url);
		setOpenAction(false);
	};

	const onHideStory = () => {};

	const onReportStory = () => {};

	const onAddRemoveList = () => {};

	const fetchStories = async () => {
		const resp = await getHighlightById({ id: highlightId });

		if (resp.ok) {
			setStories(resp.data.stories);
			setStoryIndex(
				paramStoryId
					? resp.data.stories.findIndex(
							(story) => story.id === paramStoryId,
					  )
					: 0,
			);
		}
	};

	const fetchProfile = async () => {
		const resp = await getProfileById({ id: userId });
		if (resp.ok) {
			setProfile(resp.data);
		}
	};

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
		if (keyValue === "Enter" && profile?.userId) {
			const resp = await getOrCreateConversation(
				{},
				{
					userId: profile.userId,
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
		if (highlightStory.profile) {
			setStories(highlightStory.stories);
			setProfile(highlightStory.profile);
			setStoryIndex(
				paramStoryId
					? highlightStory.stories.findIndex(
							(story) => story.id === paramStoryId,
					  )
					: 0,
			);
		} else {
			fetchStories();
			fetchProfile();
		}
	}, [highlightStory]);

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
					creator={profile}
					stories={stories}
					storyIndex={storyIndex}
					onClickClose={onClickClose}
					onClickThreeDots={() => setOpenAction(true)}
					onClickIndicator={onChangeStoryIndex}
				/>

				<StoryContents
					stories={stories}
					storyIndex={storyIndex}
					onChangeStoryIndex={onChangeStoryIndex}
					onPrev={onClickPrev}
					onNext={onClickNext}
					onClose={onClickClose}
				/>

				<StoryFunctionButtons
					story={stories[storyIndex]}
					onClickComment={onClickComment}
					onClickLike={onClickLike}
					onClickTip={onClickTip}
					onClickShare={onClickShare}
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
						(storyIndex === 0 || stories.length === 0) &&
							"md:hidden",
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
						(storyIndex === stories.length - 1 ||
							stories.length === 0) &&
							"md:hidden",
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
				storyId={paramStoryId ?? stories[storyIndex]?.id}
				visible={openCommentModal}
				onDismiss={() => setOpenCommentModal(false)}
				onCallback={commentCallback}
			/>
		</StoryLayout>
	);
};

export default HighlightStoryScreen;
