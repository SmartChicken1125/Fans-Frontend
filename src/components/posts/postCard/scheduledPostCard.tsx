import {
	Calendar2Svg,
	Check3Svg,
	Clock1Svg,
	Edit2Svg,
	MusicSvg,
	Trash2Svg,
} from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import {
	FansGap,
	FansHorizontalDivider,
	FansImage2,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { PostType } from "@usertypes/commonEnums";
import { IPost } from "@usertypes/types";
import { DateTime } from "luxon";
import React, { FC, Fragment } from "react";
import { TouchableOpacity } from "react-native";

interface Props {
	data: IPost;
	onClickEdit?: () => void;
	onClickRemove?: () => void;
}

const ScheduledPostCard: FC<Props> = (props) => {
	const { data, onClickEdit, onClickRemove } = props;
	const { isPosted } = data;

	return (
		<FansView
			alignItems="center"
			flexDirection="row"
			opacity={isPosted ? 50 : 100}
		>
			<FansView
				width={0}
				style={tw.style(
					"p-[17px] border border-fans-grey dark:border-fans-grey-43",
				)}
				borderRadius={15}
				grow
			>
				<FansView
					alignItems={{ lg: "center" }}
					flexDirection="row"
					gap={15.8}
					style={tw.style("min-h-[50px]")}
				>
					{data.type === PostType.Media ? (
						<FansImage2
							width={95}
							height={95}
							source={{
								uri: cdnURL(data.thumb?.url),
							}}
							viewStyle={{ borderRadius: 7 }}
							imageStyle={{ resizeMode: "cover" }}
						/>
					) : data.type === PostType.Audio ? (
						<FansSvg
							width={30}
							height={33}
							svg={MusicSvg}
							color="#a854f5"
							style={tw.style("md:w-[52px] md:h-[58.5px] m-3")}
						/>
					) : (
						<></>
					)}
					<FansText
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							"text-fans-grey-70 dark:text-fans-grey-b1 break-all",
						)}
					>
						{data.caption}
					</FansText>
				</FansView>
				<FansGap height={16.8} />
				<FansHorizontalDivider />
				<FansGap height={14.7} />
				<FansView flexDirection="row" alignItems="center" gap={17.1}>
					<FansView flexDirection="row" gap={7.5}>
						<FansSvg
							width={16.18}
							height={18.09}
							svg={Calendar2Svg}
							color1="purple"
						/>
						<FansText
							fontFamily="inter-semibold"
							fontSize={17}
							textTransform="uppercase"
						>
							{DateTime.fromISO(
								data.schedule?.startDate!,
							).toFormat("MMM d")}{" "}
						</FansText>
					</FansView>
					<FansView flexDirection="row" gap={6.4}>
						<FansSvg
							width={18.38}
							height={18.38}
							svg={Clock1Svg}
							color1="purple"
						/>
						<FansText fontFamily="inter-semibold" fontSize={17}>
							{DateTime.fromISO(
								data.schedule?.startDate!,
							).toFormat("hh:mm a")}
						</FansText>
					</FansView>
					{isPosted && (
						<FansView
							width={103.76}
							height={30}
							style={tw.style("bg-fans-purple/20")}
							alignItems="center"
							borderRadius="full"
							flexDirection="row"
							gap={9.1}
							justifyContent="center"
						>
							<FansSvg
								width={10.8}
								height={7.19}
								svg={Check3Svg}
								color1="purple"
							/>
							<FansText
								color="purple"
								fontFamily="inter-semibold"
								fontSize={13}
							>
								POSTED
							</FansText>
						</FansView>
					)}
				</FansView>
			</FansView>
			{!isPosted && (
				<Fragment>
					<FansGap width={18} />
					<FansView gap={7}>
						<TouchableOpacity onPress={onClickEdit}>
							<FansView
								width={34}
								height={34}
								alignItems="center"
								borderRadius="full"
								justifyContent="center"
								style={tw.style(
									"bg-fans-grey dark:bg-fans-grey-43",
								)}
							>
								<FypSvg
									width={12.94}
									height={13.5}
									svg={Edit2Svg}
									color="fans-black dark:fans-white"
								/>
							</FansView>
						</TouchableOpacity>
						<TouchableOpacity onPress={onClickRemove}>
							<FansView
								width={34}
								height={34}
								alignItems="center"
								borderRadius="full"
								justifyContent="center"
								style={tw.style(
									"bg-fans-grey dark:bg-fans-grey-43",
								)}
							>
								<FypSvg
									width={11.87}
									height={14.76}
									svg={Trash2Svg}
									color="fans-red"
								/>
							</FansView>
						</TouchableOpacity>
					</FansView>
				</Fragment>
			)}
		</FansView>
	);
};

export default ScheduledPostCard;
