import {
	Clock1Svg,
	CalendarSvg,
	Check1Svg,
	BlockSvg,
	OutlinedInfoSvg,
	RoundedTipSvg,
	ArchivedPostSvg,
	UserSvg,
} from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypLinearGradientView,
	FypText,
	FypSvg,
	FypButton2,
	FypNullableView,
} from "@components/common/base";
import { FansView, FansDivider, FansGap } from "@components/controls";
import { formatPrice } from "@helper/Utils";
import tw from "@lib/tailwind";
import {
	MeetingStatusType,
	VideoCallOrderCardType,
} from "@usertypes/commonEnums";
import { ICustomVideoOrder } from "@usertypes/types";
import moment from "moment";
import React, { FC } from "react";
import { SummaryField } from "./orderSummary";

interface Props {
	title: string;
	data: ICustomVideoOrder;
	cardType: VideoCallOrderCardType;
	onPressSubmit?: () => void;
	onPressCancel?: () => void;
	onPressAddCalendar?: () => void;
	submitLabel?: string;
	cancelLabel?: string;
	disabledSubmit?: boolean;
	disabledCancel?: boolean;
}

const CustomVideoOrderCard: FC<Props> = (props) => {
	const {
		data,
		cardType,
		onPressSubmit,
		onPressCancel,
		onPressAddCalendar,
		title,
		submitLabel,
		cancelLabel,
		disabledSubmit,
		disabledCancel,
	} = props;

	const getGradientColor = () => {
		switch (cardType) {
			case VideoCallOrderCardType.Pending:
				return ["#d885ff", "#a854f5", "#1d21e5"];
			case VideoCallOrderCardType.Accepted:
				return ["#d885ff", "#a854f5", "#1d21e5"];
			case VideoCallOrderCardType.Now:
				return ["#FD41AE", "#FA7256", "#F9F928"];
			case VideoCallOrderCardType.Past:
				return ["#24A2FF", "#23C9B1", "#89F276"];
			case VideoCallOrderCardType.Refunded:
				return ["#EB2121", "#E53EC6", "#F98C28"];
			default:
				return ["#d885ff", "#a854f5", "#1d21e5"];
		}
	};

	return (
		<FypLinearGradientView
			colors={getGradientColor()}
			start={[1, 0]}
			end={[0, 1]}
			borderRadius={15}
			padding={4}
		>
			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="center"
				gap={8}
				margin={{ b: 6 }}
			>
				<FypNullableView
					visible={cardType === VideoCallOrderCardType.Pending}
				>
					<FypSvg
						svg={OutlinedInfoSvg}
						width={10}
						height={10}
						color="fans-white"
					/>
				</FypNullableView>
				<FypNullableView
					visible={cardType === VideoCallOrderCardType.Accepted}
				>
					<FypSvg
						svg={Clock1Svg}
						width={10}
						height={10}
						color="fans-white"
					/>
				</FypNullableView>
				<FypNullableView
					visible={cardType === VideoCallOrderCardType.Past}
				>
					<FypSvg
						svg={Check1Svg}
						width={12}
						height={8}
						color="fans-white"
					/>
				</FypNullableView>
				<FypNullableView
					visible={cardType === VideoCallOrderCardType.Refunded}
				>
					<FypSvg
						svg={BlockSvg}
						width={10}
						height={10}
						color="fans-white"
					/>
				</FypNullableView>

				<FypText
					fontSize={13}
					lineHeight={13}
					fontWeight={600}
					style={tw.style("text-fans-white")}
				>
					{title}
				</FypText>
			</FansView>
			<FansView
				borderRadius={13}
				padding={{ t: 13, x: 12, b: 14 }}
				position="relative"
				style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
			>
				<FansView
					flexDirection="row"
					alignItems="center"
					gap={13}
					position="relative"
					margin={{ b: 30 }}
				>
					<UserAvatar size="46px" image={""} />
					<FansView flex="1">
						<FypText
							fontSize={15}
							lineHeight={20}
							fontWeight={600}
							margin={{ b: 3 }}
						>
							Ramiro Altamiglia
						</FypText>
						<FansView flexDirection="row" alignItems="center">
							<FypText
								fontSize={14}
								lineHeight={19}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								Jan 13, 2024
							</FypText>
							<FansView
								width={4}
								height={4}
								borderRadius={4}
								margin={{ l: 17, r: 13 }}
								style={tw.style(
									"bg-fans-grey-70 dark:bg-fans-grey-b1",
								)}
							></FansView>
							<FypText
								fontSize={14}
								lineHeight={19}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								4:23 am
							</FypText>
						</FansView>
					</FansView>

					<FypLinearGradientView
						colors={
							data.status !== MeetingStatusType.Cancelled
								? ["#24A2FF", "#23C9B1", "#89F276"]
								: ["#b1b1b1", "#b1b1b1"]
						}
						start={[0, 1]}
						end={[1, 0]}
						height={26}
						borderRadius={26}
						padding={{ x: 8 }}
						style={tw.style("min-w-[55px] top-0 right-0")}
						justifyContent="center"
						alignItems="center"
						position="absolute"
					>
						<FypText
							fontSize={14}
							lineHeight={19}
							fontWeight={600}
							style={tw.style("text-fans-white")}
						>
							{formatPrice(data.price.amount)}
						</FypText>
					</FypLinearGradientView>
				</FansView>

				<FansView
					gap={{ xs: 10, md: 16 }}
					style={tw.style("flex-col md:flex-row")}
				>
					<FansView flex="1">
						<SummaryField
							name="Due"
							value={moment(data.dueDate).format(
								"MMMM DD, HH:mm a",
							)}
							svg={CalendarSvg}
							iconColor="fans-purple"
						/>
					</FansView>
					<FansDivider />
					<FansView flex="1">
						<SummaryField
							name="Amount"
							value={`${formatPrice(data.price.amount)} USD`}
							svg={RoundedTipSvg}
							iconColor="fans-purple"
						/>
					</FansView>
				</FansView>
				<FansGap height={10} />
				<FansDivider />
				<FansGap height={10} />
				<FansView
					gap={{ xs: 10, md: 16 }}
					style={tw.style("flex-col md:flex-row")}
				>
					<FansView flex="1">
						<SummaryField
							name="Length"
							value={`${data.duration / 60} minutes`}
							svg={ArchivedPostSvg}
							iconColor="fans-purple"
						/>
					</FansView>
					<FansDivider />
					<FansView flex="1">
						<SummaryField
							name="To"
							value={data.recipientName}
							svg={UserSvg}
							iconColor="fans-purple"
						/>
					</FansView>
				</FansView>

				<FansGap height={18} />
				<FansView>
					<FypText
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
						)}
					>
						{data.instructions}
					</FypText>
					{onPressSubmit || onPressCancel ? (
						<FansView
							flexDirection="row"
							gap={8}
							margin={{ t: 26 }}
						>
							<FypButton2
								style={tw.style(
									disabledCancel && "opacity-35",
									"border border-fans-grey-48 dark:border-fans-grey-b1 flex-1",
								)}
								textStyle={tw.style(
									"text-fans-grey-48 dark:text-fans-grey-48",
								)}
								pressableProps={{
									onPress: onPressCancel,
								}}
							>
								{cancelLabel ?? "Cancel"}
							</FypButton2>

							<FypButton2
								style={tw.style(
									disabledSubmit
										? "bg-fans-grey-de flex-1"
										: "bg-fans-black dark:bg-fans-white flex-1",
								)}
								textStyle={tw.style(
									"text-fans-white dark:text-fans-black-1d",
								)}
								pressableProps={{
									onPress: onPressSubmit,
								}}
							>
								{submitLabel ?? "Accept"}
							</FypButton2>
						</FansView>
					) : null}

					{onPressAddCalendar ? (
						<FansView
							flexDirection="row"
							alignItems="center"
							justifyContent="center"
							gap={13}
							margin={{ t: 14 }}
						>
							<FypSvg
								svg={CalendarSvg}
								width={14}
								height={16}
								color="fans-purple"
							/>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								style={tw.style("text-fans-purple")}
							>
								Add to Calendar
							</FypText>
						</FansView>
					) : null}
				</FansView>
			</FansView>
		</FypLinearGradientView>
	);
};

export default CustomVideoOrderCard;