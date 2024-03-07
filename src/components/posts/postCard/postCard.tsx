import {
	AddressSvg,
	ChevronRightSvg,
	StatisticsSvg,
	ShopSvg,
} from "@assets/svgs/common";
import {
	FypLinearGradientView,
	FypNullableView,
	FypSvg,
	FypText,
} from "@components/common/base";
import { FansDivider, FansView } from "@components/controls";
import {
	CommonActionType,
	PostsActionType,
	useAppContext,
} from "@context/useAppContext";
import {
	deleteBookmark,
	likePostWithPostId,
	setBookmark,
	unlikePostWithPostId,
} from "@helper/endpoints/post/apis";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
import { MediaType, PostType } from "@usertypes/commonEnums";
import { IPost } from "@usertypes/types";
import React, { FC, useState } from "react";
import AudioContent from "./audioContent";
import CardFooter from "./cardFooter";
import CardHeader from "./cardHeader";
import Fundraiser from "./fundraiser";
import FundraiserContent from "./fundraiserContent";
import Giveaway from "./giveaway";
import MediaContent from "./mediaContent";
import PaidPostLockView from "./paidPostLockView";
import Poll from "./poll";
import PollContent from "./pollContent";
import TextContent from "./textContent";

interface Props {
	data: IPost;
	onClickUnlock?: () => void;
	onClickActionMenu: () => void;
	onClickMessage?: () => void;
	onClickComment: () => void;
	shopCard?: boolean;
	updatePostCallback: (postId: string, data: Partial<IPost>) => void;
	onViewGraph?: (postId: string) => void;
	onViewPurchased?: (postId: string) => void;
}

const PostCard: FC<Props> = (props) => {
	const {
		data,
		onClickActionMenu,
		onClickMessage,
		onClickUnlock,
		onClickComment,
		shopCard,
		updatePostCallback,
		onViewGraph,
		onViewPurchased,
	} = props;
	const featureGates = useFeatureGates();
	const { dispatch } = useAppContext();

	const isUnpaidPost = data.isPaidPost && !data.isPaidOut;

	const [width, setWidth] = useState(0);

	const handleOpenMediaModal = (index: number) => {
		dispatch.setPosts({
			type: PostsActionType.updateMediaModal,
			data: {
				visible: true,
				mediaUrls: data.medias.map((m) => m.url ?? ""),
				mediaType:
					data.type === PostType.Video
						? MediaType.Video
						: MediaType.Image,
				avatar: data.profile?.avatar ?? "",
				displayName: data.profile?.displayName,
				index: index,
				watermark:
					props.data.profile.watermark === true
						? `fyp.fans/${props.data.profile.profileLink}`
						: undefined,
			},
		});
	};

	const onClickSendTip = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSendTipModal,
			data: {
				visible: true,
				creator: data.profile,
			},
		});
	};

	const handleBookmark = async () => {
		if (data.isBookmarked) {
			const resp = await deleteBookmark(null, { id: data.id });
			if (resp.ok) {
				updatePostCallback(data.id, {
					isBookmarked: resp.data.updatedPost.isBookmarked,
					bookmarkCount: resp.data.updatedPost.bookmarkCount,
				});
			}
		} else {
			const resp = await setBookmark(null, { id: data.id });
			if (resp.ok) {
				updatePostCallback(data.id, {
					isBookmarked: resp.data.updatedPost.isBookmarked,
					bookmarkCount: resp.data.updatedPost.bookmarkCount,
				});
			}
		}
	};

	const handleLikePost = async () => {
		if (data.isLiked) {
			const resp = await unlikePostWithPostId(null, {
				id: data.id,
			});
			if (resp.ok) {
				updatePostCallback(data.id, {
					likeCount: resp.data.likeCount,
					isLiked: resp.data.isLiked,
				});
			}
		} else {
			const resp = await likePostWithPostId(null, {
				id: data.id,
			});
			if (resp.ok) {
				updatePostCallback(data.id, {
					likeCount: resp.data.likeCount,
					isLiked: resp.data.isLiked,
				});
			}
		}
	};

	const onPressViewGraph = () => {
		if (onViewGraph) {
			onViewGraph(data.id);
		}
	};

	const onPressViewPurchased = () => {
		if (onViewPurchased) {
			onViewPurchased(data.id);
		}
	};

	return (
		<FansView
			padding={{ t: 12 }}
			style={tw.style(
				data.isExclusive &&
					"border border-fans-purple rounded-[15px] pb-4 px-[14px]",
			)}
		>
			<CardHeader data={data} handlePressDots={onClickActionMenu} />

			<FansView
				style={tw.style(
					"px-[18px] pt-[10px] pb-2 md:px-0",
					data.type === PostType.Text && "hidden",
				)}
			>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{data.caption}
					<FypText
						fontWeight={600}
						color="purple"
						style={tw.style(
							!data.advanced?.isPaidLabelDisclaimer && "hidden",
						)}
					>
						&nbsp;#Ad
					</FypText>
				</FypText>
			</FansView>

			<FypNullableView
				visible={
					!!shopCard && featureGates.has("2024_02-shop-analytics")
				}
			>
				<FansView
					style={tw.style("px-[18px] md:px-0")}
					margin={{ b: 20 }}
				>
					<FansView
						borderRadius={15}
						padding={{ y: 12, x: 15 }}
						flexDirection="row"
						flexWrap="wrap"
						alignItems="center"
						justifyContent="between"
						style={tw.style(
							"border border-fans-grey-f0 dark:border-fans-grey-43 gap-y-3",
						)}
					>
						<FansView
							flexDirection="row"
							alignItems="center"
							style={tw.style(
								tw.prefixMatch("md")
									? "gap-6"
									: "w-full justify-between",
							)}
						>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								style={tw.style(
									"text-fans-black dark:text-fans-white",
								)}
							>
								Total money made
							</FypText>

							<FypLinearGradientView
								colors={["#24A2FF", "#23C9B1", "#89F276"]}
								start={[0, 1]}
								end={[1, 0]}
								padding={{ y: 4, x: 12 }}
								borderRadius={26}
								style={tw.style("min-w-[55px]")}
							>
								<FypText
									fontSize={14}
									fontWeight={600}
									lineHeight={19}
									style={tw.style("text-fans-white")}
								>
									{`$${data.paidPost?.price}`}
								</FypText>
							</FypLinearGradientView>
						</FansView>

						<FansDivider
							style={tw.style(
								"bg-fans-grey-f0 dark:bg-fans-grey-43 md:hidden w-full",
							)}
						/>

						<FansView
							alignItems="center"
							flexDirection="row"
							justifyContent="between"
							style={tw.style(
								tw.prefixMatch("md") ? "gap-[30px]" : "w-full",
							)}
						>
							<FansView
								flexDirection="row"
								alignItems="center"
								gap={13}
								pressableProps={{
									onPress: onPressViewGraph,
								}}
							>
								<FypSvg
									svg={StatisticsSvg}
									width={15}
									height={15}
									color="fans-grey-48 dark:fans-grey-b1"
								/>
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={600}
									style={tw.style(
										"text-fans-grey-48 dark:text-fans-grey-b1",
									)}
								>
									View graph
								</FypText>
								<FypSvg
									svg={ChevronRightSvg}
									width={9}
									height={15}
									color="fans-grey-48 dark:fans-grey-b1"
								/>
							</FansView>

							<FansView
								flexDirection="row"
								alignItems="center"
								gap={13}
								pressableProps={{
									onPress: onPressViewPurchased,
								}}
							>
								<FypSvg
									svg={ShopSvg}
									width={10}
									height={14}
									color="fans-grey-48 dark:fans-grey-b1"
								/>
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={600}
									style={tw.style(
										"text-fans-grey-48 dark:text-fans-grey-b1",
									)}
								>
									View purchased
								</FypText>
								<FypSvg
									svg={ChevronRightSvg}
									width={9}
									height={15}
									color="fans-grey-48 dark:fans-grey-b1"
								/>
							</FansView>
						</FansView>
					</FansView>
				</FansView>
			</FypNullableView>

			{featureGates.has("2023_12-fundraiser-post-card") &&
				data.fundraiser && <Fundraiser data={data} />}
			{data.poll && (
				<Poll data={data} handleUpdatePost={updatePostCallback} />
			)}
			{featureGates.has("2023_12-giveaway-post-card") &&
				data.giveaway && <Giveaway data={data} />}

			<FypNullableView visible={!!data.location}>
				<FansView
					flexDirection="row"
					alignItems="center"
					gap={8}
					margin={{ b: 12 }}
					style={tw.style("px-[18px] md:px-0")}
				>
					<FypSvg
						svg={AddressSvg}
						width={13}
						height={15}
						color="fans-grey-70 dark:fans-grey-b1"
					/>
					<FypText
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							"text-fans-grey-70 dark:text-fans-grey-b1 flex-1",
						)}
						numberOfLines={1}
					>
						{data.location}
					</FypText>
				</FansView>
			</FypNullableView>

			<FansView
				position="relative"
				onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
				style={tw.style(
					isUnpaidPost && !data.isSelf ? `min-h-[${width}px]` : "",
				)}
			>
				<FypNullableView visible={!isUnpaidPost || data.isSelf}>
					{(data.type === PostType.Media ||
						data.type === PostType.Photo ||
						data.type === PostType.Video) && (
						<MediaContent data={data} />
					)}
				</FypNullableView>

				{data.type === PostType.Audio && <AudioContent data={data} />}
				{data.type === PostType.Fundraiser && (
					<FundraiserContent data={data} />
				)}
				{data.type === PostType.Poll && <PollContent data={data} />}
				{data.type === PostType.Text && <TextContent data={data} />}
				<PaidPostLockView
					isUnpaidPost={isUnpaidPost}
					post={data}
					showPaidPostText={data.isPaidPost}
				/>
			</FansView>

			<CardFooter
				data={data}
				onClickBookmark={handleBookmark}
				onClickComment={onClickComment}
				onClickSendTip={onClickSendTip}
				onClickMessage={onClickMessage}
				onClickLike={handleLikePost}
				onClickUnlock={onClickUnlock}
			/>
		</FansView>
	);
};

export default PostCard;
