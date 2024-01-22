import {
	FilledHeartSvg,
	HeartSvg,
	TrashSvg,
	RoundedBorderSvg,
} from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import {
	FypNullableView,
	FypCollapsible,
	FypSvg,
} from "@components/common/base";
import { FansText, FansView, FansIconButton } from "@components/controls";
import tw from "@lib/tailwind";
import { IComment, IStoryReply } from "@usertypes/types";
import { getAgoTime } from "@utils/common";
import React, { FC, useState } from "react";
import { Pressable, TouchableOpacity } from "react-native";

interface Props {
	data: IComment | IStoryReply;
	children?: React.ReactNode;
	onClickReply: () => void;
	onClickLike: () => void;
	isChildren?: boolean;
	onDelete: (commentId: string) => void;
	userId: string;
}

const Comment: FC<Props> = (props) => {
	const {
		data,
		children,
		onClickReply,
		isChildren,
		onClickLike,
		onDelete,
		userId,
	} = props;
	const [hideReplies, setHideReplies] = useState(true);
	return (
		<FansView flexDirection="row">
			<FansView width={34} height={34} position="relative">
				<FypNullableView
					visible={
						"profile" in data &&
						(data.profile?.activeStories?.length ?? 0) > 0
					}
				>
					<RoundedBorderSvg
						size={38}
						style={tw.style("absolute top-[-2px] left-[-2px]")}
					/>
				</FypNullableView>

				<AvatarWithStatus avatar={data.user.avatar ?? ""} size={34} />
			</FansView>

			<FansView flex="1" margin={{ l: 12 }}>
				<FansView
					flexDirection="row"
					alignItems="center"
					margin={{ b: 5 }}
				>
					<FansView flexDirection="row" alignItems="center" gap={6}>
						<FansText
							fontSize={15}
							lineHeight={20}
							style={tw.style("font-semibold text-fans-purple")}
						>
							{data.user.username}
						</FansText>
						<FansView
							width={4}
							height={4}
							borderRadius={4}
							style={tw.style(
								"bg-fans-grey-70 dark:bg-fans-grey-b1",
							)}
						></FansView>
						<FansText
							fontSize={14}
							lineHeight={20}
							style={tw.style(
								"text-fans-grey-70 dark:text-fans-grey-b1",
							)}
						>
							{getAgoTime(data.updatedAt)}
						</FansText>
					</FansView>

					<FansView style={tw.style("ml-auto flex-row items-center")}>
						<FansText
							fontSize={14}
							lineHeight={20}
							style={tw.style(
								"mr-[6.6px] text-fans-grey-70 dark:text-fans-grey-b1",
							)}
						>
							{data.likeCount}
						</FansText>
						<TouchableOpacity
							onPress={() => {
								onClickLike();
							}}
						>
							{data.isLiked ? (
								<FilledHeartSvg
									width={15}
									height={15}
									color="#a854f5"
								/>
							) : (
								<FypSvg
									svg={HeartSvg}
									width={15}
									height={15}
									color="fans-grey-70 dark:fans-grey-b1"
								/>
							)}
						</TouchableOpacity>
					</FansView>
				</FansView>

				<FansText
					fontSize={16}
					lineHeight={21}
					style={tw.style(
						"mb-1 text-fans-black dark:text-fans-white",
					)}
				>
					{data.content}
				</FansText>
				<FypNullableView visible={!isChildren}>
					<FansView
						flexDirection="row"
						alignItems="center"
						position="relative"
					>
						<Pressable onPress={onClickReply}>
							<FansText
								fontSize={15}
								lineHeight={20}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								Reply
							</FansText>
						</Pressable>
						<Pressable
							style={tw.style(
								"flex-row items-center ml-3",
								data.replies.length === 0 && "hidden",
							)}
							onPress={() => setHideReplies(!hideReplies)}
						>
							<FansView
								width={4}
								height={4}
								borderRadius={4}
								style={tw.style(
									"bg-fans-grey-70 dark:bg-fans-grey-b1",
								)}
							></FansView>
							<FansText
								fontSize={15}
								lineHeight={24}
								style={tw.style(
									"ml-2 text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								{`${hideReplies ? "View" : "Hide"} ${
									data.replies.length
								} replies`}
							</FansText>
						</Pressable>
						<FypNullableView visible={data.userId === userId}>
							<FansIconButton
								onPress={() => onDelete(data.id)}
								backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
								size={34}
								style={tw.style(
									"absolute bottom-0 right-0",
									isChildren && "hidden",
								)}
							>
								<FypSvg
									svg={TrashSvg}
									width={15}
									height={15}
									color="fans-red-eb"
								/>
							</FansIconButton>
						</FypNullableView>
					</FansView>
				</FypNullableView>
				<FypNullableView
					visible={data.replies.length > 0 && !isChildren}
				>
					<FypCollapsible collapsed={hideReplies}>
						<FansView gap={8} margin={{ t: 16 }}>
							{children}
						</FansView>
					</FypCollapsible>
				</FypNullableView>
			</FansView>
		</FansView>
	);
};

export default Comment;
