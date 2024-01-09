import { ChevronLeftSvg, ChevronRightSvg } from "@assets/svgs/common";
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
import { getProfileById } from "@helper/endpoints/profile/apis";
import { storyLike, unlikeStoryById } from "@helper/endpoints/stories/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IconTypes } from "@usertypes/commonEnums";
import { StoriesNavigationStacks } from "@usertypes/navigations";
import { ICardAction, IProfile, IStory } from "@usertypes/types";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

const ProfileStoriesScreen = (
	props: NativeStackScreenProps<StoriesNavigationStacks, "Profile">,
) => {
	const router = useRouter();
	const { userId } = props.route.params;
	const { state, dispatch } = useAppContext();
	const { copyString } = useClipboard();

	const [profile, setProfile] = useState<IProfile>();
	const [stories, setStories] = useState<IStory[]>([]);
	const [storyIndex, setStoryIndex] = useState(0);
	const [openAction, setOpenAction] = useState(false);

	const [openShare, setOpenShare] = useState(false);
	const [openCommentModal, setOpenCommentModal] = useState(false);
	const [storyId, setStoryId] = useState("");

	const onChangeStoryIndex = (index: number) => {
		setStoryIndex(index);
	};

	const onClickTip = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSendTipModal,
			data: {
				visible: true,
				creator: profile,
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

	const onClickPrev = () => {
		if (storyIndex === 0 || stories.length === 0) {
			onClickClose();
		} else {
			setStoryIndex(storyIndex - 1);
		}
	};

	const onClickNext = () => {
		if (storyIndex === stories.length - 1 || stories.length === 0) {
			return;
		}
		setStoryIndex(storyIndex + 1);
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

	const onCopyStory = async () => {
		const url = createURL("stories", {
			queryParams: {
				userId: profile?.userId,
				screen: "Profile",
			},
		});
		await copyString(url);
		setOpenAction(false);
	};

	const onHideStory = () => {};

	const onReportStory = () => {};

	const onAddRemoveList = () => {};

	const fetProfileData = async () => {
		const resp = await getProfileById({ id: userId });
		if (resp.ok) {
			setProfile(resp.data);
			setStories(resp.data.stories);
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

	useEffect(() => {
		if (state.profile && state.profile.userId === userId) {
			setProfile(state.profile);
			setStories(state.profile.stories);
		} else {
			fetProfileData();
		}
	}, [state.profile]);

	const storyActions: ICardAction[] = [
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
					onClickShare={onClickShare}
					isOwner={true}
				/>
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
				storyId={storyId}
				visible={openCommentModal}
				onDismiss={() => setOpenCommentModal(false)}
				onCallback={commentCallback}
			/>
		</StoryLayout>
	);
};

export default ProfileStoriesScreen;
