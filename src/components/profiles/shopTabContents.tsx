import {
	PlaySvg,
	PlusSvg,
	PushNotificationSvg,
	SortAscSvg,
	SortDescSvg,
	StarCheckSvg,
} from "@assets/svgs/common";
import { FypSvg, FypSwitch, FypText } from "@components/common/base";
import { FansDivider, FansView } from "@components/controls";
import PostCard from "@components/posts/postCard";
import { defaultPostFormData } from "@constants/defaultFormData";
import { PostsActionType, useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { PostStepTypes, PostType } from "@usertypes/commonEnums";
import { IPost } from "@usertypes/types";
import useDocumentPicker from "@utils/useDocumentPicker";
import { useRouter } from "expo-router";
import React, { FC, useState } from "react";
import Animated, { PinwheelIn, PinwheelOut } from "react-native-reanimated";
import Toast from "react-native-toast-message";

interface DescriptionItemProps {
	title: string;
	description: string;
	icon: React.ReactNode;
}

export const DescriptionItem: FC<DescriptionItemProps> = (props) => {
	const { title, description, icon } = props;
	return (
		<FansView position="relative" padding={{ l: 40 }}>
			<FansView position="absolute" top={0} left={0}>
				{icon}
			</FansView>
			<FansView>
				<FypText
					fontSize={17}
					lineHeight={24}
					fontWeight={600}
					margin={{ b: 12 }}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{title}
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{description}
				</FypText>
			</FansView>
		</FansView>
	);
};

export const StartSellingContents = () => {
	const handlePressAdd = () => {};
	return (
		<FansView style={tw.style("py-[22px] md:py-10 px-[18px]")}>
			<FypText
				fontSize={27}
				lineHeight={36}
				fontWeight={600}
				textAlign="center"
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				Start selling digital products
			</FypText>
			<FansView
				style={tw.style("mt-6 md:mt-9 mb-[52px] md:mb-[42px]")}
				gap={24}
			>
				<DescriptionItem
					title="Offer digital content to fans"
					description="Sell videos, sound clips, digital documents, pictures, and beyond"
					icon={
						<FypSvg
							width={17}
							height={19}
							svg={PlaySvg}
							color="fans-purple"
						/>
					}
				/>
				<DescriptionItem
					title="Establish your store in no time"
					description="Create a post, and click on the paid post option to add it to your shop"
					icon={
						<FypSvg
							width={18}
							height={25}
							svg={PushNotificationSvg}
							color="fans-purple"
						/>
					}
				/>
				<DescriptionItem
					title="Effortless purchase and usage"
					description="Customers can view, stream, or retrieve their purchases on their devices at any time"
					icon={<StarCheckSvg width={22} height={21} />}
				/>
			</FansView>
			<FansView
				height={42}
				borderRadius={42}
				flexDirection="row"
				alignItems="center"
				justifyContent="center"
				style={tw.style("border border-fans-purple")}
				gap={10}
				pressableProps={{
					onPress: handlePressAdd,
				}}
			>
				<FypSvg
					svg={PlusSvg}
					width={13}
					height={13}
					color="fans-purple"
				/>
				<FypText
					fontSize={19}
					fontWeight={700}
					lineHeight={19}
					style={tw.style("text-fans-purple")}
				>
					Add paid post
				</FypText>
			</FansView>
		</FansView>
	);
};

interface ShopContentsProps {
	posts: IPost[];
	onPressPostMenu: (postId: string) => void;
	onPressAddNew: () => void;
	onClickBookmark: (postId: string) => void;
	onClickPostLike: (postId: string) => void;
	onClickComment: (postId: string) => void;
	onClickPostMessage?: (postId: string) => void;
}

export const ShopContents: FC<ShopContentsProps> = (props) => {
	const {
		posts,
		onPressPostMenu,
		onPressAddNew,
		onClickBookmark,
		onClickPostLike,
		onClickComment,
		onClickPostMessage,
	} = props;
	const [displayShop, setDisplayShop] = useState(true);
	const [orderBy, setOrderBy] = useState("newest");

	return (
		<FansView style={tw.style("py-[22px] md:py-10")}>
			<FansView
				padding={{ x: 18, b: 24 }}
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
			>
				<FypText
					fontSize={18}
					lineHeight={24}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Display your Shop
				</FypText>
				<FypSwitch
					value={displayShop}
					onValueChange={(val) => setDisplayShop(val)}
				/>
			</FansView>
			<FansView padding={{ x: 18, b: 12 }}>
				<FansDivider />
				<FansView
					padding={{ t: 22, b: 25 }}
					flexDirection="row"
					alignItems="center"
					gap={13.2}
					pressableProps={{
						onPress: () =>
							setOrderBy(
								orderBy === "newest" ? "oldest" : "newest",
							),
					}}
				>
					<FypSvg
						width={16.76}
						height={14.05}
						svg={orderBy === "oldest" ? SortAscSvg : SortDescSvg}
						color="fans-grey-70 dark:fans-grey-b1"
					/>
					<Animated.View entering={PinwheelIn} exiting={PinwheelOut}>
						<FypText
							fontWeight={500}
							fontSize={17}
							style={tw.style(
								"text-fans-grey-70 dark:text-fans-grey-b1",
							)}
						>
							{orderBy === "newest"
								? "Newest first"
								: "Oldest first"}
						</FypText>
					</Animated.View>
				</FansView>
				<FansView
					height={42}
					borderRadius={42}
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					style={tw.style("border border-fans-purple")}
					gap={10}
					pressableProps={{
						onPress: onPressAddNew,
					}}
				>
					<FypSvg
						svg={PlusSvg}
						width={13}
						height={13}
						color="fans-purple"
					/>
					<FypText
						fontSize={19}
						fontWeight={700}
						lineHeight={19}
						style={tw.style("text-fans-purple")}
					>
						Add new
					</FypText>
				</FansView>
			</FansView>
			<FansView gap={18}>
				{posts.map((post) => (
					<PostCard
						key={post.id}
						data={post}
						shopCard
						onClickUnlock={() => {}}
						onClickBookmark={() => onClickBookmark(post.id)}
						onClickLike={() => onClickPostLike(post.id)}
						onClickActionMenu={() => onPressPostMenu(post.id)}
						onClickMessage={
							onClickPostMessage
								? () => onClickPostMessage(post.id)
								: undefined
						}
						onClickComment={() => onClickComment(post.id)}
					/>
				))}
			</FansView>
		</FansView>
	);
};

interface ShopTabContentsProps {
	posts: IPost[];
	onPressPostMenu: (postId: string) => void;
	onClickBookmark: (postId: string) => void;
	onClickPostLike: (postId: string) => void;
	onClickComment: (postId: string) => void;
	onClickPostMessage?: (postId: string) => void;
}

const ShopTabContents: FC<ShopTabContentsProps> = (props) => {
	const {
		posts,
		onPressPostMenu,
		onClickBookmark,
		onClickPostLike,
		onClickComment,
		onClickPostMessage,
	} = props;
	const router = useRouter();
	const { dispatch } = useAppContext();
	const { useImagePicker } = useDocumentPicker();

	const handleOpenImagePicker = async () => {
		const result = await useImagePicker();
		if (result.ok) {
			const medias = result.data;
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					...defaultPostFormData,
					type: PostType.Photo,
					medias: medias,
					secondStep: PostStepTypes.PaidPost,
					thumb:
						medias.length > 0
							? medias[0]
							: defaultPostFormData.thumb,
				},
			});
			router.push({
				pathname: "posts",
				params: { screen: "Thumbnail" },
			});
		} else {
			Toast.show({
				type: "error",
				text1: result?.message ?? "",
			});
		}
	};

	const handleAddNewPaidPost = async () => {
		if (tw.prefixMatch("md")) {
			dispatch.setPosts({
				type: PostsActionType.updatePostForm,
				data: {
					type: PostType.Photo,
					secondStep: PostStepTypes.PaidPost,
				},
			});
			dispatch.setPosts({
				type: PostsActionType.updatePostModal,
				data: {
					visible: true,
					step: PostStepTypes.Thumbnail,
				},
			});
		} else {
			handleOpenImagePicker();
		}
	};

	return (
		<FansView>
			{posts.length === 0 ? (
				<StartSellingContents />
			) : (
				<ShopContents
					posts={posts}
					onPressPostMenu={onPressPostMenu}
					onPressAddNew={handleAddNewPaidPost}
					onClickBookmark={onClickBookmark}
					onClickPostLike={onClickPostLike}
					onClickComment={onClickComment}
					onClickPostMessage={onClickPostMessage}
				/>
			)}
		</FansView>
	);
};

export default ShopTabContents;
