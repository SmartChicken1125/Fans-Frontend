import OnlineAvatar from "@components/avatar/OnlineAvatar";
import CardActions from "@components/common/cardActions";
import CustomTopNavBar from "@components/common/customTopNavBar";
import SearchTextInput from "@components/common/searchTextInput";
import { FansScreen2, FansText, FansView } from "@components/controls";
import { PostAnalyticsModal } from "@components/modals/shop";
import { FilterButton } from "@components/posts/common";
import {
	PostCommentDialog,
	SendMessageDialog,
} from "@components/posts/dialogs";
import PostCard from "@components/posts/postCard";
import { POST_REPORT_DIALOG_ID } from "@constants/modal";
import { useAppContext, ModalActionType } from "@context/useAppContext";
import { getPurchasedPosts } from "@helper/endpoints/post/apis";
import { PostListRespBody } from "@helper/endpoints/post/schemas";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { chatInboxAtom } from "@state/chat";
import { useFeatureGates } from "@state/featureGates";
import { IconTypes } from "@usertypes/commonEnums";
import { ChatNativeStackParams } from "@usertypes/navigations";
import { IPostFilterQuery } from "@usertypes/params";
import { ICardAction, IPost } from "@usertypes/types";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { ScrollView, NativeScrollEvent, View, Pressable } from "react-native";
import { useRecoilValue } from "recoil";

const PurchasesScreen = (
	props: NativeStackScreenProps<ChatNativeStackParams, "Purchases">,
) => {
	const { navigation } = props;
	const featureGates = useFeatureGates();
	const { copyString } = useClipboard();
	const { state, dispatch } = useAppContext();
	const { profile } = state;

	const router = useRouter();

	const inbox = useRecoilValue(chatInboxAtom);
	const id = props.route.params?.id ?? "0";
	const conversation = inbox.data.get(id);

	const [selectedPostId, setSelectedPostId] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [inLoadingMore, setInLoadingMore] = useState(false);
	const [posts, setPosts] = useState<PostListRespBody>({
		posts: [],
		page: 1,
		size: 10,
		total: 0,
	});
	const [openPostMenus, setOpenPostMenus] = useState(false);
	const [openPostAnalytics, setOpenPostAnalytics] = useState(false);
	const [openCommentModal, setOpenCommentModal] = useState(false);
	const [openMessageDialog, setOpenMessageDialog] = useState(false);

	const filterOptions = featureGates.has("2024_01-purchases-search-filter")
		? ["Content Purchased", "Video calls", "Custom videos"]
		: ["Content Purchased"];

	const handlePressPrev = async () => {
		navigation.goBack();
	};

	const fetchPurchasedPosts = async () => {
		if (profile.userId === "0") {
			return;
		}
		const filterObject: IPostFilterQuery = {
			page: posts.page,
			size: 10,
		};
		const resp = await getPurchasedPosts(filterObject);
		setInLoadingMore(false);
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

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;

		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !inLoadingMore) {
			if (posts.total > 10 * posts.page) {
				setInLoadingMore(true);
				setPosts({
					...posts,
					page: posts.page + 1,
				});
			}
		}
	};

	const onPostCopyLink = async () => {
		const url = createURL(`p/${selectedPostId}`);
		await copyString(url);
		setOpenPostMenus(false);
	};

	const handleReportPost = () => {
		setOpenPostMenus(false);
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: {
				id: POST_REPORT_DIALOG_ID,
				show: true,
				payload: { postId: selectedPostId },
			},
		});
	};

	const onClickMessage = (id: string) => {
		setSelectedPostId(id);
		setOpenMessageDialog(true);
	};

	const postActions: ICardAction[] = [
		{
			title: "Copy link",
			iconType: IconTypes.Edit,
			onClick: onPostCopyLink,
			iconSize: 18,
		},
		{
			title: "Report post",
			iconType: IconTypes.Report,
			iconColor: "#eb2121",
			onClick: handleReportPost,
			iconSize: 18,
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
	};

	useEffect(() => {
		if (profile.userId) fetchPurchasedPosts();
	}, [profile.userId, posts.page]);

	if (!conversation) {
		return <FansScreen2 contentStyle={tw.style("pt-[0px]")}></FansScreen2>;
	}

	return (
		<View>
			<Stack.Screen
				options={{
					headerTitleAlign: "left",
					headerTitle: (props) => (
						<Pressable
							onPress={() => {
								const profileLink =
									state.profile.profileLink ||
									conversation.otherParticipant?.profileLink;
								if (profileLink) {
									router.push(`/${profileLink}`);
								}
							}}
						>
							<View
								{...props}
								style={tw.style(
									"flex-row gap-2.5 items-center",
								)}
							>
								<View style={tw.style("relative")}>
									<OnlineAvatar
										size="34px"
										image={conversation.icon || undefined}
									/>
									<View
										style={tw.style(
											"w-[11px] h-[11px]",
											"absolute right-0 bottom-0",
											"bg-fans-green",
											"border-[2px] border-white rounded-full dark:border-fans-black-1d",
										)}
									/>
								</View>
								<FansText
									fontFamily="inter-semibold"
									fontSize={16}
								>
									{conversation.name}
								</FansText>
							</View>
						</Pressable>
					),
				}}
			/>
			<ScrollView
				style={tw.style("flex-1")}
				onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
				scrollEventThrottle={16}
			>
				<FansView style={tw.style("md:px-[140px]")}>
					<FansView
						style={tw.style(
							"pt-6 md:pt-[46px] w-full md:max-w-[674px] md:mx-auto",
						)}
					>
						{featureGates.has("2024_01-purchases-search-filter") ? (
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
									key={el}
									title={el}
									onClick={() => {}}
									isSelected={true}
								/>
							))}
						</FansView>
						<FansView gap={18}>
							{posts.posts.map((post) => (
								<PostCard
									key={post.id}
									data={post}
									onClickUnlock={() => {}}
									onClickActionMenu={() => {
										setSelectedPostId(post.id);
										setOpenPostMenus(true);
									}}
									onClickComment={() => {
										setSelectedPostId(post.id);
										setOpenCommentModal(true);
									}}
									updatePostCallback={updatePostCallback}
									onClickMessage={() =>
										onClickMessage(post.id)
									}
								/>
							))}
						</FansView>
					</FansView>
				</FansView>
			</ScrollView>
			<CardActions
				open={openPostMenus}
				onClose={() => setOpenPostMenus(false)}
				actions={postActions}
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
			<SendMessageDialog
				open={openMessageDialog}
				onClose={() => setOpenMessageDialog(false)}
				reciever={
					posts.posts.find((post) => post.id === selectedPostId)
						?.profile
				}
			/>
		</View>
	);
};

export default PurchasesScreen;
