import CardActions from "@components/common/cardActions";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout from "@components/common/layout";
import SearchTextInput from "@components/common/searchTextInput";
import { FansView } from "@components/controls";
import { PostAnalyticsModal } from "@components/modals/shop";
import { FilterButton } from "@components/posts/common";
import { PostCommentDialog } from "@components/posts/dialogs";
import PostCard from "@components/posts/postCard";
import { useAppContext } from "@context/useAppContext";
import {
	getPaidPosts,
	deletePostById,
	setBookmark,
	deleteBookmark,
	unlikePostWithPostId,
	likePostWithPostId,
} from "@helper/endpoints/post/apis";
import { PostListRespBody } from "@helper/endpoints/post/schemas";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { IconTypes } from "@usertypes/commonEnums";
import { ProfileNavigationStacks } from "@usertypes/navigations";
import { IPostFilterQuery } from "@usertypes/params";
import { ICardAction } from "@usertypes/types";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import React, { useState, useEffect } from "react";
import { ScrollView, NativeScrollEvent } from "react-native";

const PurchasesScreen = (
	props: NativeStackScreenProps<ProfileNavigationStacks, "Purchases">,
) => {
	const { navigation } = props;
	const featureGates = useFeatureGates();
	const { copyString } = useClipboard();
	const { state } = useAppContext();
	const { profile } = state;

	const [selectedPostId, setSelectedPostId] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [inLoadingMore, setInLoadingMore] = useState(false);
	const [paidPosts, setPaidPosts] = useState<PostListRespBody>({
		posts: [],
		page: 1,
		size: 10,
		total: 0,
	});
	const [openPostMenus, setOpenPostMenus] = useState(false);
	const [openPostAnalytics, setOpenPostAnalytics] = useState(false);
	const [openCommentModal, setOpenCommentModal] = useState(false);

	const filterOptions = featureGates.has("2024_01-purchases-search-filter")
		? ["Content Purchased", "Video calls", "Custom videos"]
		: ["Content Purchased"];

	const handlePressPrev = async () => {
		navigation.goBack();
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
		setInLoadingMore(false);
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

	const handleBookmark = async (id: string) => {
		const post = paidPosts.posts.find((el) => el.id === id);
		let respValue = {
			isBookmarked: post?.isBookmarked,
			bookmarkCount: post?.bookmarkCount,
		};
		if (post?.isBookmarked) {
			const resp = await deleteBookmark(null, { id });
			if (resp.ok) {
				respValue = {
					isBookmarked: resp.data.updatedPost.isBookmarked,
					bookmarkCount: resp.data.updatedPost.bookmarkCount,
				};
			}
		} else {
			const resp = await setBookmark(null, { id });
			if (resp.ok) {
				respValue = {
					isBookmarked: resp.data.updatedPost.isBookmarked,
					bookmarkCount: resp.data.updatedPost.bookmarkCount,
				};
			}
		}
		setPaidPosts({
			...paidPosts,
			posts: paidPosts.posts.map((el) =>
				el.id === id
					? {
							...el,
							isBookmarked: respValue.isBookmarked ?? false,
							bookmarkCount: respValue.bookmarkCount ?? 0,
					  }
					: el,
			),
		});
	};

	const handleLikePost = async (postId: string) => {
		const post = paidPosts.posts.find((el) => el.id === postId);
		let respValue = {
			likeCount: post?.likeCount,
			isLiked: post?.isLiked,
		};
		if (post?.isLiked) {
			const resp = await unlikePostWithPostId(null, {
				id: postId,
			});
			if (resp.ok) {
				respValue = {
					likeCount: resp.data.likeCount,
					isLiked: resp.data.isLiked,
				};
			}
		} else {
			const resp = await likePostWithPostId(null, {
				id: postId,
			});
			if (resp.ok) {
				respValue = {
					likeCount: resp.data.likeCount,
					isLiked: resp.data.isLiked,
				};
			}
		}
		setPaidPosts({
			...paidPosts,
			posts: paidPosts.posts.map((el) =>
				el.id === postId
					? {
							...el,
							likeCount: respValue?.likeCount ?? 0,
							isLiked: respValue.isLiked,
					  }
					: el,
			),
		});
	};

	const onCommentCallback = (postId: string, commentCounts: number) => {
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

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;

		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !inLoadingMore) {
			if (paidPosts.total > 10 * paidPosts.page) {
				setInLoadingMore(true);
				setPaidPosts({
					...paidPosts,
					page: paidPosts.page + 1,
				});
			}
		}
	};

	const onPostCopyLink = async () => {
		const url = createURL(`p/${selectedPostId}`);
		await copyString(url);
		setOpenPostMenus(false);
	};

	const onShopViewAnalytics = () => {
		setOpenPostMenus(false);
		setOpenPostAnalytics(true);
	};

	const onShopHide = () => {
		setOpenPostMenus(false);
	};

	const onShopDelete = async () => {
		const resp = await deletePostById(
			{ id: selectedPostId },
			{ id: selectedPostId },
		);
		if (resp.ok) {
			setPaidPosts({
				...paidPosts,
				posts: paidPosts.posts.filter(
					(post) => post.id !== selectedPostId,
				),
			});
		}
		setOpenPostMenus(false);
	};

	const shopPostActions: ICardAction[] = [
		{
			title: "Copy link",
			iconType: IconTypes.Edit,
			onClick: onPostCopyLink,
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
		if (profile.userId) fetchPaidPosts();
	}, [profile.userId, paidPosts.page]);

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<FansView flex="1">
				<ScrollView
					style={tw.style("flex-1")}
					onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
					scrollEventThrottle={16}
				>
					<FansView style={tw.style("md:px-[140px]")}>
						<CustomTopNavBar
							title="Purchases"
							onClickLeft={handlePressPrev}
						/>
						<FansView
							style={tw.style(
								"pt-6 md:pt-[46px] w-full md:max-w-[674px] md:mx-auto",
							)}
						>
							{featureGates.has(
								"2024_01-purchases-search-filter",
							) ? (
								<FansView style={tw.style("px-[18px] md:px-0")}>
									<SearchTextInput
										value={searchQuery}
										onChangeText={setSearchQuery}
										placeholder="Search product"
									/>
								</FansView>
							) : null}

							<FansView
								flexDirection="row"
								gap={7}
								margin={{ b: 38, t: 16 }}
								style={tw.style("px-[18px] md:px-0")}
							>
								{filterOptions.map((el) => (
									<FilterButton
										title={el}
										onClick={() => {}}
										isSelected={true}
									/>
								))}
							</FansView>
							<FansView gap={18}>
								{paidPosts.posts.map((post) => (
									<PostCard
										data={post}
										purchaseCard
										onClickUnlock={() => {}}
										onClickBookmark={() =>
											handleBookmark(post.id)
										}
										onClickLike={() =>
											handleLikePost(post.id)
										}
										onClickActionMenu={() => {
											setSelectedPostId(post.id);
											setOpenPostMenus(true);
										}}
										onClickComment={() => {
											setSelectedPostId(post.id);
											setOpenCommentModal(true);
										}}
									/>
								))}
							</FansView>
						</FansView>
					</FansView>
				</ScrollView>
			</FansView>
			<CardActions
				open={openPostMenus}
				onClose={() => setOpenPostMenus(false)}
				actions={shopPostActions}
			/>
			<PostAnalyticsModal
				visible={openPostAnalytics}
				onDismiss={() => setOpenPostAnalytics(false)}
				handleOpenMessage={() => {}}
			/>
			<PostCommentDialog
				visible={openCommentModal}
				postId={selectedPostId}
				onDismiss={() => setOpenCommentModal(false)}
				onCallback={onCommentCallback}
			/>
		</AppLayout>
	);
};

export default PurchasesScreen;
