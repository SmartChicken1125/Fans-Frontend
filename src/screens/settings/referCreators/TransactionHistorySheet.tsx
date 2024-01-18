import { Check2Svg, WarningSvg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import { FypSvg } from "@components/common/base";
import {
	FansDivider,
	FansGap,
	FansImage,
	FansSheet,
	FansText,
	FansView,
} from "@components/controls";
import tw from "@lib/tailwind";
import { RoundButtonType } from "@usertypes/commonEnums";
import { IFansSheet } from "@usertypes/components";
import { isWeb } from "@utils/global";
import { openURL } from "expo-linking";
import { DateTime } from "luxon";
import React, { Fragment } from "react";
import { View } from "react-native";

const TransactionHistorySheet: IFansSheet = (props) => {
	const isSubscriptionUpdate =
		props.creatorReferralTransaction?.status === "Successful";
	const isPaymentFailed =
		props.creatorReferralTransaction?.status === "Cancelled";

	const handlePressReport = () => {
		isWeb
			? window.open("https://support.fyp.fans", "_blank")
			: openURL("https://support.fyp.fans");
	};

	return (
		<FansSheet {...props}>
			<FansView
				width="screen"
				style={tw.style(
					"sm:max-w-[741px]",
					"px-[17px] sm:px-[33px] pt-[49px] sm:pt-[33px] pb-[48px] sm:pb-[42px]",
				)}
			>
				<View style={tw.style("flex-row items-center")}>
					<FansView width={46} height={46}>
						<FansImage
							source={{
								uri:
									props.creatorReferralTransaction?.referent
										?.avatar ?? "",
							}}
						/>
					</FansView>
					<FansGap width={13} />
					<FansView style={tw.style("grow")}>
						<FansText fontFamily="inter-semibold" fontSize={19}>
							{
								props.creatorReferralTransaction?.referent
									?.displayName
							}
						</FansText>
						<FansGap height={4} />
						<FansText color="grey-70" fontSize={16}>
							@
							{
								props.creatorReferralTransaction?.referent
									?.username
							}
						</FansText>
					</FansView>
					<FansView style={tw.style("flex items-end")}>
						<FansView
							style={tw.style(
								isSubscriptionUpdate
									? "bg-fans-green/10"
									: "bg-fans-red-fd",
								"px-[7px] py-[2px]",
								"rounded-full",
							)}
						>
							<FansText
								color={
									isSubscriptionUpdate ? "green-4d" : "red-eb"
								}
								fontFamily="inter-semibold"
								fontSize={14}
							>
								${props.creatorReferralTransaction?.total}
							</FansText>
						</FansView>
						<FansGap height={6} />
						<FansText color="grey-70" fontSize={14}>
							{DateTime.fromISO(
								props.creatorReferralTransaction?.updatedAt ??
									"",
							).toFormat("MMM d, h:m a")}
						</FansText>
					</FansView>
				</View>
				<FansGap height={38.9} />
				<FansView style={tw.style("flex gap-[15px]")}>
					{[
						{
							label: "Transaction ID",
							text: props.creatorReferralTransaction?.id,
						},
						{
							label: "Transaction",
							text: props.creatorReferralTransaction?.description,
						},
						{
							label: "Price",
							text: `$${props.creatorReferralTransaction?.amount}`,
						},
						// { label: "VAT tax", text: "$10" },
						{
							label: "Fee",
							text: `$${props.creatorReferralTransaction?.totalFee}`,
						},
						{
							label: "Net cost",
							text: `$${props.creatorReferralTransaction?.total}`,
						},
						{
							label: "Status",
							text: props.creatorReferralTransaction?.status,
						},
					].map((item) => {
						const { label, text } = item;
						return (
							<Fragment>
								<FansDivider
									ver1
									style={tw.style("w-full", "h-[1px]")}
								/>
								<FansView
									style={tw.style("flex-row items-center")}
								>
									<FansView style={tw.style("flex-1")}>
										<FansText
											style={tw.style(
												"font-inter-semibold",
												"text-[17px]",
											)}
										>
											{label}
										</FansText>{" "}
									</FansView>
									<FansView style={tw.style("flex-1")}>
										{label !== "Status" ? (
											<FansText
												style={tw.style(
													"text-[16px] text-fans-grey-70 dark:text-fans-grey-b1",
												)}
											>
												{text}
											</FansText>
										) : (
											<FansView
												style={tw.style(
													"bg-fans-green/10",
													"flex-row gap-[5px] items-center",
													"px-[8px] py-[2px]",
													"rounded-full",
													"self-start",
												)}
											>
												<FypSvg
													svg={Check2Svg}
													width={10}
													height={7}
													color={
														isSubscriptionUpdate
															? "fans-green"
															: "fans-red"
													}
												/>
												<FansText
													style={tw.style(
														"font-inter-semibold",
														isSubscriptionUpdate
															? "text-[14px] text-fans-green"
															: "text-[14px] text-fans-red",
														"uppercase",
													)}
												>
													{text}
												</FansText>
											</FansView>
										)}
									</FansView>
								</FansView>
							</Fragment>
						);
					})}
				</FansView>
				<FansGap height={44.2} />
				<RoundButton
					variant={RoundButtonType.OUTLINE}
					color="#F00"
					onPress={handlePressReport}
				>
					<WarningSvg width={16} height={16} color="#F00" />
					&nbsp; Report a problem
				</RoundButton>
			</FansView>
		</FansSheet>
	);
};

export default TransactionHistorySheet;
