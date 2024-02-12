import { EditNote1Svg } from "@assets/svgs/common";
import {
	FansButton3,
	FansGap,
	FansHorizontalDivider,
	FansScreen3,
	FansSvg,
	FansView,
} from "@components/controls";
import { PostLiveDialog } from "@components/posts/dialogs";
import ScheduledPostCard from "@components/posts/postCard/scheduledPostCard";
import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import {
	CommonActionType,
	PostsActionType,
	useAppContext,
} from "@context/useAppContext";
import {
	deletePostById,
	getPostById,
	getPostFeedForProfile,
} from "@helper/endpoints/post/apis";
import { PostListRespBody } from "@helper/endpoints/post/schemas";
import tw from "@lib/tailwind";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActionType, PostStepTypes } from "@usertypes/commonEnums";
import { SettingsScheduledPostsNativeStackParams } from "@usertypes/navigations";
import { IPostFilterQuery } from "@usertypes/params";
import { IPost } from "@usertypes/types";
import { post2PostFormData } from "@utils/posts";
import { useRouter } from "expo-router";
import React, { Fragment, useEffect, useState } from "react";
import { NativeScrollEvent, ScrollView } from "react-native";

const Stack =
	createNativeStackNavigator<SettingsScheduledPostsNativeStackParams>();

const SettingsScheduledPostsNativeStack = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="ScheduledPosts"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="ScheduledPosts"
				component={ScheduledPostsContentView}
				options={{ title: "Scheduled posts" }}
			/>
		</Stack.Navigator>
	);
};

const ScheduledPostsContentView = () => {
	const { state, dispatch } = useAppContext();
	const profile = state.profile;
	const [inLoadingMore, setInLoadingMore] = useState(false);
	const [posts, setPosts] = useState<PostListRespBody>({
		posts: [],
		page: 1,
		size: 10,
		total: 0,
	});

	const fetchScheduledPost = async () => {
		if (profile.userId === "0") {
			return;
		}

		const filterObject: IPostFilterQuery = {
			page: posts.page,
			size: 10,
			schedule: true,
		};
		const resp = await getPostFeedForProfile(
			{
				userId: profile.userId,
			},
			filterObject,
		);
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

	const onCreateNewPost = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleNewPostTypesModal,
			data: true,
		});
	};

	const onDeletePost = async (id: string) => {
		const resp = await deletePostById({ id }, { id });

		if (resp.ok) {
			setPosts({
				...posts,
				posts: posts.posts.filter((post) => post.id !== id),
			});
		}
	};

	const onEditPost = async (post: IPost) => {
		dispatch.setPosts({
			type: PostsActionType.updatePostForm,
			data: post2PostFormData(post),
		});

		dispatch.setPosts({
			type: PostsActionType.updatePostModal,
			data: {
				visible: true,
				step: PostStepTypes.Caption,
			},
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
			fetchScheduledPost();
		}
	};

	useEffect(() => {
		if (profile.userId) {
			fetchScheduledPost();
		}
	}, [profile.userId, posts.page]);

	return (
		<FansScreen3 contentStyle1={{ maxWidth: { lg: 670 } }}>
			<FansView flex="1" position="relative">
				<ScrollView
					style={tw.style("flex-1")}
					onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
					scrollEventThrottle={16}
					showsVerticalScrollIndicator
					nestedScrollEnabled={true}
					showsHorizontalScrollIndicator={false}
				>
					<FansGap height={{ lg: 43.4 }} />
					<FansButton3
						title="New Post"
						icon={
							<FansSvg
								width={13.72}
								height={13.69}
								svg={EditNote1Svg}
								color1="purple"
							/>
						}
						buttonStyle={{
							backgroundColor: tw.prefixMatch("dark")
								? "black-1d"
								: "white",
							gap: 7.1,
						}}
						textStyle1={{ color: "purple" }}
						onPress={onCreateNewPost}
					/>
					<FansGap height={27.3} />
					<FansView gap={9}>
						{posts.posts.map((item, index) => {
							return (
								<Fragment key={item.id}>
									{index > 0 &&
										item.isPosted !==
											posts.posts[index - 1].isPosted && (
											<Fragment>
												<FansGap height={13.4} />
												<FansHorizontalDivider />
												<FansGap height={13.6} />
											</Fragment>
										)}
									<ScheduledPostCard
										data={item}
										onClickEdit={() => {
											onEditPost(item);
										}}
										onClickRemove={() => {
											onDeletePost(item.id);
										}}
									/>
								</Fragment>
							);
						})}
					</FansView>
					<FansGap height={20} />
				</ScrollView>
			</FansView>
			<PostLiveDialog closeCallback={postLiveModalCallback} />
		</FansScreen3>
	);
};

const ScheduledPostsScreen = () => {
	return SettingsNavigationLayout(<SettingsScheduledPostsNativeStack />);
};

export default ScheduledPostsScreen;
