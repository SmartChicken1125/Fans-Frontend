import {
	ArchivedPostSvg,
	CommentSvg,
	CopyLinkSvg,
	EditSvg,
	HeartSvg,
	HideLikeSvg,
	ImageSvg,
	OutlinedPinSvg,
	TrashSvg,
	TurnOffCommentSvg,
} from "@assets/svgs/common";
import { FypSvg, FypText } from "@components/common/base";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import { FansDivider, FansIconButton } from "@components/controls";
import { MenuItem } from "@components/posts/common";
import {
	deletePostById,
	pinPostById,
	unpinPostById,
	updatePostArchive,
	updatePostById,
} from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
import { IPost, IPostAdvanced } from "@usertypes/types";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import { useRouter } from "expo-router";
import React, { FC } from "react";
import { View } from "react-native";

interface FunctionButtonProps {
	title: string;
	icon: React.ReactNode;
	onPress?: () => void;
}

export const FunctionButton: FC<FunctionButtonProps> = (props) => {
	const { title, icon, onPress } = props;

	return (
		<View style={tw.style("items-center w-[75px]")}>
			<FansIconButton
				size={46}
				backgroundColor="bg-fans-purple"
				onPress={onPress}
			>
				{icon}
			</FansIconButton>
			<FypText
				fontSize={16}
				fontWeight={400}
				margin={{ t: 8 }}
				lineHeight={21}
				style={tw.style("text-fans-black dark:text-fans-white")}
			>
				{title}
			</FypText>
		</View>
	);
};

interface Props {
	open: boolean;
	onClose: () => void;
	post?: IPost;
	onTrashCallback: () => void;
	onPostAdvancedCallback: (advanced: IPostAdvanced) => void;
	onPinCallback: (post: IPost) => void;
	onArchivePostCallback: () => void;
	onEditPostCallback: () => void;
}

const ProfilePostActions: FC<Props> = (props) => {
	const {
		open,
		onClose,
		post,
		onTrashCallback,
		onPostAdvancedCallback,
		onPinCallback,
		onArchivePostCallback,
		onEditPostCallback,
	} = props;

	const router = useRouter();
	const { copyString } = useClipboard();
	const featureGates = useFeatureGates();

	const onCopyPostLink = async () => {
		const url = createURL(`p/${post?.id}`);
		await copyString(url);
		onClose();
	};

	const onClickHideLikeCount = async () => {
		if (post?.advanced) {
			const advanced = {
				...post.advanced,
				isHideLikeViewCount: !post.advanced.isHideLikeViewCount,
			};
			const resp = await updatePostById(
				{ advanced: advanced },
				{
					id: post.id,
				},
			);
			if (resp.ok) {
				onPostAdvancedCallback(advanced);
			}
		}
		onClose();
	};

	const onClickTurnOffComment = async () => {
		if (post?.advanced) {
			const advanced = {
				...post.advanced,
				isTurnOffComment: !post.advanced.isTurnOffComment,
			};
			const resp = await updatePostById(
				{ advanced: advanced },
				{
					id: post.id,
				},
			);
			if (resp.ok) {
				onPostAdvancedCallback(advanced);
			}
		}
		onClose();
	};

	const onPressPin = async () => {
		if (!post) {
			return;
		}
		if (post.isPinned) {
			const resp = await unpinPostById(null, { id: post.id });
			if (resp.ok) {
				onPinCallback(resp.data);
			}
		} else {
			const resp = await pinPostById(null, { id: post.id });
			if (resp.ok) {
				onPinCallback(resp.data);
			}
		}
	};

	const onClickGoToPost = () => {
		onClose();
		if (post) router.push(`/p/${post?.id}`);
	};

	const onClickArchivePost = async () => {
		if (post) {
			const resp = await updatePostArchive({
				id: post.id,
			});
			if (resp.ok) {
				onArchivePostCallback();
			}
		}
		onClose();
	};

	const onClickTrash = async () => {
		if (post) {
			const resp = await deletePostById({ id: post.id }, { id: post.id });
			if (resp.ok) {
				onTrashCallback();
			}
		}
		onClose();
	};

	return (
		<BottomSheetWrapper
			open={open}
			onClose={() => {
				onClose();
			}}
		>
			<View style={tw.style("pt-[50px]")}>
				<View
					style={tw.style(
						"flex-row justify-center pb-5 gap-4 mx-auto",
					)}
				>
					<FunctionButton
						title="Edit"
						icon={<EditSvg color="#fff" size={22} />}
						onPress={onEditPostCallback}
					/>
					<FunctionButton
						title={post?.isPinned ? "Unpin" : "Pin"}
						icon={
							<FypSvg
								svg={OutlinedPinSvg}
								width={22}
								height={22}
								color="fans-white"
							/>
						}
						onPress={onPressPin}
					/>
					<FunctionButton
						title="Copy link"
						icon={
							<FypSvg
								svg={CopyLinkSvg}
								width={24.4}
								height={24.4}
								color="fans-white"
							/>
						}
						onPress={onCopyPostLink}
					/>
				</View>

				<FansDivider />

				<View>
					<MenuItem
						title={`${
							post?.advanced?.isHideLikeViewCount
								? "Show"
								: "Hide"
						} like count`}
						icon={
							post?.advanced?.isHideLikeViewCount ? (
								<FypSvg
									svg={HeartSvg}
									width={24}
									height={22.73}
									color="fans-black dark:fans-white"
								/>
							) : (
								<FypSvg
									svg={HideLikeSvg}
									width={24}
									height={22.73}
									color="fans-black dark:fans-white"
								/>
							)
						}
						onPress={onClickHideLikeCount}
					/>
					<MenuItem
						title={
							post?.advanced?.isTurnOffComment
								? "Turn on commenting"
								: "Turn off commenting"
						}
						icon={
							post?.advanced?.isTurnOffComment ? (
								<FypSvg
									svg={CommentSvg}
									width={23}
									height={23}
									color="fans-black dark:fans-white"
								/>
							) : (
								<FypSvg
									svg={TurnOffCommentSvg}
									width={23}
									height={23}
									color="fans-black dark:fans-white"
								/>
							)
						}
						onPress={onClickTurnOffComment}
					/>
					<MenuItem
						title="Go to post"
						icon={
							<FypSvg
								svg={ImageSvg}
								width={21.6}
								height={21.6}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={onClickGoToPost}
					/>

					<MenuItem
						title={
							post?.isArchived ? "Unarchive post" : "Archive post"
						}
						icon={
							<FypSvg
								svg={ArchivedPostSvg}
								width={23}
								height={23}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={onClickArchivePost}
					/>

					{/* <MenuItem
						title="Embed"
						icon={<CopyLinkSvg width={24.39} height={24.41} />}
						onPress={() => {}}
					/> */}

					<MenuItem
						title="Delete"
						icon={
							<TrashSvg
								width={18.5}
								height={23}
								color="#eb2121"
							/>
						}
						labelClass="text-fans-red"
						onPress={onClickTrash}
					/>
				</View>
			</View>
		</BottomSheetWrapper>
	);
};

export default ProfilePostActions;
