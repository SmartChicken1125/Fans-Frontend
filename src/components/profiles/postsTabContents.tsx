import { FansDivider } from "@components/controls";
import PostCard from "@components/posts/postCard";
import SubscribeAlert from "@components/profiles/subscribeAlert";
import tw from "@lib/tailwind";
import { SortType } from "@usertypes/commonEnums";
import { ICategory, IPost, ISubscription } from "@usertypes/types";
import React, { FC, Fragment } from "react";
import { ScrollView, View } from "react-native";
import FilterButton from "./filterButton";

interface Props {
	posts: IPost[];
	totalPostsCount?: number;
	categories: ICategory[];
	onClickPostAction: (postId: string) => void;
	onClickPostMessage?: (postId: string) => void;
	needToSubscribe?: boolean;
	subscription?: ISubscription;
	onClickSubscribe?: () => void;
	filter: string | SortType;
	onChangeFilter: (val: string | SortType) => void;
	onClickUnlock?: (post: IPost) => void;
	onClickComment: (postId: string) => void;
	updatePostCallback: (postId: string, data: Partial<IPost>) => void;
}

const PostsTabContents: FC<Props> = (props) => {
	const {
		onClickPostAction,
		onClickPostMessage,
		posts,
		needToSubscribe,
		subscription,
		onClickSubscribe,
		categories,
		onChangeFilter,
		filter,
		onClickUnlock,
		totalPostsCount,
		onClickComment,
		updatePostCallback,
	} = props;

	return (
		<View style={tw.style("pt-4")}>
			{/* <View style={tw.style("flex-row mb-4")}>
				<Button
					mode="text"
					labelStyle={tw.style(
						"text-[19px] text-fans-purple font-semibold leading-[26px] m-0",
					)}
					icon={() => (
						<InteractiveSvg
							width={21.71}
							height={23.24}
							style={tw.style("mr-3")}
						/>
					)}
					onPress={handleClickInteractive}
				>
					Interactive view
				</Button>
			</View> */}
			<View style={tw.style("px-[18px] md:px-0")}>
				<SubscribeAlert
					icon="post"
					hide={!needToSubscribe}
					text={`To view ${
						totalPostsCount ?? 0
					} posts, subscribe to this creator`}
					onSubscribe={onClickSubscribe}
				/>
			</View>

			<ScrollView
				horizontal
				contentContainerStyle={{
					paddingHorizontal: 18,
					columnGap: 7,
				}}
				showsHorizontalScrollIndicator={true}
				style={tw.style("mb-5", needToSubscribe && "hidden")}
			>
				<FilterButton
					title={SortType.Latest}
					selected={filter === SortType.Latest}
					onClick={() => onChangeFilter(SortType.Latest)}
				/>
				<FilterButton
					title={SortType.Popular}
					selected={filter === SortType.Popular}
					onClick={() => onChangeFilter(SortType.Popular)}
				/>
				{[...categories].map((category) => (
					<FilterButton
						title={category.name}
						selected={filter === category.id}
						onClick={() => onChangeFilter(category.id)}
						key={category.id}
					/>
				))}
			</ScrollView>

			<View
				style={tw.style(
					"flex-col gap-y-[18px]",
					needToSubscribe && "hidden",
				)}
			>
				{posts.map((post) => (
					<Fragment key={post.id}>
						<PostCard
							data={post}
							onClickUnlock={() => {
								if (onClickUnlock) {
									onClickUnlock(post);
								}
							}}
							onClickActionMenu={() => onClickPostAction(post.id)}
							onClickMessage={
								onClickPostMessage
									? () => onClickPostMessage(post.id)
									: undefined
							}
							onClickComment={() => onClickComment(post.id)}
							updatePostCallback={updatePostCallback}
						/>
						<FansDivider
							style={tw.style("my-2 mx-[18px] md:mx-0 md:my-2.5")}
							size={1}
						/>
					</Fragment>
				))}
			</View>
		</View>
	);
};

export default PostsTabContents;
