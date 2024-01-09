import {
	HeartSvg,
	CommentSvg,
	BookmarkSvg,
	PostMailSvg,
	RoundedTipSvg,
	FilledHeartSvg,
	FilledBookmarkSvg,
} from "@assets/svgs/common";
import { FypNullableView, FypText, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { PostType } from "@usertypes/commonEnums";
import { IPost } from "@usertypes/types";
import { getAgoTime } from "@utils/common";
import React, { FC } from "react";

interface Props {
	data: IPost;
	onClickLike: () => void;
	onClickBookmark: () => void;
	onClickComment: () => void;
	onClickMessage?: () => void;
	onClickSendTip: () => void;
}

const CardFooter: FC<Props> = (props) => {
	const {
		data,
		onClickLike,
		onClickComment,
		onClickBookmark,
		onClickMessage,
		onClickSendTip,
	} = props;

	return (
		<FansView
			style={tw.style(
				"px-[18px] py-3 md:px-0 md:px-0",
				data.isExclusive && "px-0",
			)}
		>
			<FansView
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

					<FypNullableView visible={!data.advanced?.isTurnOffComment}>
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
						style={tw.style("text-fans-black dark:text-fans-white")}
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
