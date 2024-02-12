import CardActions from "@components/common/cardActions";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import {
	PostCommentDialog,
	SendMessageDialog,
} from "@components/posts/dialogs";
import PostCard from "@components/posts/postCard";
import { POST_REPORT_DIALOG_ID } from "@constants/modal";
import { ModalActionType, useAppContext } from "@context/useAppContext";
import { getPostById, hidePostFromFeed } from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { IconTypes } from "@usertypes/commonEnums";
import { PostDetailNavigationStacks } from "@usertypes/navigations";
import { ICardAction, IPost } from "@usertypes/types";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const PostDetailScreen = (
	props: NativeStackScreenProps<PostDetailNavigationStacks, "Detail">,
) => {
	const { navigation, route } = props;
	const { id } = route.params;
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { dispatch } = useAppContext();
	const { copyString } = useClipboard();

	const [post, setPost] = useState<IPost | null>(null);
	const [openMessageDialog, setOpenMessageDialog] = useState(false);
	const [openActionMenu, setOpenActionMenu] = useState(false);
	const [openCommentModal, setOpenCommentModal] = useState(false);

	const onClickPostActionMenu = (id: string) => {
		setOpenActionMenu(true);
	};

	const onClickMessage = (id: string) => {
		setOpenMessageDialog(true);
	};

	const handleReportPost = () => {
		setOpenActionMenu(false);
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: {
				id: POST_REPORT_DIALOG_ID,
				show: true,
				payload: {
					postId: post?.id,
				},
			},
		});
	};

	const getPostDetail = async () => {
		const resp = await getPostById({ id: id as string });
		if (resp.ok && resp.data.isPosted) {
			setPost({ ...resp.data });
		} else {
			Toast.show({
				type: "error",
				text1: "Failed to fetch data.",
			});
		}
		dispatch.setHideLoading();
	};

	const handleHidePostFeed = async () => {
		setOpenActionMenu(false);
		const resp = await hidePostFromFeed(null, {
			id: id,
		});
		if (resp.ok) {
			Toast.show({
				type: "success",
				text1: "Hided post",
			});
		}
	};

	const handleCopyPostLink = async () => {
		setOpenActionMenu(false);
		const url = createURL(`p/${id}`);
		await copyString(url);
	};

	const handleAddRemoveFromList = () => {
		setOpenActionMenu(false);
	};

	const handleUnsubscribe = () => {
		setOpenActionMenu(false);
	};

	const onCommentCallback = (postId: string, commentCounts: number) => {
		if (post) {
			setPost({
				...post,
				commentCount: commentCounts,
			});
		}
	};

	const handlePressBack = () => {
		if (navigation.canGoBack()) {
			navigation.goBack();
		} else {
			router.replace("/posts");
		}
	};

	const postActions: ICardAction[] = [
		// {
		// 	title: "Unsubscribe",
		// 	iconType: IconTypes.Unsubscribe,
		// 	onClick: handleUnsubscribe,
		// },
		// {
		// 	title: "Add/remove from lists",
		// 	iconType: IconTypes.AddRemoveFromLists,
		// 	onClick: handleAddRemoveFromList,
		// },
		{
			title: "Copy post link",
			iconType: IconTypes.CopyLink,
			onClick: handleCopyPostLink,
		},
		{
			title: "Hide posts from feed",
			iconType: IconTypes.EyeHide,
			onClick: handleHidePostFeed,
		},
		{
			title: "Report post",
			iconType: IconTypes.Report,
			iconColor: "#eb2121",
			onClick: handleReportPost,
			labelClass: "text-fans-red",
		},
	];

	const updatePostCallback = (postId: string, data: Partial<IPost>) => {
		if (post) setPost({ ...post, ...data });
	};

	useEffect(() => {
		getPostDetail();
	}, []);

	return (
		<AppLayout>
			<View style={tw.style("flex-1")}>
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer>
						<View
							style={{
								paddingTop: insets.top,
								flex: 1,
							}}
						>
							<CustomTopNavBar
								title="Post"
								onClickLeft={handlePressBack}
								onClickRight={() => {}}
								rightLabel=""
							/>
							<View style={tw.style("md:py-10")}>
								{post ? (
									<PostCard
										data={post}
										onClickActionMenu={() =>
											onClickPostActionMenu(post.id)
										}
										onClickMessage={() =>
											onClickMessage(post.id)
										}
										onClickComment={() => {
											setOpenCommentModal(true);
										}}
										updatePostCallback={updatePostCallback}
									/>
								) : null}
							</View>
						</View>
					</LayoutContentsContainer>
				</ScrollView>
			</View>

			<SendMessageDialog
				open={openMessageDialog}
				onClose={() => setOpenMessageDialog(false)}
				reciever={post?.profile}
			/>

			<CardActions
				open={openActionMenu}
				onClose={() => setOpenActionMenu(false)}
				actions={postActions}
			/>
			<PostCommentDialog
				visible={openCommentModal}
				postId={id}
				onDismiss={() => setOpenCommentModal(false)}
				onCallback={onCommentCallback}
			/>
		</AppLayout>
	);
};

export default PostDetailScreen;
