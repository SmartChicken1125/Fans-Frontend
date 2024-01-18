import { Clock1Svg, CalendarSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypLinearGradientView,
	FypText,
	FypSvg,
	FypButton2,
} from "@components/common/base";
import { FansView, FansDivider } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";

interface Props {
	status: "active" | "fulfilled" | "refunded";
}

const OrderCard: FC<Props> = (props) => {
	const { status } = props;

	const getGradientColor = () => {
		switch (status) {
			case "active":
				return ["#d885ff", "#a854f5", "#1d21e5"];
			case "fulfilled":
				return ["#89F276", "#23C9B1", "#24A2FF"];
			case "refunded":
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
				<FypSvg
					svg={Clock1Svg}
					width={10}
					height={10}
					color="fans-white"
				/>
				<FypText
					fontSize={13}
					lineHeight={13}
					fontWeight={600}
					style={tw.style("text-fans-white")}
				>
					STARTS IN 2 DAYS, 12 HOURS
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
					<UserAvatar size="46px" />
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
								JAN 13, 2024
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
								4:23 AM
							</FypText>
						</FansView>
					</FansView>

					<FypLinearGradientView
						colors={["#24A2FF", "#23C9B1", "#89F276"]}
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
							$100
						</FypText>
					</FypLinearGradientView>
				</FansView>

				<FansView flexDirection="row" alignItems="center" gap={16}>
					<FansView flexDirection="row" alignItems="center" gap={8}>
						<FypSvg
							svg={CalendarSvg}
							width={16}
							height={18}
							color="fans-purple"
						/>
						<FypText fontSize={15} fontWeight={600} lineHeight={15}>
							APRIL 23
						</FypText>
					</FansView>
					<FansView flexDirection="row" alignItems="center" gap={8}>
						<FypSvg
							svg={Clock1Svg}
							width={19}
							height={19}
							color="fans-purple"
						/>
						<FypText fontSize={15} fontWeight={600} lineHeight={15}>
							10:15-10:30 PM UTC
						</FypText>
					</FansView>
				</FansView>

				<FansView margin={{ t: 14 }}>
					<FansDivider
						style={tw.style(
							"border-fans-grey dark:border-fans-grey-43 mb-3",
						)}
					/>
					<FypText
						fontSize={16}
						lineHeight={21}
						margin={{ b: 26 }}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
						)}
					>
						It's my friend's birthday and I'd like you to give him a
						special surprise....
					</FypText>
					<FansView flexDirection="row" gap={8}>
						<FypButton2
							style={tw.style(
								"border border-fans-grey-48 dark:border-fans-grey-b1",
							)}
							textStyle={tw.style(
								"text-fans-grey-48 dark:text-fans-grey-48",
							)}
						>
							Cancel
						</FypButton2>
						<FypButton2
							style={tw.style("bg-fans-black dark:bg-fans-white")}
							textStyle={tw.style(
								"text-fans-white dark:text-fans-black-1d",
							)}
						>
							Join
						</FypButton2>
					</FansView>
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
				</FansView>
			</FansView>
		</FypLinearGradientView>
	);
};

export default OrderCard;
