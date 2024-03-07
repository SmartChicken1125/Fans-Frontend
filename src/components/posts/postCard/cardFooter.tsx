import {
	BookmarkSvg,
	CommentSvg,
	FilledBookmarkSvg,
	FilledHeartSvg,
	HeartSvg,
	PostMailSvg,
	RoundedTipSvg,
	ImageSvg,
	RecordSvg,
	LockSvg,
} from "@assets/svgs/common";
import {
	FypNullableView,
	FypSvg,
	FypText,
	FypLinearGradientView,
} from "@components/common/base";
import { FansDivider, FansView } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { MediaType, PostType } from "@usertypes/commonEnums";
import { IPost } from "@usertypes/types";
import { getAgoTime } from "@utils/common";
import { convertTrackingTime } from "@utils/stringHelper";
import React, { FC } from "react";

interface Props {
	data: IPost;
	onClickLike: () => void;
	onClickBookmark: () => void;
	onClickComment: () => void;
	onClickMessage?: () => void;
	onClickSendTip: () => void;
	onClickUnlock?: () => void;
}

const CardFooter: FC<Props> = (props) => {
	const {
		data,
		onClickLike,
		onClickComment,
		onClickBookmark,
		onClickMessage,
		onClickSendTip,
		onClickUnlock,
	} = props;

	const { state } = useAppContext();
	const { profile } = state;
	const { hideTips, hideComments } = profile;

	return (
		<FansView
			style={tw.style("px-[18px] md:px-0", data.isExclusive && "px-0")}
		>
			<FypNullableView visible={data.isPaidPost}>
				<FansView padding={{ t: 14, b: 18 }} gap={16}>
					<FansView
						flexDirection="row"
						alignItems="center"
						justifyContent="between"
						style={tw.style("px-[18px] md:px-0")}
					>
						<FansView
							flexDirection="row"
							alignItems="center"
							gap={14}
						>
							<FypNullableView
								visible={
									data.medias.filter(
										(el) => el.type === MediaType.Image,
									).length > 0
								}
							>
								<FansView
									flexDirection="row"
									alignItems="center"
									gap={7}
								>
									<FypSvg
										svg={ImageSvg}
										width={14}
										height={14}
										color="fans-grey-48 dark:fans-grey-b1"
									/>
									<FypText
										fontSize={17}
										fontWeight={500}
										lineHeight={22}
										style={tw.style(
											"text-fans-grey-48 dark:text-fans-grey-b1",
										)}
									>
										{data.imageCount}
									</FypText>
								</FansView>
							</FypNullableView>

							<FypNullableView
								visible={
									data.medias.filter(
										(el) => el.type === MediaType.Video,
									).length > 0
								}
							>
								<FansView
									flexDirection="row"
									alignItems="center"
									gap={7}
								>
									<FypSvg
										svg={RecordSvg}
										width={19}
										height={12}
										color="fans-grey-48 dark:fans-grey-b1"
									/>
									<FypText
										fontSize={17}
										fontWeight={500}
										lineHeight={22}
										style={tw.style(
											"text-fans-grey-48 dark:text-fans-grey-b1",
										)}
									>
										{convertTrackingTime(data.videoLength)}
									</FypText>
								</FansView>
							</FypNullableView>
						</FansView>

						<FansView
							flexDirection="row"
							alignItems="center"
							gap={7}
						>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={500}
								style={tw.style(
									"text-fans-grey-48 dark:text-fans-grey-b1",
								)}
							>
								{data.isPaidOut
									? `Unlocked for $${data.paidPost?.price}`
									: `$${data.paidPost?.price}`}
							</FypText>
							<FypSvg
								width={10}
								height={13}
								svg={LockSvg}
								color="fans-grey-48 dark:fans-grey-b1"
							/>
						</FansView>
					</FansView>

					<FypNullableView visible={!data.isPaidOut && !data.isSelf}>
						<FansView
							height={42}
							pressableProps={{
								onPress: onClickUnlock,
							}}
						>
							<FypLinearGradientView
								colors={["#1D21E5", "#A854F5", "#D885FF"]}
								start={[0, 1]}
								end={[1, 0]}
								height={42}
								borderRadius={42}
								alignItems="center"
								justifyContent="center"
							>
								<FypText
									fontSize={19}
									fontWeight={700}
									lineHeight={26}
									style={tw.style("text-fans-white")}
								>
									{`Unlock for $${data.paidPost?.price}`}
								</FypText>
							</FypLinearGradientView>
						</FansView>
					</FypNullableView>
				</FansView>
				<FansDivider
					style={tw.style("bg-fans-grey-f0 dark:bg-fans-grey-43")}
				/>
			</FypNullableView>

			<FansView
				padding={{ t: 14 }}
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
			>
				<FansView flexDirection="row" alignItems="center" gap={18}>
					<FansView
						touchableOpacityProps={{
							onPress: onClickLike,
						}}
						flexDirection="row"
						alignItems="center"
					>
						{data.isLiked ? (
							<FypSvg
								svg={FilledHeartSvg}
								width={21.5}
								height={19}
								color="fans-red-eb"
							/>
						) : (
							<FypSvg
								svg={HeartSvg}
								width={21.5}
								height={19}
								color="fans-black dark:fans-white"
							/>
						)}
						<FypNullableView
							visible={!data.advanced?.isHideLikeViewCount}
						>
							<FypText
								fontSize={13}
								lineHeight={17}
								fontWeight={700}
								margin={{ l: 6 }}
								style={tw.style(
									"text-fans-black dark:text-fans-white",
								)}
							>
								{data.likeCount}
							</FypText>
						</FypNullableView>
					</FansView>

					{!hideComments && (
						<FypNullableView
							visible={!data.advanced?.isTurnOffComment}
						>
							<FansView
								touchableOpacityProps={{
									onPress: onClickComment,
								}}
								flexDirection="row"
								alignItems="center"
							>
								<FypSvg
									svg={CommentSvg}
									width={21.3}
									height={21.3}
									color="fans-black dark:fans-white"
								/>
								<FypText
									fontSize={13}
									lineHeight={17}
									fontWeight={700}
									margin={{ l: 6 }}
									style={tw.style(
										"text-fans-black dark:text-fans-white",
									)}
								>
									{data.commentCount}
								</FypText>
							</FansView>
						</FypNullableView>
					)}

					<FypNullableView visible={data.type !== PostType.Text}>
						<FansView
							touchableOpacityProps={{
								onPress: onClickBookmark,
							}}
							flexDirection="row"
							alignItems="center"
						>
							{data.isBookmarked ? (
								<FypSvg
									svg={FilledBookmarkSvg}
									width={22}
									height={22}
									color="fans-yellow"
								/>
							) : (
								<FypSvg
									svg={BookmarkSvg}
									width={22}
									height={22}
									color="fans-black dark:fans-white"
								/>
							)}
							<FypText
								fontSize={13}
								lineHeight={17}
								fontWeight={700}
								margin={{ l: 6 }}
								style={tw.style(
									"text-fans-black dark:text-fans-white",
								)}
							>
								{data.bookmarkCount}
							</FypText>
						</FansView>
					</FypNullableView>

					<FypNullableView visible={!!onClickMessage}>
						<FansView
							pressableProps={{
								onPress: onClickMessage,
							}}
							flexDirection="row"
							alignItems="center"
						>
							<FypSvg
								svg={PostMailSvg}
								width={24}
								height={19}
								color="fans-black dark:fans-white"
							/>
						</FansView>
					</FypNullableView>
				</FansView>

				{!hideTips && (
					<FansView
						touchableOpacityProps={{
							onPress: onClickSendTip,
						}}
						flexDirection="row"
						alignItems="center"
					>
						<FypText
							fontSize={14}
							lineHeight={19}
							fontWeight={600}
							margin={{ r: 8 }}
							style={tw.style(
								"text-fans-black dark:text-fans-white",
							)}
						>
							Send tip
						</FypText>
						<FypSvg
							svg={RoundedTipSvg}
							width={23}
							height={23}
							color="fans-black dark:fans-white"
						/>
					</FansView>
				)}
			</FansView>

			<FypText
				fontSize={16}
				lineHeight={21}
				style={tw.style(
					"min-w-20 text-fans-grey-70 dark:text-fans-grey-b1 md:hidden mt-2",
				)}
			>
				{getAgoTime(data.updatedAt ?? "")}
			</FypText>
		</FansView>
	);
};

export default CardFooter;
