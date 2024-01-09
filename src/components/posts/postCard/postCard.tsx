import { LockSvg, AddressSvg, ImageSvg, RecordSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypText, FypNullableView, FypSvg } from "@components/common/base";
import { FansView, FansDivider } from "@components/controls";
import {
	CommonActionType,
	PostsActionType,
	useAppContext,
} from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
import { MediaType, PostType } from "@usertypes/commonEnums";
import { IPost } from "@usertypes/types";
import { Image as ExpoImage } from "expo-image";
import React, { FC } from "react";
import AudioContent from "./audioContent";
import CardFooter from "./cardFooter";
import CardHeader from "./cardHeader";
import Fundraiser from "./fundraiser";
import FundraiserContent from "./fundraiserContent";
import Giveaway from "./giveaway";
import ImageContent from "./imageContent";
import Poll from "./poll";
import PollContent from "./pollContent";
import TextContent from "./textContent";
import VideoContent from "./videoContent";

interface Props {
	data: IPost;
	onClickUnlock?: () => void;
	onClickLike: () => void;
	onClickBookmark: () => void;
	onClickActionMenu: () => void;
	onClickMessage?: () => void;
	onClickComment: () => void;
	shopCard?: boolean;
	purchaseCard?: boolean;
}

const PostCard: FC<Props> = (props) => {
	const {
		data,
		onClickBookmark,
		onClickLike,
		onClickActionMenu,
		onClickMessage,
		onClickUnlock,
		onClickComment,
		shopCard,
		purchaseCard,
	} = props;
	const featureGates = useFeatureGates();
	const { dispatch } = useAppContext();

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

			{featureGates.has("2023_12-fundraiser-post-card") &&
				data.fundraiser && <Fundraiser data={data} />}
			{featureGates.has("2023_12-poll-post-card") && data.poll && (
				<Poll data={data} />
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

			<FansView position="relative">
				{data.type === PostType.Video && <VideoContent data={data} />}
				{data.type === PostType.Photo && (
					<ImageContent
						data={data}
						onClickMedia={handleOpenMediaModal}
					/>
				)}
				{data.type === PostType.Audio && <AudioContent data={data} />}
				{data.type === PostType.Fundraiser && (
					<FundraiserContent data={data} />
				)}
				{data.type === PostType.Poll && <PollContent data={data} />}
				{data.type === PostType.Text && <TextContent data={data} />}
				<FypNullableView visible={data.isPaidPost && !data.isPaidOut}>
					<FansView
						position="absolute"
						width="full"
						height="full"
						top={0}
						left={0}
						background={
							!data.paidPost?.thumb && !data.isSelf
								? `bg-fans-grey-70/50 dark:bg-fans-grey-b1/50`
								: ""
						}
					>
						<FypNullableView
							visible={!!data.paidPost?.thumb && !data.isSelf}
						>
							<ExpoImage
								source={cdnURL(data.paidPost?.thumb?.url)}
								style={tw.style("w-full h-full")}
								pointerEvents="none"
							/>
						</FypNullableView>

						<FansView
							width={84}
							height={84}
							borderRadius={84}
							backgroundColor={{
								color: "white",
								opacity: 50,
							}}
							flexDirection="row"
							alignItems="center"
							justifyContent="center"
							position="absolute"
							style={[
								tw.style("top-1/2 left-1/2"),
								{
									transform: [
										{ translateX: -42 },
										{ translateY: -42 },
									],
								},
							]}
						>
							<FypSvg
								width={34.32}
								height={45}
								svg={LockSvg}
								color="fans-white dark:fans-black"
							/>
						</FansView>
					</FansView>
					<FansView
						position="absolute"
						width="full"
						padding={{ x: 18 }}
						bottom={16}
					>
						<RoundButton onPress={onClickUnlock}>
							<FypSvg
								width={15}
								height={15}
								svg={LockSvg}
								color="fans-white"
								style={tw.style("mr-2")}
							/>
							{`Unlock for $${data.paidPost?.price ?? 0}`}
						</RoundButton>
					</FansView>
				</FypNullableView>
			</FansView>

			<FypNullableView visible={!!shopCard}>
				<FansView
					padding={{ y: 12 }}
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					style={tw.style("px-[18px] md:px-0")}
				>
					<FansView flexDirection="row" alignItems="center" gap={7}>
						<FypText
							fontSize={14}
							lineHeight={19}
							fontWeight={700}
							style={tw.style(
								"text-fans-black dark:text-fans-white",
							)}
						>
							{`$${data.paidPost?.price}`}
						</FypText>
						<FypSvg
							width={8}
							height={10.3}
							svg={LockSvg}
							color="fans-black dark:fans-white"
						/>
					</FansView>
					<FansView flexDirection="row" alignItems="center" gap={14}>
						<FansView
							flexDirection="row"
							alignItems="center"
							gap={7}
						>
							<FypSvg
								svg={ImageSvg}
								width={11}
								height={11}
								color="fans-grey-70 dark:fans-grey-b1"
							/>
							<FypText
								fontSize={14}
								fontWeight={500}
								lineHeight={19}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								{data.medias.length}
							</FypText>
						</FansView>
						<FansView
							flexDirection="row"
							alignItems="center"
							gap={7}
							style={tw.style(
								data.type !== PostType.Video && "hidden",
							)}
						>
							<FypSvg
								svg={RecordSvg}
								width={16}
								height={10}
								color="fans-grey-70 dark:fans-grey-b1"
							/>
							<FypText
								fontSize={14}
								fontWeight={500}
								lineHeight={19}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								5:15
							</FypText>
						</FansView>
					</FansView>
				</FansView>
				<FansDivider style={tw.style("mx-[18px] md:mx-0")} />
			</FypNullableView>

			<FypNullableView visible={!!purchaseCard}>
				<FansView
					padding={{ y: 12 }}
					flexDirection="row"
					alignItems="center"
					justifyContent="between"
					style={tw.style("px-[18px] md:px-0")}
				>
					<FansView flexDirection="row" alignItems="center" gap={14}>
						<FansView
							flexDirection="row"
							alignItems="center"
							gap={7}
						>
							<FypSvg
								svg={ImageSvg}
								width={11}
								height={11}
								color="fans-grey-70 dark:fans-grey-b1"
							/>
							<FypText
								fontSize={14}
								fontWeight={500}
								lineHeight={19}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								3
							</FypText>
						</FansView>
						<FansView
							flexDirection="row"
							alignItems="center"
							gap={7}
						>
							<FypSvg
								svg={RecordSvg}
								width={16}
								height={10}
								color="fans-grey-70 dark:fans-grey-b1"
							/>
							<FypText
								fontSize={14}
								fontWeight={500}
								lineHeight={19}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								5:15
							</FypText>
						</FansView>
					</FansView>
					<FansView flexDirection="row" alignItems="center" gap={7}>
						<FypText
							fontSize={14}
							lineHeight={19}
							fontWeight={700}
							style={tw.style(
								"text-fans-grey-70 dark:text-fans-grey-b1",
							)}
						>
							Unlocked for $15
						</FypText>
						<FypSvg
							width={8}
							height={10.3}
							svg={LockSvg}
							color="fans-grey-70 dark:fans-grey-b1"
						/>
					</FansView>
				</FansView>
				<FansDivider style={tw.style("mx-[18px] md:mx-0")} />
			</FypNullableView>

			<CardFooter
				data={data}
				onClickBookmark={onClickBookmark}
				onClickComment={onClickComment}
				onClickSendTip={onClickSendTip}
				onClickMessage={onClickMessage}
				onClickLike={onClickLike}
			/>
		</FansView>
	);
};

export default PostCard;
