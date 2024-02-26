import {
	ShopSvg,
	CalendarSvg,
	ArchivedPostSvg,
	CameoVideoSVG,
	VideoRecordSvg,
} from "@assets/svgs/common";
import {
	FypText,
	FypLinearGradientView,
	FypSvg,
} from "@components/common/base";
import { FansView, FansDivider, FansGap } from "@components/controls";
import { formatPrice } from "@helper/Utils";
import tw from "@lib/tailwind";
import { IProfile } from "@usertypes/types";
import React, { FC, Fragment } from "react";
import AvatarWithStatus from "../common/AvatarWithStatus";

interface SummaryFieldProps {
	name: string;
	value: string;
	svg: React.FC;
	iconColor: string;
}

export const SummaryField: FC<SummaryFieldProps> = (props) => {
	const { name, value, svg, iconColor } = props;
	return (
		<FansView flexDirection="row" alignItems="center" gap={13}>
			<FypSvg svg={svg} width={14} height={14} color={iconColor} />
			<FypText fontSize={16} fontWeight={600}>
				{`${name}: `}
				<FypText
					fontSize={16}
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					{value}
				</FypText>
			</FypText>
		</FansView>
	);
};

interface Props {
	creator: IProfile;
	subtotal: number;
	platformFee: number;
	total: number;
	type: "videoCall" | "customVideo";
	dateText: string;
	timeText: string;
}

const OrderSummary: FC<Props> = (props) => {
	const { creator, subtotal, total, platformFee, type, dateText, timeText } =
		props;
	return (
		<FansView>
			<FansView
				flexDirection="row"
				alignItems="center"
				gap={9}
				margin={{ b: 13 }}
			>
				<FypSvg
					svg={ShopSvg}
					width={14}
					height={17}
					color="fans-black dark:fans-white"
				/>
				<FypText fontSize={23} fontWeight={700}>
					Order summary
				</FypText>
			</FansView>
			<FansView
				borderRadius={15}
				padding={{ x: 16, y: 14 }}
				style={tw.style(
					"border border-fans-grey dark:border-fans-grey-43",
				)}
			>
				<FansView flexDirection="row" alignItems="center" gap={13}>
					<FansView
						width={46}
						height={46}
						position="relative"
						padding={4}
						borderRadius={109}
						alignItems="center"
						justifyContent="center"
						style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
					>
						<AvatarWithStatus size={46} avatar={creator.avatar} />
						<FypLinearGradientView
							colors={["#d885ff", "#1d21e5"]}
							width={24}
							height={24}
							borderRadius={24}
							alignItems="center"
							justifyContent="center"
							position="absolute"
							style={tw.style(
								"border-[2px] border-fans-white dark:border-fans-black-1d",
								"right-[-2px] bottom-[-4px]",
							)}
						>
							<FypSvg
								svg={
									type === "videoCall"
										? VideoRecordSvg
										: CameoVideoSVG
								}
								width={12}
								height={12}
								color="fans-white"
							/>
						</FypLinearGradientView>
					</FansView>
					<FansView>
						<FypText fontSize={19} fontWeight={600}>
							{type === "videoCall"
								? "Video call"
								: "Custom video"}
						</FypText>
						<FypText
							fontSize={16}
							style={tw.style(
								"text-fans-grey-48 dark:text-fans-grey-b1",
							)}
						>
							{`by ${creator.displayName}`}
						</FypText>
					</FansView>
				</FansView>
				<FansGap height={24} />
				<FansView style={tw.style("gap-x-12 gap-y-[10px] md:flex-row")}>
					{type === "videoCall" ? (
						<Fragment>
							<SummaryField
								name="Date"
								value={dateText}
								svg={CalendarSvg}
								iconColor="fans-grey-48 dark:fans-grey-b1"
							/>
							<FansDivider style={tw.style("md:hidden")} />
							<SummaryField
								name="Time"
								value={timeText}
								svg={ArchivedPostSvg}
								iconColor="fans-grey-48 dark:fans-grey-b1"
							/>
						</Fragment>
					) : (
						<Fragment>
							<SummaryField
								name="Length"
								value={timeText}
								svg={ArchivedPostSvg}
								iconColor="fans-grey-48 dark:fans-grey-b1"
							/>
							<FansDivider style={tw.style("md:hidden")} />
							<SummaryField
								name="Due"
								value={dateText}
								svg={CalendarSvg}
								iconColor="fans-grey-48 dark:fans-grey-b1"
							/>
						</Fragment>
					)}
				</FansView>
			</FansView>

			<FansGap height={{ xs: 26, md: 32 }} />

			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
			>
				<FypText
					fontSize={17}
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					Subtotal
				</FypText>
				<FypText
					fontSize={17}
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					{formatPrice(subtotal)}
				</FypText>
			</FansView>
			<FansGap height={20} />
			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
			>
				<FypText
					fontSize={17}
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					Platform fee
				</FypText>
				<FypText
					fontSize={17}
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					{formatPrice(platformFee)}
				</FypText>
			</FansView>
			<FansGap height={20} />
			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
			>
				<FypText fontSize={17} fontWeight={600}>
					Total
				</FypText>
				<FypText fontSize={17} fontWeight={600}>
					{formatPrice(total)}
				</FypText>
			</FansView>
		</FansView>
	);
};

export default OrderSummary;
