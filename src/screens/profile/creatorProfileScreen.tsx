import {
	AddressSvg,
	ArchivedPostSvg,
	BirthdaySvg,
	DocEditSvg,
	EditSvg,
	RoundedBorderSvg,
	StarCheckSvg,
	StatisticsSvg,
} from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import RoundButton from "@components/common/RoundButton";
import { FypNullableView, FypSvg } from "@components/common/base";
import CardActions from "@components/common/cardActions";
import CopyLink from "@components/common/copyLink";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import Tabs from "@components/common/tabs";
import {
	FansDivider,
	FansIconButton,
	FansText,
	FansView,
} from "@components/controls";
import { PostAnalyticsModal } from "@components/modals/shop";
import { StoryCell } from "@components/posts/common";
import {
	PostCommentDialog,
	PostLiveDialog,
	ShareDialog,
} from "@components/posts/dialogs";
import {
	BioText,
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
	TopActions,
	WelcomeModal,
} from "@components/profiles";
import { PROFILE_THREE_DOTS_DIALOG_ID } from "@constants/modal";
import {
	CommonActionType,
	ModalActionType,
	PostsActionType,
	ProfileActionType,
	StoryActionType,
	useAppContext,
} from "@context/useAppContext";
import { hasFlags } from "@helper/Utils";
import { getPostMedias } from "@helper/endpoints/media/apis";
import { MediasRespBody } from "@helper/endpoints/media/schemas";
import {
	deletePostById,
	getPaidPosts,
	getPostById,
	getPostFeedForProfile,
	hidePaidPostByIId,
} from "@helper/endpoints/post/apis";
import { PostListRespBody } from "@helper/endpoints/post/schemas";
import {
	deletePlaylist,
	deleteTier,
	getHighlightById,
	getPlaylists,
	updateMyProfile,
} from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import {
	ActionType,
	IconTypes,
	MediaType,
	PostStepTypes,
	RoundButtonType,
	SortType,
	SubscriptionTypes,
} from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import { IMediaFilterQuery, IPostFilterQuery } from "@usertypes/params";
import {
	ICardAction,
	IHighlight,
	IPost,
	IPostAdvanced,
	ProfileFlags,
} from "@usertypes/types";
import { checkEnableMediasLoadingMore } from "@utils/common";
import { post2PostFormData } from "@utils/posts";
import { getBirthdayString } from "@utils/stringHelper";
import { useBlankLink } from "@utils/useBlankLink";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { NativeScrollEvent, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";

const CreatorProfileScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "Profile">,
) => {
	const { navigation } = props;
	const router = useRouter();

	const [openLink] = useBlankLink();
	const { copyString } = useClipboard();
	const featureGates = useFeatureGates();
	const { state, dispatch } = useAppContext();
	const { playlists, highlights, socialLinks, tiers } = state.profile;
	const profile = state.profile;
	const { step: postFormStep } = state.posts.modal;

	const [inLoadingMore, setInLoadingMore] = useState<{
		post: boolean;
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
	const [posts, setPosts] = useState<PostListRespBody>({
		posts: [],
		page: 1,
		size: 10,
		total: 0,
	});
	const [medias, setMedias] = useState<MediasRespBody>({
		medias: [],
		page: 1,
		size: 10,
		total: 0,
		videoTotal: 0,
		imageTotal: 0,
	});
	const [paidPosts, setPaidPosts] = useState<PostListRespBody>({
		posts: [],
		page: 1,
		size: 10,
		total: 0,
	});
	const [showWelcome, setShowWelcome] = useState(false);
	const [tab, setTab] = useState("post");
	const [openShare, setOpenShare] = useState(false);

	const [selectedPostId, setSelectedPostId] = useState("");
	const [openPostActions, setOpenPostActions] = useState(false);
	const [showStickyHeader, setShowStickyHeader] = useState(false);
	const [playlistId, setPlaylistId] = useState("");
	const [openPlaylistMenus, setOpenPlaylistMenus] = useState(false);
	const [openCommentModal, setOpenCommentModal] = useState(false);
	const [openAvatarModal, setOpenAvatarModal] = useState(false);
	const [openShopPostMenus, setOpenShopPostMenus] = useState(false);
	const [openPostAnalytics, setOpenPostAnalytics] = useState(false);
	const [openPostPurchased, setOpenPostPurchased] = useState(false);

	const onCreateNewPost = () => {
		if (postFormStep === PostStepTypes.Empty) {
			dispatch.setCommon({
				type: CommonActionType.toggleNewPostTypesModal,
				data: true,
			});
		} else {
			dispatch.setPosts({
				type: PostsActionType.updatePostModal,
				data: {
					visible: true,
				},
			});
		}
	};

	const onClickHighlight = async (highlight: IHighlight) => {
		const resp = await getHighlightById({ id: highlight.id });
		if (resp.ok) {
			dispatch.setStory({
				type: StoryActionType.updateStoryState,
				data: {
					highlightStory: {
						profile: state.profile,
						stories: resp.data.stories,
					},
				},
			});
			router.push({
				pathname: "stories",
				params: {
					screen: "Highlight",
					highlightId: highlight.id,
					userId: profile.userId,
					storyId: highlight.stories[0].id,
				},
			});
		}
	};

	const onClickAddTier = () => {
		navigation.navigate("Tier", { id: null });
	};

	const onClickEditTier = (id: string) => {
		navigation.navigate("Tier", { id: id });
	};

	const onClickDeleteTier = async (id: string) => {
		dispatch.setShowLoading();
		const resp = await deleteTier({ id: id }, { id: id });
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					tiers: tiers.filter((el) => el.id !== id),
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: "Failed to delete tier",
			});
		}
		dispatch.setHideLoading();
	};

	const fetchPlaylists = async () => {
		const resp = await getPlaylists();
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					playlists: resp.data.playlists,
				},
			});
		}
	};

	const fetchPosts = async () => {
		if (profile.userId === "0") {
			return;
		}
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
		setInLoadingMore({
			...inLoadingMore,
			post: false,
		});
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

	const fetchPaidPosts = async () => {
		if (profile.userId === "0") {
			return;
		}
		const filterObject: IPostFilterQuery = {
			page: paidPosts.page,
			size: 10,
		};
		const resp = await getPaidPosts(filterObject);
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

	const onArchivePostCallback = async () => {
		setPosts({
			...posts,
			posts: posts.posts.filter((post) => post.id !== selectedPostId),
		});
	};

	const onTrashCallback = async () => {
		setPosts({
			...posts,
			total: posts.total - 1,
			posts: posts.posts.filter((post) => post.id !== selectedPostId),
		});
		await dispatch.fetchProfile();
	};

	const onClickSocialLink = (url: string) => {
		openLink(url.includes("https://") ? url : `https://${url}`);
	};

	const onGoToAnalytics = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: PROFILE_THREE_DOTS_DIALOG_ID, show: false },
		});
		router.push({ pathname: "settings", params: { screen: "Analytics" } });
	};

	const onGoToEdit = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: PROFILE_THREE_DOTS_DIALOG_ID, show: false },
		});
		navigation.navigate("Edit");
	};

	// useEffect(() => {
	// 	if (newAccount) {
	// 		setShowWelcome(true);
	// 	}
	// }, [setShowWelcome, newAccount]);

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		setShowStickyHeader(nativeEvent.contentOffset.y > 80);
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !inLoadingMore.post && tab === "post") {
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
		const resp = await getPostMedias(filterObj);
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

	const onClickAvatar = () => {
		if (profile.stories.length > 0) {
			router.push({
				pathname: "stories",
				params: {
					screen: "Profile",
					userId: profile.userId,
					storyId: profile.stories[0].id,
				},
			});
		} else {
			setOpenAvatarModal(true);
		}
	};

	const onClickThreeDots = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: PROFILE_THREE_DOTS_DIALOG_ID, show: true },
		});
	};

	const onGoToArchivePost = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: PROFILE_THREE_DOTS_DIALOG_ID, show: false },
		});
		navigation.navigate("ArchivedPosts");
	};

	const onClickEditPlaylist = () => {
		setOpenPlaylistMenus(false);
		navigation.navigate("Playlist", { id: playlistId });
	};

	const onClickDeletePlaylist = async () => {
		setOpenPlaylistMenus(false);
		dispatch.setShowLoading();
		const resp = await deletePlaylist(
			{ id: playlistId },
			{ id: playlistId },
		);
		dispatch.setHideLoading();
		if (resp.ok) {
			router.back();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
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
		setPaidPosts({
			...paidPosts,
			posts: paidPosts.posts.map((post) =>
				post.id === postId
					? {
							...post,
							commentCount: commentCounts,
					  }
					: post,
			),
		});
	};

	const onEditPostCallback = () => {
		setOpenPostActions(false);
		// dispatch.setCommon({
		// 	type: CommonActionType.toggleNewPostTypesModal,
		// 	data: true,
		// });

		const focusedPost = posts.posts.find((el) => el.id === selectedPostId);
		if (!focusedPost) return;

		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: post2PostFormData(focusedPost),
		});

		dispatch.setPosts({
			type: PostsActionType.updatePostModal,
			data: {
				visible: true,
				step: PostStepTypes.Caption,
			},
		});
	};

	const onPinCallback = (post: IPost) => {
		const focusedPost = posts.posts.find((el) => el.id === post.id) || post;
		setOpenPostActions(false);
		if (post.isPinned) {
			setPosts({
				...posts,
				posts: [
					{ ...focusedPost, isPinned: post.isPinned },
					...posts.posts.filter((el) => el.id !== post.id),
				],
			});
		} else {
			const fromPosition = posts.posts.findIndex(
				(el) => el.id === post.id,
			);
			const toPosition = posts.posts
				.filter((el) => !el.isPinned)
				.findIndex(
					(_el) => new Date(_el.createdAt) < new Date(post.createdAt),
				);
			const rearrangedPosts = posts.posts;
			rearrangedPosts.splice(fromPosition, 1);
			rearrangedPosts.splice(
				toPosition + rearrangedPosts.filter((el) => el.isPinned).length,
				0,
				{
					...focusedPost,
					isPinned: post.isPinned,
				},
			);
			setPosts({
				...posts,
				posts: rearrangedPosts,
			});
		}

		const mediaIds = post.medias.map((media) => media.id);
		setMedias({
			...medias,
			medias: medias.medias.map((media) =>
				mediaIds.includes(media.id)
					? {
							...media,
							isPinned: post.isPinned,
					  }
					: media,
			),
		});
	};

	const postLiveModalCallback = async (
		postId: string,
		action: ActionType,
	) => {
		if (tw.prefixMatch("md")) {
			const resp = await getPostById({ id: postId });
			if (action === ActionType.Create && resp.ok && resp.data.isPosted) {
				setPosts({
					...posts,
					total: posts.total + 1,
					posts: [resp.data, ...posts.posts],
				});
			} else if (action === ActionType.Update && resp.ok) {
				const newPosts = posts.posts;
				const position = posts.posts.findIndex(
					(el) => el.id === postId,
				);
				newPosts.splice(position, 1, resp.data);
				setPosts({
					...posts,
					posts: [...newPosts],
				});
			}
		} else {
			fetchPosts();
		}
	};

	const playlistActions: ICardAction[] = [
		{
			title: "Edit Playlist",
			iconType: IconTypes.Edit,
			onClick: onClickEditPlaylist,
			iconSize: 18,
		},
		{
			title: "Delete",
			iconType: IconTypes.Cancel,
			iconColor: "fans-red",
			onClick: onClickDeletePlaylist,
			labelClass: "text-fans-red",
		},
	];

	const onShopCopyLink = async () => {
		const url = createURL(`p/${selectedPostId}`);
		await copyString(url);
		setOpenShopPostMenus(false);
	};

	const onShopViewAnalytics = () => {
		setOpenShopPostMenus(false);
		setOpenPostAnalytics(true);
	};

	const onShopHide = async () => {
		const resp = await hidePaidPostByIId(null, { id: selectedPostId });
		if (resp.ok) {
			setPaidPosts({
				...paidPosts,
				posts: paidPosts.posts.filter(
					(post) => post.id !== selectedPostId,
				),
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
		setOpenShopPostMenus(false);
	};

	const onShopDelete = async () => {
		const resp = await deletePostById(
			{ id: selectedPostId },
			{ id: selectedPostId },
		);
		if (resp.ok) {
			setPosts({
				...posts,
				posts: posts.posts.filter((post) => post.id !== selectedPostId),
			});
			setPaidPosts({
				...paidPosts,
				posts: paidPosts.posts.filter(
					(post) => post.id !== selectedPostId,
				),
			});
		}
		setOpenShopPostMenus(false);
	};

	const shopPostActions: ICardAction[] = [
		{
			title: "Copy link",
			iconType: IconTypes.Edit,
			onClick: onShopCopyLink,
			iconSize: 18,
		},
		{
			title: "View analytics",
			iconType: IconTypes.Statistics,
			onClick: onShopViewAnalytics,
			iconSize: 18,
			hide: !featureGates.has("2024_02-shop-analytics"),
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
		setPaidPosts({
			...paidPosts,
			posts: paidPosts.posts.map((el) =>
				el.id === postId
					? {
							...el,
							...data,
					  }
					: el,
			),
		});
	};

	const handleUpdateDisplayShop = async (val: boolean) => {
		const resp = await updateMyProfile({ isDisplayShop: val });
		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: {
					isDisplayShop: val,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	useEffect(() => {
		if (profile.userId) {
			fetchPlaylists();
		}
	}, [profile.userId]);

	useEffect(() => {
		if (profile.userId) {
			fetchPosts();
		}
	}, [filter.post, profile.userId, posts.page, tab]);

	useEffect(() => {
		if (profile.userId) {
			fetchMedias();
		}
	}, [profile.userId, medias.page, filter.media]);

	useEffect(() => {
		if (profile.userId) fetchPaidPosts();
	}, [profile.userId, paidPosts.page]);

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
					onClickArchive={onGoToArchivePost}
					onClickAnalytics={onGoToAnalytics}
					onClickMenu={onClickThreeDots}
				/>
				<ScrollView
					style={tw.style("flex-1")}
					onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
					scrollEventThrottle={16}
					showsVerticalScrollIndicator
					nestedScrollEnabled={true}
				>
					<LayoutContentsContainer>
						<TopActions
							onClickBack={() => {
								router.push("/posts");
							}}
							onClickMenu={onClickThreeDots}
						/>

						<ProfileCarousel images={profile.cover} />

						<FansView padding={{ x: 18 }}>
							<FansView
								flexDirection="row"
								alignItems="end"
								margin={{ t: -30 }}
								justifyContent="between"
							>
								<FansView position="relative">
									<RoundedBorderSvg
										size={91}
										style={tw.style(
											"absolute top-[-2px] left-[-2px]",
											profile.stories.length === 0 &&
												"hidden",
										)}
									/>
									<AvatarWithStatus
										size={79}
										avatar={profile.avatar}
										onPress={onClickAvatar}
									/>
								</FansView>

								<FansView flexDirection="row" gap={7}>
									<FansIconButton
										onPress={onGoToArchivePost}
										backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
									>
										<FypSvg
											svg={ArchivedPostSvg}
											width={17.4}
											height={17.5}
											color="fans-black dark:fans-white"
										/>
									</FansIconButton>
									<FansIconButton
										onPress={onGoToAnalytics}
										backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
									>
										<FypSvg
											svg={StatisticsSvg}
											width={15.84}
											height={15.8}
											color="fans-black dark:fans-white"
										/>
									</FansIconButton>

									<Button
										icon={() => (
											<EditSvg
												width={12.12}
												height={12.56}
												color="#fff"
											/>
										)}
										onPress={onGoToEdit}
										textColor="#fff"
										buttonColor="#a854f5"
										style={tw.style(
											"items-center h-[34px] flex-row",
										)}
										labelStyle={tw.style(
											"text-[17px] font-bold leading-[22px] my-0 mr-[15px]",
										)}
										mode="contained"
									>
										Edit profile
									</Button>
								</FansView>
							</FansView>

							<FansView margin={{ t: 16, b: 20 }}>
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
										{profile.displayName}
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
								<FansText
									fontSize={16}
									lineHeight={21}
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
								>
									{profile.profileLink
										? `@${profile.profileLink}`
										: ""}
								</FansText>
							</FansView>
							<CopyLink url={createURL(profile.profileLink)} />

							<FansView margin={{ t: 16 }}>
								<BioText text={profile.bio} />
							</FansView>

							<FansView
								margin={{ t: 18 }}
								flexDirection="row"
								alignItems="center"
								gap={16}
							>
								{profile.location ? (
									<FansView
										flexDirection="row"
										alignItems="center"
										gap={4}
									>
										<FypSvg
											svg={AddressSvg}
											width={18}
											height={18}
											color="fans-black dark:fans-white"
										/>
										<FansText
											fontSize={16}
											lineHeight={21}
											style={tw.style(
												"text-fans-black dark:text-fans-white",
											)}
										>
											{profile.location}
										</FansText>
									</FansView>
								) : null}
								{profile.user?.birthdate &&
								profile.user?.isShowProfile ? (
									<FansView
										flexDirection="row"
										alignItems="center"
										gap={4}
									>
										<FypSvg
											svg={BirthdaySvg}
											width={18}
											height={18}
											color="fans-black dark:fans-white"
											style={tw.style("mt-[-2px]")}
										/>
										<FansText
											style={tw.style(
												"text-fans-black dark:text-fans-white",
											)}
											fontSize={16}
											lineHeight={21}
										>
											{getBirthdayString(
												profile.user?.birthdate,
											)}
										</FansText>
									</FansView>
								) : null}
							</FansView>

							<FansView margin={{ t: 18, b: 26 }}>
								<CountsDetails
									photos={profile.imageCount}
									videos={profile.videoCount}
									likes={profile.likeCount}
								/>
							</FansView>
							<FansView margin={{ b: 24 }}>
								<SocialLinkList
									data={socialLinks}
									onClickLink={onClickSocialLink}
								/>
							</FansView>

							<FansView
								margin={{ b: 24 }}
								style={tw.style(
									profile.subscriptionType ===
										SubscriptionTypes.Tier
										? "flex"
										: "hidden",
								)}
							>
								<RoundButton
									variant={RoundButtonType.PRIMARY}
									onPress={() =>
										navigation.navigate("Tier", {
											id: null,
										})
									}
								>
									Create Tier
								</RoundButton>
							</FansView>

							<RoundButton
								icon={() => (
									<DocEditSvg
										width={15.44}
										height={15.15}
										color="#fff"
									/>
								)}
								variant={RoundButtonType.PRIMARY}
								onPress={onCreateNewPost}
							>
								New Post
							</RoundButton>

							<FansDivider
								style={tw.style("mb-4 mt-6 h-[1px]")}
							/>
							<SubscriptionPart
								profile={profile}
								onClickAddTier={onClickAddTier}
								onClickEditTier={onClickEditTier}
								onClickDeleteTier={onClickDeleteTier}
							/>
						</FansView>
						<FypNullableView visible={highlights.length > 0}>
							<ScrollView
								horizontal
								contentContainerStyle={{
									paddingHorizontal: 18,
									columnGap: 15,
								}}
								showsHorizontalScrollIndicator={false}
							>
								{highlights.map((highlight) => (
									<StoryCell
										key={highlight.id}
										title={highlight.title}
										image={highlight.cover}
										onClick={() =>
											onClickHighlight(highlight)
										}
									/>
								))}
							</ScrollView>
						</FypNullableView>

						<FansView margin={{ t: 24 }}>
							<FansView style={tw.style("md:px-[18px]")}>
								<Tabs
									tabs={[
										{
											data: "post",
											label: `POSTS ${posts.total}`,
										},
										{
											data: "media",
											label: `MEDIA ${
												profile.imageCount +
												profile.videoCount
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
									onChangeTab={(val) => setTab(val)}
								/>
							</FansView>

							{tab === "post" && (
								<PostsTabContents
									posts={posts.posts}
									filter={filter.post}
									onChangeFilter={onChangeFilter}
									categories={profile.categories.filter(
										(category) => category.isActive,
									)}
									onClickPostAction={(id) => {
										setSelectedPostId(id);
										setOpenPostActions(true);
									}}
									onClickComment={(id) => {
										setSelectedPostId(id);
										setOpenCommentModal(true);
									}}
									updatePostCallback={updatePostCallback}
								/>
							)}
							{tab === "media" && (
								<MediaTabContents
									allCounts={
										profile.imageCount + profile.videoCount
									}
									medias={medias}
									mediaType={filter.media}
									onChangeFilter={onFilterMedia}
								/>
							)}
							{tab === "playlists" && (
								<PlaylistsTabContents
									playlists={playlists}
									onClickMenus={(id) => {
										setPlaylistId(id);
										setOpenPlaylistMenus(true);
									}}
									handleAdd={() =>
										navigation.navigate("Playlist", {
											id: null,
										})
									}
									handleEdit={(id) =>
										navigation.navigate("Playlist", {
											id: id,
										})
									}
								/>
							)}
							{tab === "shop" && (
								<ShopTabContents
									profile={profile}
									posts={paidPosts.posts}
									onPressPostMenu={(postId) => {
										setSelectedPostId(postId);
										setOpenShopPostMenus(true);
									}}
									onClickComment={(postId) => {
										setSelectedPostId(postId);
										setOpenCommentModal(true);
									}}
									updatePostCallback={updatePostCallback}
									onToggleDisplayShop={
										handleUpdateDisplayShop
									}
									onViewGraph={(postId) => {
										setSelectedPostId(postId);
										setOpenPostAnalytics(true);
									}}
									onViewPurchased={(postId) => {
										setSelectedPostId(postId);
										setOpenPostPurchased(true);
									}}
								/>
							)}
						</FansView>
					</LayoutContentsContainer>
				</ScrollView>
			</FansView>

			<WelcomeModal
				visible={showWelcome}
				handleClose={() => setShowWelcome(false)}
			/>

			<ProfilePostActions
				post={posts.posts.find((post) => post.id === selectedPostId)}
				open={openPostActions}
				onClose={() => setOpenPostActions(false)}
				onPostAdvancedCallback={onPostAdvancedCallback}
				onPinCallback={onPinCallback}
				onArchivePostCallback={onArchivePostCallback}
				onTrashCallback={onTrashCallback}
				onEditPostCallback={onEditPostCallback}
			/>

			<ShareDialog open={openShare} onClose={() => setOpenShare(false)} />

			<ProfileThreeDotsDialog navigation={navigation} />
			<CardActions
				open={openPlaylistMenus}
				onClose={() => setOpenPlaylistMenus(false)}
				actions={playlistActions}
			/>
			<PostCommentDialog
				visible={openCommentModal}
				postId={selectedPostId}
				onDismiss={() => setOpenCommentModal(false)}
				onCallback={onCommentCallback}
			/>
			<PostLiveDialog closeCallback={postLiveModalCallback} />
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
				visible={openPostAnalytics || openPostPurchased}
				showFans={openPostPurchased}
				onDismiss={() => {
					setOpenPostAnalytics(false);
					setOpenPostPurchased(false);
				}}
				handleOpenMessage={() => {}}
				post={paidPosts.posts.find(
					(post) => post.id === selectedPostId,
				)}
			/>
		</AppLayout>
	);
};

export default CreatorProfileScreen;
