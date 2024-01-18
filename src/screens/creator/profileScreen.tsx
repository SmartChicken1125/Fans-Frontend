import { PostMailSvg, StarCheckSvg, TipSvg } from "@assets/svgs/common";
import { AuthModal } from "@components/auth";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
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
	AddPaymentCardDialog,
	BioText,
	CountsDetails,
	MediaTabContents,
	PlaylistsTabContents,
	PostsTabContents,
	ProfileCarousel,
	ProfilePictureDialog,
	ProfilePostActions,
	ProfileThreeDotsDialog,
	SocialLinkList,
	StickyHeader,
	SubscriptionPart,
	TierJoinDialog,
	TopActions,
} from "@components/profiles";
import { JoinProgramCard } from "@components/refer";
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
	useAppContext,
} from "@context/useAppContext";
import { hasFlags } from "@helper/Utils";
import { getOrCreateConversation } from "@helper/endpoints/chat/apis";
import { getPostMediasByUserId } from "@helper/endpoints/media/apis";
import { MediasRespBody } from "@helper/endpoints/media/schemas";
import {
	deleteBookmark,
	getPostById,
	getPostFeedForProfile,
	likePostWithPostId,
	setBookmark,
	unlikePostWithPostId,
} from "@helper/endpoints/post/apis";
import { PostListRespBody } from "@helper/endpoints/post/schemas";
import { getCreatorProfileByLink } from "@helper/endpoints/profile/apis";
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
import { NativeScrollEvent, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useRecoilValue } from "recoil";
import BookVideoCall from "./BookVideoCall";

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
	}>({
		post: false,
		media: false,
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
		if (!profile) return;

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

	const fetchProfileData = async () => {
		const resp = await getCreatorProfileByLink({
			profileLink: username as string,
		});
		if (resp.ok) {
			setProfile(resp.data);
			setPlaylists(resp.data.playlists);
			setHighlights(resp.data.highlights);
			setHasAccess(resp.data.hasAccess);
			fetchPosts();
			fetchMedias();
		} else {
			initState();
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const onClickBookmark = async (id: string) => {
		const post = posts.posts.find((el) => el.id === id);
		if (post?.isBookmarked) {
			const resp = await deleteBookmark(null, { id });
			if (resp.ok) {
				setPosts({
					...posts,
					posts: posts.posts.map((el) =>
						el.id === id
							? {
									...el,
									isBookmarked:
										resp.data.updatedPost.isBookmarked,
									bookmarkCount:
										resp.data.updatedPost.bookmarkCount,
							  }
							: el,
					),
				});
			}
		} else {
			const resp = await setBookmark(null, { id });
			if (resp.ok) {
				setPosts({
					...posts,
					posts: posts.posts.map((el) =>
						el.id === id
							? {
									...el,
									isBookmarked:
										resp.data.updatedPost.isBookmarked,
									bookmarkCount:
										resp.data.updatedPost.bookmarkCount,
							  }
							: el,
					),
				});
			}
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
		navigation.navigate("OrderVideoCallScreen", {
			username: username as string,
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

	const handleLikePost = async (postId: string) => {
		const post = posts.posts.find((el) => el.id === postId);
		if (post?.isLiked) {
			const resp = await unlikePostWithPostId(null, {
				id: postId,
			});
			if (resp.ok) {
				setPosts({
					...posts,
					posts: posts.posts.map((el) =>
						el.id === postId
							? {
									...el,
									likeCount: resp.data.likeCount,
									isLiked: resp.data.isLiked,
							  }
							: el,
					),
				});
			}
		} else {
			const resp = await likePostWithPostId(null, {
				id: postId,
			});
			if (resp.ok) {
				setPosts({
					...posts,
					posts: posts.posts.map((el) =>
						el.id === postId
							? {
									...el,
									likeCount: resp.data.likeCount,
									isLiked: resp.data.isLiked,
							  }
							: el,
					),
				});
			}
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

	const onShipCopyLink = () => {
		setOpenShopPostMenus(false);
	};

	const onShopViewAnalytics = () => {
		setOpenShopPostMenus(false);
		setOpenPostAnalytics(true);
	};

	const onShopHide = () => {
		setOpenShopPostMenus(false);
	};

	const onShopDelete = () => {
		setOpenShopPostMenus(false);
	};

	const shopPostActions: ICardAction[] = [
		{
			title: "Copy link",
			iconType: IconTypes.Edit,
			onClick: onShipCopyLink,
			iconSize: 18,
		},
		{
			title: "View analytics",
			iconType: IconTypes.Statistics,
			onClick: onShopViewAnalytics,
			iconSize: 18,
		},
		{
			title: "Hide from shop",
			iconType: IconTypes.EyeHide,
			onClick: onShopHide,
			iconSize: 18,
		},
		{
			title: "Delete post",
			iconType: IconTypes.Cancel,
			iconColor: "fans-red",
			onClick: onShopDelete,
			labelClass: "text-fans-red",
		},
	];

	useEffect(() => {
		initState();
		if (username) {
			fetchProfileData();
		}
	}, [username]);

	useEffect(() => {
		if ((profile?.userId ?? "0") !== "0") {
			fetchPosts();
		} else {
			setPosts(defaultPosts);
		}
	}, [profile?.userId, filter.post, posts.page]);

	useEffect(() => {
		if ((profile?.userId ?? "0") !== "0") {
			fetchMedias();
		} else {
			setMedias(defaultMedias);
		}
	}, [profile?.userId, medias.page, filter.media]);

	return (
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
					onClickShare={hasAccess ? undefined : handleCopyProfileUrl}
				/>
				<ScrollView
					style={tw.style("flex-1")}
					onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
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
														avatar={profile?.avatar}
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
																	width={19}
																	height={15}
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
																	svg={TipSvg}
																	width={10}
																	height={20}
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
																profile.previews
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
													margin={{ t: 16, b: 20 }}
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
															numberOfLines={1}
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
																width={15.66}
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
												<FansView margin={{ t: 16 }}>
													<BioText
														text={profile.bio}
													/>
												</FansView>
												<FansView
													margin={{ t: 18, b: 26 }}
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
												<SocialLinkList
													data={profile.socialLinks}
													onClickLink={
														onClickSocialLink
													}
												/>
												<FansGap height={20} />
												<FansDivider
													color="fans-grey-f0"
													style={tw.style(
														"my-[13.5px]",
													)}
												/>
												<FansGap height={20} />
												{featureGates.has(
													"2023_10-video-calls",
												) && (
													<BookVideoCall
														username={
															profile.displayName ||
															""
														}
														onClick={
															onBookVideoCall
														}
													/>
												)}
												<FansView
													style={tw.style(
														hasAccess && "hidden",
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
														navigation={navigation}
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
															hide: !featureGates.has(
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
														onClickBookmark={(
															id,
														) => {
															onClickBookmark(id);
														}}
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
														onClickPostLike={
															handleLikePost
														}
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
													/>
												)}
												{tab === "media" && (
													<MediaTabContents
														allCounts={medias.total}
														medias={medias}
														mediaType={filter.media}
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
														playlists={playlists}
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
												{/* {tab === "shop" && (
													<ShopTabContents
														onPressPostMenu={(
															postId,
														) =>
															setOpenShopPostMenus(
																true,
															)
														}
													/>
												)} */}
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
												(tier) => tier.id === tierId,
											)}
											onClickJoin={() =>
												setOpenJoinTier(false)
											}
										/>
										<AddPaymentCardDialog />
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
				post={posts.posts.find((post) => post.id === selectedPostId)}
				open={authProfile.userId === profile.userId && openPostActions}
				onClose={() => setOpenPostActions(false)}
				onTrashCallback={onTrachCallback}
				onPostAdvancedCallback={onPostAdvancedCallback}
				onPinCallback={onPinCallback}
				onArchivePostCallback={onArchivePostCallback}
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
		</AppLayout>
	);
};

export default ProfileScreen;
