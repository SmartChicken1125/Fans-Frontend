import {
	Over18Svg,
	PostMailSvg,
	Star2Svg,
	StarCheckSvg,
	TipSvg,
} from "@assets/svgs/common";
import { AuthModal } from "@components/auth";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import RoundButton from "@components/common/RoundButton";
import { FypNullableView, FypSvg } from "@components/common/base";
import CardActions from "@components/common/cardActions";
import CopyLink from "@components/common/copyLink";
import AppLayout, {
	BottomNav,
	LayoutRightContents,
} from "@components/common/layout";
import Tabs from "@components/common/tabs";
import {
	FansDivider,
	FansGap,
	FansIconButton,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import { PostAnalyticsModal } from "@components/modals/shop";
import { StoryCell } from "@components/posts/common";
import {
	CreatorPostActions,
	PostCommentDialog,
	SendMessageDialog,
} from "@components/posts/dialogs";
import {
	BioText,
	BookVideoCallCard,
	CountsDetails,
	MediaTabContents,
	PlaylistsTabContents,
	PostsTabContents,
	ProfileCarousel,
	ProfilePictureDialog,
	ProfilePostActions,
	ProfileThreeDotsDialog,
	ShopTabContents,
	SocialLinkList,
	StickyHeader,
	SubscriptionPart,
	TierJoinDialog,
	TopActions,
} from "@components/profiles";
import { JoinProgramCard } from "@components/refer";
import { ProfileReviewSheet } from "@components/sheet";
import {
	POST_REPORT_DIALOG_ID,
	PROFILE_REPORT_DIALOG_ID,
	PROFILE_THREE_DOTS_DIALOG_ID,
	SUBSCRIBE_LOGIN_DIALOG_ID,
} from "@constants/modal";
import { defaultProfileStateData } from "@context/state/profileState";
import {
	CommonActionType,
	ModalActionType,
	StoryActionType,
	UserActionType,
	useAppContext,
} from "@context/useAppContext";
import { hasFlags } from "@helper/Utils";
import { getOrCreateConversation } from "@helper/endpoints/chat/apis";
import { getPostMediasByUserId } from "@helper/endpoints/media/apis";
import { MediasRespBody } from "@helper/endpoints/media/schemas";
import {
	getCreatorsPaidPosts,
	getPostById,
	getPostFeedForProfile,
} from "@helper/endpoints/post/apis";
import { PostListRespBody } from "@helper/endpoints/post/schemas";
import { getCreatorProfileByLink } from "@helper/endpoints/profile/apis";
import { updateSetting } from "@helper/endpoints/settings/apis";
import { getProfileVideoCallSettings } from "@helper/endpoints/videoCalls/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { authAtom } from "@state/auth";
import { updateInbox } from "@state/chat";
import { useFeatureGates } from "@state/featureGates";
import {
	IconTypes,
	MediaType,
	SortType,
	SubscribeActionType,
	UserRoleTypes,
} from "@usertypes/commonEnums";
import { CreatorProfileNavigationStacks } from "@usertypes/navigations";
import { IMediaFilterQuery, IPostFilterQuery } from "@usertypes/params";
import {
	ICardAction,
	IHighlight,
	IPlayList,
	IPost,
	IPostAdvanced,
	IProfile,
	ProfileFlags,
} from "@usertypes/types";
import { checkEnableMediasLoadingMore } from "@utils/common";
import { useBlankLink } from "@utils/useBlankLink";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import { useRouter } from "expo-router";
import React, { Fragment, useEffect, useState } from "react";
import { NativeScrollEvent, ScrollView, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import Toast, { default as ToastMessage } from "react-native-toast-message";
import { useRecoilValue } from "recoil";

const defaultPosts = {
	posts: [],
	page: 1,
	size: 10,
	total: 0,
};
const defaultMedias = {
	medias: [],
	page: 1,
	size: 10,
	total: 0,
	videoTotal: 0,
	imageTotal: 0,
};

const ProfileScreen = (
	props: NativeStackScreenProps<CreatorProfileNavigationStacks, "Creator">,
) => {
	const { navigation } = props;
	const router = useRouter();
	const featureGates = useFeatureGates();
	const { state, dispatch } = useAppContext();
	const { profile: authProfile } = state;
	const { creatorUsername: username } = state.common;
	const auth = useRecoilValue(authAtom);
	const [openLink] = useBlankLink();
	const { copyString } = useClipboard();

	const [profile, setProfile] = useState<IProfile>(defaultProfileStateData);
	const [posts, setPosts] = useState<PostListRespBody>(defaultPosts);
	const [playlists, setPlaylists] = useState<IPlayList[]>([]);
	const [hasAccess, setHasAccess] = useState(false);
	const [paidPosts, setPaidPosts] = useState<PostListRespBody>(defaultPosts);

	const [tab, setTab] = useState("post");
	const [highlights, setHighlights] = useState<IHighlight[]>([]);

	const [selectedPostId, setSelectedPostId] = useState("");
	const [openPostActions, setOpenPostActions] = useState(false);
	const [openMessageDialog, setOpenMessageDialog] = useState(false);
	const [openJoinTier, setOpenJoinTier] = useState(false);
	const [tierId, setTierId] = useState("");
	const [inLoadingMore, setInLoadingMore] = useState<{
		post: Boolean;
		media: boolean;
		paidPosts: boolean;
	}>({
		post: false,
		media: false,
		paidPosts: false,
	});
	const [filter, setFilter] = useState<{
		post: SortType | string;
		media: MediaType;
	}>({
		post: SortType.Latest,
		media: MediaType.All,
	});
	const [medias, setMedias] = useState<MediasRespBody>(defaultMedias);

	const [openProfileActions, setOpenProfileActions] = useState(false);
	const [showStickyHeader, setShowStickyHeader] = useState(false);
	const [openCommentModal, setOpenCommentModal] = useState(false);
	const [openAvatarModal, setOpenAvatarModal] = useState(false);
	const [openShopPostMenus, setOpenShopPostMenus] = useState(false);
	const [openPostAnalytics, setOpenPostAnalytics] = useState(false);
	const [isAvailableVideoCall, setIsAvailableVideoCall] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const [isProfileReviewSheetVisible, setProfileReviewSheetVisible] =
		useState(false);

	const handleOpenGemModal = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSendTipModal,
			data: {
				visible: true,
				creator: profile,
			},
		});
	};

	const onClickHighlight = (highlight: IHighlight) => {
		router.push({
			pathname: "stories",
			params: {
				screen: "Highlight",
				highlightId: highlight.id,
				userId: profile?.userId,
			},
		});
	};

	const fetchPosts = async () => {
		if (profile.id === "0") return;

		const filterObject: IPostFilterQuery = {
			page: posts.page,
			size: 10,
		};
		if (
			filter.post === SortType.Latest ||
			filter.post === SortType.Popular
		) {
			filterObject.sort = filter.post as SortType;
		} else {
			filterObject.categoryId = filter.post;
		}
		const resp = await getPostFeedForProfile(
			{
				userId: profile.userId,
			},
			filterObject,
		);
		setInLoadingMore({ ...inLoadingMore, post: false });
		if (resp.ok) {
			setPosts({
				...resp.data,
				posts:
					resp.data.page === 1
						? resp.data.posts
						: [...posts.posts, ...resp.data.posts],
			});
		}
	};

	const initState = () => {
		setProfile(defaultProfileStateData);
		setPlaylists([]);
		setHighlights([]);
		setPosts(defaultPosts);
		setMedias(defaultMedias);
	};

	const fetchVideoCallSettings = async (profileId: string) => {
		const resp = await getProfileVideoCallSettings({ id: profileId });
		if (resp.ok) {
			setIsAvailableVideoCall(true);
		} else {
			setIsAvailableVideoCall(false);
		}
	};

	const fetchProfileData = async () => {
		const resp = await getCreatorProfileByLink({
			profileLink: username as string,
		});
		console.log(resp);
		if (resp.ok) {
			setProfile(resp.data);
			setPlaylists(resp.data.playlists);
			setHighlights(resp.data.highlights);
			setHasAccess(resp.data.hasAccess);
			fetchPosts();
			fetchMedias();
			fetchVideoCallSettings(resp.data.id);
		} else {
			initState();
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const onClickPreview = () => {
		dispatch.setStory({
			type: StoryActionType.updateStoryState,
			data: {
				profilePreview: profile,
			},
		});
		navigation.navigate("Preview");
	};

	const onBookVideoCall = () => {
		router.replace({
			pathname: "videocall",
			params: { screen: "Order", username: profile.profileLink },
		});
	};

	const checkAccessSubscribedUser = async () => {
		if (profile?.id) {
			return fetchProfileData();
		}
	};

	const onClickSocialLink = (url: string) => {
		openLink(url.includes("https://") ? url : `https://${url}`);
	};

	const handleOpenMessage = async () => {
		try {
			dispatch.setShowLoading();
			const resp = await getOrCreateConversation(
				{},
				{
					userId: profile.userId,
				},
			);

			if (resp.ok) {
				updateInbox(resp.data);
				router.push(`/chat/${resp.data.id}`);
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		} finally {
			dispatch.setHideLoading();
		}
	};

	const handleCopyProfileUrl = async () => {
		if (profile.profileLink) {
			const url = createURL(`${profile.profileLink}`);
			await copyString(url);
		}
		setOpenProfileActions(false);
	};

	const handleReportProfile = () => {
		setOpenProfileActions(false);
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: {
				id: PROFILE_REPORT_DIALOG_ID,
				show: true,
				payload: {
					profileId: profile?.id,
					username: username,
				},
			},
		});
	};

	const handleReportPost = () => {
		setOpenPostActions(false);
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: {
				id: POST_REPORT_DIALOG_ID,
				show: true,
				payload: { postId: selectedPostId },
			},
		});
	};

	const onClickAddToList = () => {};

	const fetchPaidPosts = async () => {
		if (profile.userId === "0") {
			return;
		}
		const filterObject: IPostFilterQuery = {
			page: paidPosts.page,
			size: 10,
		};
		const resp = await getCreatorsPaidPosts(
			{
				userId: profile.userId,
			},
			filterObject,
		);

		setInLoadingMore({
			...inLoadingMore,
			paidPosts: false,
		});
		if (resp.ok) {
			setPaidPosts({
				...resp.data,
				posts:
					resp.data.page === 1
						? resp.data.posts
						: [...paidPosts.posts, ...resp.data.posts],
			});
		}
	};

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		setShowStickyHeader(nativeEvent.contentOffset.y > 80);
		if (!hasAccess) {
			return;
		}
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !inLoadingMore.post && tab === "post" && hasAccess) {
			if (posts.total > 10 * posts.page) {
				setInLoadingMore({
					...inLoadingMore,
					post: true,
				});
				setPosts({
					...posts,
					page: posts.page + 1,
				});
			}
		}
		if (isScrollEnd && !inLoadingMore.media && tab === "media") {
			const enableLoadingMore = checkEnableMediasLoadingMore(
				filter.media,
				medias,
			);
			if (enableLoadingMore) {
				setInLoadingMore({
					...inLoadingMore,
					media: true,
				});
				setMedias({
					...medias,
					page: medias.page + 1,
				});
			}
		}
		if (isScrollEnd && !inLoadingMore.paidPosts && tab === "shop") {
			if (paidPosts.total > 10 * paidPosts.page) {
				setInLoadingMore({
					...inLoadingMore,
					paidPosts: true,
				});
				setPaidPosts({
					...paidPosts,
					page: paidPosts.page + 1,
				});
			}
		}
	};

	const profileActions: ICardAction[] = [
		{
			title: "Add to list",
			iconType: IconTypes.AddRemoveFromLists,
			onClick: onClickAddToList,
			hide: !hasAccess,
		},
		{
			title: "Copy URL",
			iconType: IconTypes.CopyLink,
			onClick: handleCopyProfileUrl,
		},
		{
			title: "Report",
			iconType: IconTypes.Report,
			iconColor: "#eb2121",
			onClick: handleReportProfile,
			labelClass: "text-fans-red",
		},
	];

	const onChangeFilter = (_filter: string | SortType) => {
		setFilter({
			...filter,
			post: _filter,
		});
		setPosts({
			...posts,
			page: 1,
			total: 0,
			size: 10,
		});
	};

	const fetchMedias = async () => {
		if (profile.id === "0") {
			return;
		}
		const filterObj: IMediaFilterQuery = {
			page: medias.page,
			size: 10,
		};
		if (filter.media !== MediaType.All) {
			filterObj.type = filter.media;
		}
		const resp = await getPostMediasByUserId(
			{ id: profile?.userId ?? "" },
			filterObj,
		);
		setInLoadingMore({
			...inLoadingMore,
			media: false,
		});
		if (resp.ok) {
			setMedias({
				...resp.data,
				medias:
					resp.data.page === 1
						? resp.data.medias
						: [...medias.medias, ...resp.data.medias],
			});
		}
	};

	const onFilterMedia = (val: MediaType) => {
		setFilter({
			...filter,
			media: val,
		});
		setMedias({
			...medias,
			page: 1,
		});
	};

	const onPaidPostCallback = async (postId: string) => {
		const resp = await getPostById({ id: postId });
		if (resp.ok && resp.data.isPosted) {
			setPosts({
				...posts,
				posts: posts.posts.map((post) =>
					post.id === postId ? { ...resp.data } : post,
				),
			});
		}
	};

	const onClickPostUnlock = (post: IPost) => {
		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: true,
				creator: profile,
				subscribeActionType: SubscribeActionType.Post,
				bundleId: "0",
				subscribeTierId: "0",
				defaultTab: "form",
				post: post,
				checkAccessSubscribedUser: checkAccessSubscribedUser,
				paidPostCallback: onPaidPostCallback,
			},
		});
	};

	const handleOpenSubscribe = (
		_subscribeType: SubscribeActionType,
		_subscribeTierId: string,
		_bundleId: string,
		_price?: number,
	) => {
		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: !!auth,
				creator: profile,
				subscribeActionType: _subscribeType,
				bundleId: _bundleId,
				subscribeTierId: _subscribeTierId,
				defaultTab:
					_subscribeType === SubscribeActionType.Post
						? "form"
						: "start",
				checkAccessSubscribedUser: checkAccessSubscribedUser,
			},
		});
		if (!auth) {
			dispatch.setModal({
				type: ModalActionType.showModal,
				data: {
					id: SUBSCRIBE_LOGIN_DIALOG_ID,
					show: true,
					payload: {
						tab: "signup",
						avatar: profile.avatar,
					},
				},
			});
		}
	};

	const onCommentCallback = (postId: string, commentCounts: number) => {
		setPosts({
			...posts,
			posts: posts.posts.map((post) =>
				post.id === postId
					? {
							...post,
							commentCount: commentCounts,
					  }
					: post,
			),
		});
	};

	const onPressMenus = () => {
		if (
			state.profile.userId !== "0" &&
			state.profile.userId === profile.userId
		) {
			dispatch.setModal({
				type: ModalActionType.showModal,
				data: { id: PROFILE_THREE_DOTS_DIALOG_ID, show: true },
			});
		} else {
			setOpenProfileActions(true);
		}
	};

	const onArchivePostCallback = async () => {
		setPosts({
			...posts,
			posts: posts.posts.filter((post) => post.id !== selectedPostId),
		});
	};

	const onTrachCallback = () => {
		setPosts({
			...posts,
			total: posts.total - 1,
			posts: posts.posts.filter((post) => post.id !== selectedPostId),
		});
	};

	const onPinCallback = (post: IPost) => {
		setOpenPostActions(false);
		setPosts({
			...posts,
			posts: posts.posts.map((_post) =>
				_post.id === post.id
					? {
							..._post,
							isPinned: post.isPinned,
					  }
					: _post,
			),
		});
	};

	const onPostAdvancedCallback = (advanced: IPostAdvanced) => {
		setPosts({
			...posts,
			posts: posts.posts.map((post) =>
				post.id === selectedPostId
					? { ...post, advanced: advanced }
					: post,
			),
		});
	};

	const handleGoToPost = () => {
		setOpenPostActions(false);
		router.push(`/p/${selectedPostId}`);
	};

	const onClickPostAction = (postId: string) => {
		setSelectedPostId(postId);
		setOpenPostActions(true);
	};

	const onShopCopyLink = () => {
		setOpenShopPostMenus(false);
	};

	const shopPostActions: ICardAction[] = [
		{
			title: "Copy link",
			iconType: IconTypes.Edit,
			onClick: onShopCopyLink,
			iconSize: 18,
		},
	];

	const updatePostCallback = (postId: string, data: Partial<IPost>) => {
		setPosts({
			...posts,
			posts: posts.posts.map((el) =>
				el.id === postId
					? {
							...el,
							...data,
					  }
					: el,
			),
		});
	};

	const handleOlderThan18 = async () => {
		if (state.user.userInfo.id === "0") {
			localStorage.setItem("is_older_than_18", "1");
			setRefreshKey(refreshKey + 1);
			return;
		}

		const res = await updateSetting({
			isOlderThan18: true,
		});
		if (res.ok) {
			dispatch.setUser({
				type: UserActionType.updateUserInfo,
				payload: { data: { isOlderThan18: true } },
			});
		} else {
			ToastMessage.show({
				type: "error",
				text1: res.data.message,
			});
		}
	};

	useEffect(() => {
		initState();
		if (username) {
			fetchProfileData();
		}
	}, [username]);

	useEffect(() => {
		if (profile.id !== "0") {
			fetchPosts();
		} else {
			setPosts(defaultPosts);
		}
	}, [profile.userId, filter.post, posts.page]);

	useEffect(() => {
		if (profile.id !== "0") {
			fetchMedias();
		} else {
			setMedias(defaultMedias);
		}
	}, [profile.userId, medias.page, filter.media]);

	useEffect(() => {
		if (profile.userId !== "0") {
			fetchPaidPosts();
		}
	}, [profile.userId, paidPosts.page]);

	const handlePressReview = () => setProfileReviewSheetVisible(true);

	return (
		<FansView style={tw.style("w-full h-full flex")}>
			<AppLayout
				title={`${profile.displayName} | FYP.Fans`}
				description={profile.bio}
			>
				<FansView flex="1" position="relative">
					<StickyHeader
						visible={showStickyHeader}
						profile={profile}
						onClickBack={() => router.push("/posts")}
						onClickMenu={onPressMenus}
						onClickTip={handleOpenGemModal}
						onClickMail={hasAccess ? handleOpenMessage : undefined}
						onClickShare={
							hasAccess ? undefined : handleCopyProfileUrl
						}
					/>
					<ScrollView
						style={tw.style("flex-1")}
						onScroll={({ nativeEvent }) =>
							onScrollView(nativeEvent)
						}
						scrollEventThrottle={30}
						nestedScrollEnabled
					>
						<FansView flexDirection="row" flex="1">
							<FansView
								flex="1"
								alignItems="center"
								style={tw.style(
									`"md:border-r border-fans-grey-f0 dark:border-fans-grey-43"`,
								)}
							>
								<FansView
									flex="1"
									position="relative"
									style={tw.style(
										"w-full md:max-w-[710px] bg-fans-white dark:bg-fans-black-1d",
									)}
								>
									{profile ? (
										<Fragment>
											<FansView
												position="relative"
												padding={{ b: 40 }}
											>
												<TopActions
													onClickMenu={onPressMenus}
												/>

												<ProfileCarousel
													images={profile.cover}
												/>
												<FansView padding={{ x: 18 }}>
													<FansView
														flexDirection="row"
														alignItems="end"
														margin={{ t: -30 }}
														justifyContent="between"
													>
														<AvatarWithStatus
															size={79}
															avatar={
																profile?.avatar
															}
															onPress={() =>
																setOpenAvatarModal(
																	true,
																)
															}
														/>

														<FansView
															flexDirection="row"
															gap={7}
														>
															{hasAccess && (
																<FansIconButton
																	onPress={
																		handleOpenMessage
																	}
																	backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
																>
																	<FypSvg
																		svg={
																			PostMailSvg
																		}
																		width={
																			19
																		}
																		height={
																			15
																		}
																		color="fans-black dark:fans-white"
																	/>
																</FansIconButton>
															)}
															{hasAccess && (
																<FansIconButton
																	onPress={
																		handleOpenGemModal
																	}
																	backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
																>
																	<FypSvg
																		svg={
																			TipSvg
																		}
																		width={
																			10
																		}
																		height={
																			20
																		}
																		color="fans-black dark:fans-white"
																	/>
																</FansIconButton>
															)}

															<Button
																onPress={
																	onClickPreview
																}
																style={tw.style(
																	"items-center h-[34px] flex-row border-fans-purple",
																	profile
																		.previews
																		.length ===
																		0 &&
																		"hidden",
																	hasAccess &&
																		"hidden",
																)}
																labelStyle={tw.style(
																	"text-[17px] font-bold leading-[22px] my-0 text-fans-purple",
																)}
																mode="outlined"
															>
																Preview
															</Button>
														</FansView>
													</FansView>
													<FansView
														margin={{
															t: 16,
															b: 20,
														}}
													>
														<FansView
															flexDirection="row"
															alignItems="center"
														>
															<FansText
																fontSize={19}
																lineHeight={26}
																style={tw.style(
																	"mr-3 font-bold text-fans-black dark:text-fans-white",
																)}
																numberOfLines={
																	1
																}
															>
																{
																	profile.displayName
																}
															</FansText>
															{hasFlags(
																profile.flags,
																ProfileFlags.VERIFIED,
															) && (
																<StarCheckSvg
																	width={
																		15.66
																	}
																	height={15}
																/>
															)}
														</FansView>
														<FansView
															flexDirection="row"
															alignItems="center"
														>
															<FansText
																fontSize={16}
																lineHeight={21}
																style={tw.style(
																	"text-fans-grey-70 dark:text-fans-grey-b1",
																)}
															>
																{`@${profile.profileLink}`}
															</FansText>
														</FansView>
													</FansView>
													<CopyLink
														url={`fyp.fans/${profile.profileLink}`}
													/>
													<FansView
														margin={{ t: 16 }}
													>
														<BioText
															text={profile.bio}
														/>
													</FansView>
													<FansView
														margin={{
															t: 18,
															b: 26,
														}}
													>
														<CountsDetails
															photos={
																profile.imageCount
															}
															videos={
																profile.videoCount
															}
															likes={
																profile.likeCount
															}
														/>
													</FansView>
													<FansGap height={18} />
													{featureGates.has(
														"2024_02-review",
													) && (
														<>
															<FansView
																alignItems="center"
																flexDirection="row"
															>
																<FansSvg
																	width={11.9}
																	height={
																		11.4
																	}
																	svg={
																		Star2Svg
																	}
																	color1="purple-a8"
																/>
																<FansGap
																	width={4}
																/>
																<FansText
																	fontFamily="inter-semibold"
																	fontSize={
																		15
																	}
																>
																	{
																		profile
																			.review
																			.score
																	}
																</FansText>
																<FansGap
																	width={4}
																/>
																<FansText
																	color="grey-48"
																	fontSize={
																		15
																	}
																>
																	(
																	{
																		profile
																			.review
																			.total
																	}
																	)
																</FansText>
																<FansGap
																	width={4}
																/>
																<FansView
																	touchableOpacityProps={{
																		onPress:
																			handlePressReview,
																	}}
																>
																	<FansText
																		color="purple-a8"
																		fontFamily="inter-semibold"
																		fontSize={
																			15
																		}
																	>
																		Review
																	</FansText>
																</FansView>
															</FansView>
															<FansGap
																height={21.5}
															/>
														</>
													)}
													<SocialLinkList
														data={
															profile.socialLinks
														}
														onClickLink={
															onClickSocialLink
														}
													/>
													<FansDivider
														color="fans-grey-f0"
														style={tw.style(
															"my-[14px]",
														)}
													/>
													<FypNullableView
														visible={
															isAvailableVideoCall &&
															featureGates.has(
																"2023_10-video-calls",
															)
														}
													>
														<FansView
															margin={{ b: 14 }}
														>
															<BookVideoCallCard
																username={
																	profile.displayName ||
																	""
																}
																onClick={
																	onBookVideoCall
																}
															/>
														</FansView>
													</FypNullableView>

													<FansView
														style={tw.style(
															hasAccess &&
																"hidden",
														)}
													>
														<SubscriptionPart
															profile={profile}
															isPreview
															onClickSubscribe={
																handleOpenSubscribe
															}
														/>
													</FansView>
												</FansView>
												<FypNullableView
													visible={
														hasAccess &&
														highlights.length > 0
													}
												>
													<ScrollView
														horizontal
														contentContainerStyle={{
															paddingHorizontal: 18,
															columnGap: 15,
															// marginBottom: 18,
														}}
														showsHorizontalScrollIndicator={
															false
														}
													>
														{highlights.map(
															(highlight) => (
																<StoryCell
																	key={
																		highlight.id
																	}
																	title={
																		highlight.title
																	}
																	image={
																		highlight.cover
																	}
																	onClick={() =>
																		onClickHighlight(
																			highlight,
																		)
																	}
																	// isSelected={cell.isSelected}
																/>
															),
														)}
													</ScrollView>
												</FypNullableView>

												{featureGates.has(
													"2023_12-fans-referral",
												) &&
													!(
														state.profile.userId !==
															"0" &&
														state.profile.userId ===
															profile.userId
													) &&
													profile.user?.type ===
														UserRoleTypes.Creator &&
													profile.isFanReferralEnabled ===
														true && (
														<JoinProgramCard
															profile={profile}
															navigation={
																navigation
															}
														/>
													)}

												<FansView>
													<Tabs
														tabs={[
															{
																data: "post",
																label: `POSTS ${posts.total}`,
															},
															{
																data: "media",
																label: `MEDIA ${
																	medias.imageTotal +
																	medias.videoTotal
																}`,
															},
															{
																data: "shop",
																label: "SHOP",
																hide:
																	!profile.isDisplayShop ||
																	!featureGates.has(
																		"2023_12-shop-tab-on-creators-profile",
																	),
															},
															{
																data: "playlists",
																label: "PLAYLISTS",
															},
														]}
														selectedTab={tab}
														onChangeTab={(val) =>
															setTab(val)
														}
													/>
													{tab === "post" && (
														<PostsTabContents
															posts={posts.posts}
															totalPostsCount={
																posts.total
															}
															categories={
																profile.categories
															}
															filter={filter.post}
															onChangeFilter={
																onChangeFilter
															}
															needToSubscribe={
																!hasAccess
															}
															subscription={
																profile
																	.subscriptions[0]
															}
															onClickSubscribe={() =>
																handleOpenSubscribe(
																	SubscribeActionType.Subscribe,
																	profile
																		.subscriptions[0]
																		.id,
																	"",
																)
															}
															onClickPostAction={
																onClickPostAction
															}
															onClickPostMessage={(
																id,
															) => {
																setSelectedPostId(
																	id,
																);
																setOpenMessageDialog(
																	true,
																);
															}}
															onClickUnlock={
																onClickPostUnlock
															}
															onClickComment={(
																id,
															) => {
																setSelectedPostId(
																	id,
																);
																setOpenCommentModal(
																	true,
																);
															}}
															updatePostCallback={
																updatePostCallback
															}
														/>
													)}
													{tab === "media" && (
														<MediaTabContents
															allCounts={
																medias.total
															}
															medias={medias}
															mediaType={
																filter.media
															}
															onChangeFilter={
																onFilterMedia
															}
															needToSubscribe={
																!hasAccess
															}
															onClickSubscribe={() =>
																handleOpenSubscribe(
																	SubscribeActionType.Subscribe,
																	profile
																		.subscriptions[0]
																		.id,
																	"",
																)
															}
															subscription={
																profile
																	.subscriptions[0]
															}
														/>
													)}
													{tab === "playlists" && (
														<PlaylistsTabContents
															playlists={
																playlists
															}
															needToSubscribe={
																!hasAccess
															}
															isSuggested={true}
															onClickMenus={() => {}}
															handleAdd={() => {}}
															handleEdit={() => {}}
															onClickSubscribe={() =>
																handleOpenSubscribe(
																	SubscribeActionType.Subscribe,
																	profile
																		.subscriptions[0]
																		.id,
																	"",
																)
															}
														/>
													)}
													{tab === "shop" &&
														profile.isDisplayShop && (
															<ShopTabContents
																posts={
																	paidPosts.posts
																}
																profile={
																	profile
																}
																onPressPostMenu={(
																	postId,
																) => {
																	setSelectedPostId(
																		postId,
																	);
																	setOpenShopPostMenus(
																		true,
																	);
																}}
																updatePostCallback={
																	updatePostCallback
																}
																onClickComment={(
																	id,
																) => {
																	setSelectedPostId(
																		id,
																	);
																	setOpenCommentModal(
																		true,
																	);
																}}
															/>
														)}
												</FansView>
											</FansView>

											<SendMessageDialog
												open={openMessageDialog}
												onClose={() =>
													setOpenMessageDialog(false)
												}
												reciever={
													posts.posts.find(
														(post) =>
															post.id ===
															selectedPostId,
													)?.profile
												}
											/>

											<CreatorPostActions
												open={
													authProfile.userId !==
														profile.userId &&
													openPostActions
												}
												onClose={() =>
													setOpenPostActions(false)
												}
												onShare={() => {}}
												onReportPost={handleReportPost}
												onOpenPost={handleGoToPost}
											/>

											<TierJoinDialog
												open={openJoinTier}
												onClose={() =>
													setOpenJoinTier(false)
												}
												data={profile.tiers.find(
													(tier) =>
														tier.id === tierId,
												)}
												onClickJoin={() =>
													setOpenJoinTier(false)
												}
											/>
											<CardActions
												open={openProfileActions}
												onClose={() =>
													setOpenProfileActions(false)
												}
												actions={profileActions}
											/>
											<AuthModal />
											<ProfileThreeDotsDialog />
										</Fragment>
									) : null}
								</FansView>
							</FansView>
							<LayoutRightContents />
						</FansView>
					</ScrollView>
					<BottomNav />
				</FansView>
				<PostCommentDialog
					visible={openCommentModal}
					postId={selectedPostId}
					onDismiss={() => setOpenCommentModal(false)}
					onCallback={onCommentCallback}
				/>
				<ProfilePostActions
					post={posts.posts.find(
						(post) => post.id === selectedPostId,
					)}
					open={
						authProfile.userId === profile.userId && openPostActions
					}
					onClose={() => setOpenPostActions(false)}
					onTrashCallback={onTrachCallback}
					onPostAdvancedCallback={onPostAdvancedCallback}
					onPinCallback={onPinCallback}
					onArchivePostCallback={onArchivePostCallback}
					onEditPostCallback={() => {}}
				/>
				<ProfilePictureDialog
					visible={openAvatarModal}
					onDismiss={() => setOpenAvatarModal(false)}
					profile={profile}
				/>
				<CardActions
					open={openShopPostMenus}
					onClose={() => setOpenShopPostMenus(false)}
					actions={shopPostActions}
				/>
				<PostAnalyticsModal
					visible={openPostAnalytics}
					onDismiss={() => setOpenPostAnalytics(false)}
					handleOpenMessage={() => {}}
				/>
				<ProfileReviewSheet
					visible={isProfileReviewSheetVisible}
					profile={profile}
					onClose={() => setProfileReviewSheetVisible(false)}
					onSubmit={() => {}}
				/>
			</AppLayout>

			{featureGates.has("2024_02-NSFW-indicator") &&
				profile.isNSFW &&
				((state.user.userInfo.id === "0" &&
					localStorage.getItem("is_older_than_18") !== "1") ||
					(state.user.userInfo.id !== "0" &&
						!state.user.userInfo.isOlderThan18)) && (
					<FansView
						style={tw.style(
							"bg-black bg-opacity-80 absolute w-full h-full",
						)}
					>
						<FansView
							style={tw.style(
								"mt-auto mb-auto ml-[17px] mr-[17px] content-center",
							)}
						>
							<Over18Svg
								width={112.167}
								height={112.167}
								style={tw.style("ml-auto mr-auto")}
							/>
							<FansText
								style={tw.style("mt-[24px]")}
								color={"white"}
								fontSize={23}
								fontFamily="inter-bold"
								textAlign="center"
							>
								Are you over 18?
							</FansText>

							<FansView
								style={tw.style(
									"mt-[27px] ml-[21px] mr-[21px]",
								)}
							>
								<FansText
									style={tw.style(
										"ml-auto mr-auto lg:w-[317px]",
									)}
									color={"white"}
									fontSize={16}
									fontFamily="inter-regular"
									textAlign="center"
								>
									This creator's content is 18+. Please
									confirm your age below to access their
									profile
								</FansText>
							</FansView>

							<FansView
								style={tw.style(
									"mt-[36px] lg:w-[358px] lg:ml-auto lg:mr-auto",
								)}
							>
								<RoundButton
									onPress={() => {
										handleOlderThan18();
									}}
								>
									Yes, I am 18 or older
								</RoundButton>
							</FansView>

							<TouchableOpacity
								style={tw.style("mt-[18px] ml-auto mr-auto")}
								onPress={() => {
									if (router.canGoBack()) {
										router.back();
									} else {
										router.replace({
											pathname: "posts",
											params: { screen: "Home" },
										});
									}
								}}
							>
								<FansText
									color={"white"}
									fontFamily="inter-bold"
									fontSize={19}
								>
									Go back
								</FansText>
							</TouchableOpacity>
						</FansView>
					</FansView>
				)}
		</FansView>
	);
};

export default ProfileScreen;
