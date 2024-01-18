import {
	ChevronDownSvg,
	MessageSvg,
	ThreeDotsSvg,
	CreditCardSvg,
} from "@assets/svgs/common";
import {
	FypLink,
	FypCollapsible,
	FypSvg,
	FypText,
} from "@components/common/base";
import PaymentMethodModal from "@components/common/subscriptionCard/paymentMethodModal";
import {
	FansView,
	FansImage,
	FansDivider,
	FansIconButton,
} from "@components/controls";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import {
	SubscriptionFilterTypes,
	SubscribeActionType,
	PromotionType,
} from "@usertypes/commonEnums";
import { Subscription, Bundle } from "@usertypes/types";
import React, { FC, Fragment, useState } from "react";
import { Image, Pressable, View } from "react-native";
import SubscriptionBundle from "../subscriptionBundle";

interface Props {
	subscription: Subscription;
	variant: SubscriptionFilterTypes;
	showUpdatePaymentPopup?: boolean;
	onClickShare: () => void;
	onClickMenu: () => void;
	onClickMessage: () => void;
	onDeleteSubscription: (subscription: Subscription) => void;
}

const SubscriptionCard: FC<Props> = (props) => {
	const {
		subscription,
		onClickMenu,
		onClickMessage,
		showUpdatePaymentPopup = false,
		onDeleteSubscription,
	} = props;

	const { dispatch } = useAppContext();

	const [collapsed, setCollapsed] = useState(true);
	const [openSubscribe, setOpenSubscribe] = useState(false);
	const [openUpdatePayment, setOpenUpdatePayment] = useState(
		showUpdatePaymentPopup,
	);

	function formatDateToCustomString(date: Date) {
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	function renewalDate(date: Date) {
		const currentDate = new Date();
		const renewalDate = new Date(date);
		renewalDate.setMonth(currentDate.getMonth() + 1);
		renewalDate.setDate(date.getDate());

		if (date.getDate() !== renewalDate.getDate()) {
			renewalDate.setDate(0);
		}

		return renewalDate;
	}

	const handleOpenSubscribeModal = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: true,
				creator: subscription.creator,
				subscribeActionType: subscription.bundle
					? SubscribeActionType.Bundle
					: subscription.tier
					? SubscribeActionType.Tier
					: SubscribeActionType.Subscribe,
				bundleId: subscription.bundle?.id,
				subscribeTierId: (subscription.subscriptionId?.toString() ??
					subscription.tierId?.toString())!,
				defaultTab: "start",
			},
		});
	};

	const defaultAvatar = require("@assets/images/default-avatar.png");

	const isCanceledButNotExpired =
		new Date(subscription.endDate) >= new Date();

	const freeTrialEndDate =
		subscription.campaign?.type === PromotionType.FreeTrial
			? new Date(
					new Date(subscription.startDate).setMonth(
						subscription.campaign.duration,
					),
			  )
			: false;

	const isFreeTrialPeriod = freeTrialEndDate && freeTrialEndDate > new Date();

	return (
		<FansView
			style={tw.style(
				"border border-fans-grey-de rounded-[15px] dark:border-fans-grey-50",
			)}
		>
			<View style={tw.style("h-[85px] rounded-t-[15px] relative")}>
				<Image
					source={{
						uri: cdnURL(subscription.creator.cover[0]),
					}}
					style={tw.style("w-full h-full rounded-t-[15px]")}
				/>
				{/* {props.variant === SubscriptionFilterTypes.Expired ? (
					<View
						style={tw.style(
							"absolute top-5 left-[18px] bg-[rgba(0,0,0,0.5)] rounded-[15px] py-[3.5px] px-[13.5px]",
						)}
					>
						<Text style={tw.style("text-[14px] text-white")}>
							10 New posts
						</Text>
					</View>
				) : null} */}

				<View
					style={tw.style(
						"absolute top-[18px] right-[18px] gap-x-2 flex-row",
					)}
				>
					{props.variant === SubscriptionFilterTypes.Active ? (
						<Fragment>
							{/* <IconButton
								style={tw.style("w-[34px] h-[34px] m-0")}
								containerColor="#f0f0f0"
								icon={() => (
									<MessageSvg size={18.3} color="#000" />
								)}
								onPress={onClickMessage}
							/> */}
							<FansIconButton
								size={34}
								backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
								onPress={() => setOpenUpdatePayment(true)}
							>
								<FypSvg
									svg={CreditCardSvg}
									width={19.33}
									height={19.33}
									color="fans-black dark:fans-white"
								/>
							</FansIconButton>
						</Fragment>
					) : null}
					<FansIconButton
						size={34}
						backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
						onPress={onClickMenu}
					>
						<FypSvg
							svg={ThreeDotsSvg}
							width={18}
							height={18}
							color="fans-black dark:fans-white"
						/>
					</FansIconButton>
				</View>
			</View>
			<View style={tw.style("px-[18px] pb-[18px]")}>
				<View style={tw.style("flex-row items-end mt-[-20px] mb-5")}>
					<FansView
						style={tw.style(
							"w-[79px] h-[79px]",
							"border border-[4px] border-fans-white rounded-full dark:border-fans-black-1d",
							"relative",
						)}
					>
						<FansImage
							source={
								subscription.creator.avatar
									? {
											uri: cdnURL(
												subscription.creator.avatar,
											),
									  }
									: defaultAvatar
							}
							style={tw.style("rounded-full")}
						/>
						<FansView
							style={tw.style(
								"w-[15px] h-[15px]",
								"absolute bottom-[2px] right-[6px]",
								"bg-fans-green dark:bg-fans-green-29",
								"border border-[2px] border-fans-white rounded-full dark:border-fans-black-1d",
							)}
						/>
					</FansView>
					<FypLink url={`/${subscription.creator.profileLink}`}>
						<View style={tw.style("mb-[5px] ml-[14px] shrink")}>
							<FypText
								fontSize={19}
								lineHeight={26}
								fontWeight={700}
								numberOfLines={1}
							>
								{subscription.creator.displayName}
							</FypText>
							<FypText
								fontSize={16}
								lineHeight={21}
								style={tw.style(
									"text-fans-dark-grey dark:text-fans-grey-b1",
								)}
								numberOfLines={1}
							>
								@{subscription.creator.profileLink}
							</FypText>
						</View>
					</FypLink>
				</View>
				{subscription.bundle ? (
					<SubscriptionBundle
						title={
							isFreeTrialPeriod
								? "Free Trial"
								: `${subscription.bundle.month} months`
						}
						value={`$${subscription.amount} / month`}
						optionalText={`($${subscription.bundle.discount} off)`}
						onPress={() =>
							props.variant === SubscriptionFilterTypes.Expired
								? handleOpenSubscribeModal()
								: setOpenUpdatePayment(true)
						}
					/>
				) : (
					<SubscriptionBundle
						title={
							props.variant === SubscriptionFilterTypes.Active &&
							!subscription.endDate
								? isFreeTrialPeriod
									? "Free Trial"
									: `$${subscription.amount} / month`
								: "Subscribe"
						}
						value={
							props.variant === SubscriptionFilterTypes.Expired ||
							subscription.endDate
								? `$${subscription.amount} / month`
								: ""
						}
						variant={
							props.variant === SubscriptionFilterTypes.Active &&
							!subscription.endDate
								? "outlined"
								: "contained"
						}
						onPress={() =>
							props.variant === SubscriptionFilterTypes.Expired
								? handleOpenSubscribeModal()
								: setOpenUpdatePayment(true)
						}
					/>
				)}

				<View
					style={tw.style(
						"flex-row items-center justify-between mt-3",
					)}
				>
					<FypText
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							"text-fans-dark-grey dark:text-fans-grey-b1",
						)}
					>
						{props.variant === SubscriptionFilterTypes.Active &&
						!subscription.endDate
							? subscription.amount === 0
								? "Renews for free"
								: isFreeTrialPeriod
								? "Free Trial ends"
								: "Renews"
							: isCanceledButNotExpired
							? "Expires"
							: "Expired"}
					</FypText>
					<FypText
						fontSize={16}
						lineHeight={21}
						style={tw.style(
							"text-fans-dark-grey dark:text-fans-grey-b1",
						)}
					>
						{props.variant === SubscriptionFilterTypes.Active
							? formatDateToCustomString(
									isFreeTrialPeriod
										? freeTrialEndDate
										: renewalDate(
												new Date(
													subscription.startDate,
												),
										  ),
							  )
							: formatDateToCustomString(
									new Date(subscription.endDate),
							  )}
					</FypText>
				</View>
				{props.variant === SubscriptionFilterTypes.Expired &&
				(subscription.subscription?.bundles?.length ?? 0) > 0 ? (
					<Fragment>
						<FansDivider style={tw.style("h-[1px] mt-5 mb-4")} />

						<Pressable
							style={tw.style(
								"flex-row items-center justify-between",
							)}
							onPress={() => setCollapsed(!collapsed)}
						>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
							>
								Subscription bundles
							</FypText>
							<FypSvg
								svg={ChevronDownSvg}
								width={16}
								height={16}
								color="fans-grey-70 dark:fans-grey-b1"
							/>
						</Pressable>
						<FypCollapsible collapsed={collapsed}>
							<View style={tw.style("pt-4 gap-y-2")}>
								{subscription.subscription?.bundles?.map(
									(bundle: Bundle) => (
										<SubscriptionBundle
											title={`${bundle.month} months`}
											value={`$${bundle.price} / month`}
											optionalText={`($${bundle.discount} off)`}
											onPress={() =>
												props.variant ===
												SubscriptionFilterTypes.Expired
													? handleOpenSubscribeModal()
													: setOpenUpdatePayment(true)
											}
										/>
									),
								)}
							</View>
						</FypCollapsible>
					</Fragment>
				) : null}
			</View>
			<PaymentMethodModal
				visible={openUpdatePayment}
				handleClose={() => setOpenUpdatePayment(false)}
				subscription={subscription}
				onDeleteSubscription={onDeleteSubscription}
			/>
		</FansView>
	);
};

export default SubscriptionCard;
