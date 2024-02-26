import { Close1Svg, Close2Svg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import RoundButton from "@components/common/RoundButton";
import {
	FypLinearGradientView,
	FypSvg,
	FypText,
} from "@components/common/base";
import PaymentMethodDropdown from "@components/common/paymentMethodDropdown";
import {
	FansDivider,
	FansIconButton,
	FansText,
	FansView,
} from "@components/controls";
import { AddPaymentCardDialog, SubscriptionButton } from "@components/profiles";
import { ANIMATION_LOADING_DIALOG_ID } from "@constants/modal";
import {
	CommonActionType,
	ModalActionType,
	useAppContext,
} from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import {
	getChatPaidPostPrice,
	purchaseChatPaidPost,
} from "@helper/endpoints/chat/apis";
import {
	getPaidPostPrice,
	purchasePaidPost,
} from "@helper/endpoints/post/apis";
import {
	freeSubscribe,
	getPaymentMethods,
	getSubscriptionPrice,
	subscribe,
} from "@helper/endpoints/subscriptions/apis";
import tw from "@lib/tailwind";
import { SubscribeActionType } from "@usertypes/commonEnums";
import {
	IBundle,
	IPaymentMethod,
	ISubscription,
	ISubscriptionTier,
} from "@usertypes/types";
import { getBundlePrice, getPriceString } from "@utils/stringHelper";
import React, { FC, useEffect, useState } from "react";
import { Image } from "react-native";
import { Modal } from "react-native-paper";
import Toast from "react-native-toast-message";
import ListLine from "../listLine";
import SubscriptionBundle from "../subscriptionBundle";

const SubscribeDialog: FC = () => {
	const { state, dispatch } = useAppContext();
	const {
		visible,
		creator,
		subscribeActionType,
		subscribeTierId,
		bundleId,
		defaultTab,
		post,
		message,
		onSuccess,
		checkAccessSubscribedUser,
		paidPostCallback,
	} = state.common.subscribeModal;

	const [tab, setTab] = useState("start");
	const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
	const [payment, setPayment] = useState("");
	const [subscription, setSubscription] = useState<ISubscription>();
	const [bundle, setBundle] = useState<IBundle>();
	const [tier, setTier] = useState<ISubscriptionTier>();
	const [price, setPrice] = useState(0);
	const [platformFee, setPlatformFee] = useState(0);
	const [vatFee, setVatFee] = useState(0);
	const [total, setTotal] = useState(0);
	const [freeTrial, setFreeTrial] = useState(false);
	const [freeTrialDays, setFreeTrialDays] = useState<number | undefined>();
	const [discount, setDiscount] = useState<number | undefined>();
	const [discountDays, setDiscountDays] = useState<number | undefined>();
	const [error, setError] = useState("");

	const [openPaymentModal, setOpenPaymentModal] = useState(false);

	const handleClose = () => {
		setError("");
		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: false,
				defaultTab: "start",
			},
		});
	};

	const handleSelectPaymentStep = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: true,
				defaultTab: "form",
			},
		});
	};

	useEffect(() => {
		const getPaymentMethodsData = async () => {
			const paymentMethodsData = await getPaymentMethods();
			if (paymentMethodsData.ok) {
				setPaymentMethods(paymentMethodsData.data);
			}
		};
		getPaymentMethodsData();
	}, [state.common.subscribeModal]);

	useEffect(() => {
		if (visible) {
			const getSubscriptionPriceData = async () => {
				if (!subscribeTierId) return;

				const subscriptionPriceData = await getSubscriptionPrice({
					id: subscribeTierId,
					...(bundleId ? { bundleId } : {}),
					customerPaymentProfileId: payment,
				});
				if (subscriptionPriceData.ok) {
					setPrice(subscriptionPriceData.data.amount);
					setPlatformFee(subscriptionPriceData.data.platformFee);
					setVatFee(subscriptionPriceData.data.vatFee);
					setTotal(subscriptionPriceData.data.totalAmount);
					setFreeTrial(!!subscriptionPriceData.data.freeTrial);
					setFreeTrialDays(
						subscriptionPriceData.data.freeTrialPeriod,
					);
					setDiscount(subscriptionPriceData.data.discount);
					setDiscountDays(subscriptionPriceData.data.discountPeriod);
				}
			};

			const getPaidPostPriceData = async () => {
				if (!message) return;

				const paidPostPriceData = await getPaidPostPrice({
					id: message.id,
					customerPaymentProfileId: payment,
				});
				if (paidPostPriceData.ok) {
					setPrice(paidPostPriceData.data.amount);
					setPlatformFee(paidPostPriceData.data.platformFee);
					setVatFee(paidPostPriceData.data.vatFee);
					setTotal(paidPostPriceData.data.totalAmount);
				}
			};

			const getChatPaidPostPriceData = async () => {
				if (!message) return;

				const paidPostPriceData = await getChatPaidPostPrice({
					id: message.id,
					customerPaymentProfileId: payment,
				});
				if (paidPostPriceData.ok) {
					setPrice(paidPostPriceData.data.amount);
					setPlatformFee(paidPostPriceData.data.platformFee);
					setVatFee(paidPostPriceData.data.vatFee);
					setTotal(paidPostPriceData.data.totalAmount);
				}
			};

			switch (subscribeActionType) {
				case SubscribeActionType.Subscribe:
					getSubscriptionPriceData();
					break;
				case SubscribeActionType.Tier:
					getSubscriptionPriceData();
					break;
				case SubscribeActionType.Bundle:
					getSubscriptionPriceData();
					break;
				case SubscribeActionType.Post:
					getPaidPostPriceData();
					break;
				case SubscribeActionType.ChatPost:
					getChatPaidPostPriceData();
					break;
				default:
					break;
			}
		}
	}, [
		subscribeTierId,
		bundleId,
		subscribeActionType,
		post,
		visible,
		payment,
		message,
	]);

	const handleAddMethod = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: false,
			},
		});
		setOpenPaymentModal(true);
	};

	const handleClosePaymentModal = () => {
		setOpenPaymentModal(false);
		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: true,
				defaultTab: "form",
			},
		});
	};

	useEffect(() => {
		setTab(defaultTab ?? "start");
	}, [visible, defaultTab]);

	useEffect(() => {
		if (visible) {
			if (subscribeActionType === SubscribeActionType.Subscribe) {
				setSubscription(
					creator.subscriptions.find(
						(el) => el.id === subscribeTierId,
					),
				);
			}
			if (subscribeActionType === SubscribeActionType.Tier) {
				setTier(creator.tiers.find((el) => el.id === subscribeTierId));
			}
			if (subscribeActionType === SubscribeActionType.Bundle) {
				setSubscription(
					creator.subscriptions.find(
						(el) => el.id === subscribeTierId,
					),
				);
				setBundle(
					creator.subscriptions
						.find((el) => el.id === subscribeTierId)
						?.bundles.find((cell) => cell.id === bundleId),
				);
			}
		}
	}, [subscribeActionType, bundleId, subscribeTierId, visible]);

	const showLoading = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: false,
			},
		});
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: ANIMATION_LOADING_DIALOG_ID, show: true },
		});
	};

	const hideLoading = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: ANIMATION_LOADING_DIALOG_ID, show: false },
		});
		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: true,
			},
		});
	};

	const onSubscribe = async () => {
		let subscribeData;

		if (price === 0) {
			subscribeData = await freeSubscribe({
				id: subscribeTierId,
			});
		} else {
			subscribeData = await subscribe({
				id: subscribeTierId,
				bundleId: bundleId,
				customerPaymentProfileId: payment,
			});
		}

		if (checkAccessSubscribedUser) await checkAccessSubscribedUser();

		hideLoading();
		if (subscribeData.ok) {
			handleClose();
			if (onSuccess) onSuccess();
			Toast.show({
				type: "success",
				text1: "Success",
				text2: `You have successfully subscribed to ${creator.displayName}`,
			});
		} else {
			handleSelectPaymentStep();
			hideLoading();
			setError(subscribeData.data.message);
			Toast.show({
				type: "error",
				text1: "Error",
				text2: subscribeData.data.message,
			});
		}
	};

	const onPurchasePost = async () => {
		if (!post) return;

		const purchasePaidPostData = await purchasePaidPost({
			postId: post.id,
			customerPaymentProfileId: payment,
		});
		hideLoading();
		if (purchasePaidPostData.ok) {
			handleClose();
			Toast.show({
				type: "success",
				text1: "Success",
				text2: `You have successfully purchased post from ${creator.displayName}`,
			});
			if (paidPostCallback) paidPostCallback(post.id);
		} else {
			Toast.show({
				type: "error",
				text1: "Error",
				text2: purchasePaidPostData.data.message,
			});
		}
	};

	const onPurchaseChatPost = async () => {
		if (!message) return;

		const purchasePaidPostData = await purchaseChatPaidPost({
			messageId: message.id,
			customerPaymentProfileId: payment,
		});
		hideLoading();
		if (purchasePaidPostData.ok) {
			handleClose();
			Toast.show({
				type: "success",
				text1: "Success",
				text2: `You have successfully purchased post from ${creator.displayName}`,
			});
			if (onSuccess) onSuccess();
		} else {
			Toast.show({
				type: "error",
				text1: "Error",
				text2: purchasePaidPostData.data.message,
			});
		}
	};

	const onPayment = () => {
		if (!payment && price !== 0) {
			Toast.show({
				type: "error",
				text1: "Error",
				text2: "Please select payment method",
			});
			return;
		}
		showLoading();
		setError("");

		switch (subscribeActionType) {
			case SubscribeActionType.Subscribe:
			case SubscribeActionType.Tier:
			case SubscribeActionType.Bundle:
				onSubscribe();
				break;
			case SubscribeActionType.Post:
				onPurchasePost();
				break;
			case SubscribeActionType.ChatPost:
				onPurchaseChatPost();
				break;
			default:
				break;
		}
	};

	const onPaymentButtonClick = () => {
		if (price === 0) {
			onPayment();
		} else {
			handleSelectPaymentStep();
		}
	};

	return (
		<>
			<Modal
				visible={visible}
				onDismiss={handleClose}
				contentContainerStyle={tw.style(
					"rounded-[15px] mx-[18px] md:max-w-150 md:mx-auto md:w-full",
					"bg-fans-white dark:bg-fans-black-1d",
				)}
			>
				{tab === "start" ? (
					<FansView>
						<FansView position="relative">
							<FansView>
								{creator.cover.length === 0 ? (
									<FypLinearGradientView
										colors={["#8a49f1", "#d885ff"]}
										position="relative"
										height={85}
										style={tw.style(
											"rounded-t-[15px] w-full",
										)}
									/>
								) : (
									<Image
										source={{
											uri: cdnURL(creator.cover[0]),
										}}
										resizeMode="cover"
										style={tw.style(
											"rounded-t-[15px] w-full h-[85px]",
										)}
									/>
								)}

								{creator.isNSFW && (
									<FansView
										style={tw.style(
											"absolute top-[17px] left-[17px] rounded-[10px] bg-black bg-opacity-40 h-[20px] pl-[11px] pr-[8px] mr-auto",
										)}
									>
										<FansText
											color={"white"}
											fontSize={13}
											fontFamily="inter-semibold"
											style={tw.style("mt-auto mb-auto")}
										>
											18+ CONTENT
										</FansText>
									</FansView>
								)}
							</FansView>

							<FansIconButton
								size={25}
								backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
								style={tw.style(
									"absolute top-[14px] right-[14px]",
								)}
								onPress={handleClose}
							>
								<FypSvg
									svg={Close2Svg}
									width={10}
									height={10}
									color="fans-white dark:fans-black-1d"
								/>
							</FansIconButton>
						</FansView>
						<FansView
							style={tw.style(
								"px-[15px] pb-5 rounded-b-[15px]",
								"bg-fans-white dark:bg-fans-black-1d",
							)}
						>
							<FansView
								flexDirection="row"
								alignItems="end"
								margin={{ t: -20, b: 22 }}
							>
								<FansView
									width={79}
									height={79}
									borderRadius={79}
									style={tw.style(
										"border-[4px] bg-white bg-fans-black-1d",
										"border-fans-white dark:border-fans-black-1d",
									)}
								>
									<UserAvatar
										image={creator.avatar}
										size="71px"
									/>
								</FansView>
								<FansView margin={{ l: 14 }}>
									<FypText
										fontSize={19}
										lineHeight={26}
										fontWeight={700}
									>
										{creator.displayName}
									</FypText>
									<FypText
										fontSize={16}
										lineHeight={21}
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										{`@${creator.user?.username}`}
									</FypText>
								</FansView>
							</FansView>

							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								style={tw.style("mb-5")}
							>
								Subscription benefits
							</FypText>
							<FansView gap={14} margin={{ b: 24 }}>
								<ListLine
									text="Full access to this creator's content"
									size="lg"
								/>
								<ListLine
									text="Direct message with this creator"
									size="lg"
								/>
								<ListLine
									text="Cancel your subscription at any time"
									size="lg"
								/>
							</FansView>
							{subscribeActionType ===
								SubscribeActionType.Subscribe &&
							subscription ? (
								<SubscriptionButton
									data={subscription}
									onPress={onPaymentButtonClick}
								/>
							) : null}
							{subscribeActionType ===
							SubscribeActionType.Bundle ? (
								<SubscriptionBundle
									title={`${bundle?.month} months (${bundle?.discount}% off)`}
									value={`${getBundlePrice(
										subscription?.price ?? 0,
										bundle?.month ?? 0,
										bundle?.discount ?? 0,
										subscription?.currency ?? "USD",
									)} total`}
									variant="outlined"
									onPress={onPaymentButtonClick}
								/>
							) : null}
							{subscribeActionType ===
							SubscribeActionType.Tier ? (
								<SubscriptionBundle
									title="Subscribe"
									value={`${getPriceString(
										(tier?.price as number) ?? 0,
										tier?.currency ?? "",
									)}/month`}
									variant="contained"
									onPress={onPaymentButtonClick}
								/>
							) : null}
						</FansView>
					</FansView>
				) : (
					<FansView
						position="relative"
						borderRadius={15}
						padding={{ t: 24, x: 18, b: 20 }}
						style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
					>
						<FansIconButton
							size={25}
							backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
							style={tw.style("absolute top-[14px] right-[14px]")}
							onPress={handleClose}
						>
							<FypSvg
								svg={Close1Svg}
								width={9.33}
								height={9.33}
								color="fans-white dark:fans-black-1d"
							/>
						</FansIconButton>
						<FansView style={tw.style("mx-auto")}>
							<UserAvatar image={creator.avatar} size="78px" />
						</FansView>

						<FansDivider style={tw.style("mt-5 mb-4")} />
						<FypText
							fontSize={21}
							lineHeight={28}
							fontWeight={700}
							textAlign="center"
							margin={{ b: 12 }}
						>
							Confirm purchase
						</FypText>
						{subscribeActionType === SubscribeActionType.Post && (
							<FypText
								fontSize={16}
								lineHeight={21}
								textAlign="center"
								margin={{ b: 16 }}
							>
								After purchase you will be redirected to view
								your digital items
							</FypText>
						)}

						<FypText
							fontSize={16}
							lineHeight={21}
							fontWeight={500}
							textAlign="center"
						>
							{freeTrial && freeTrialDays
								? `After ${freeTrialDays} month(s) you will be charged $${total}`
								: `You will be charged $${total}`}
						</FypText>

						<FypText
							fontSize={15}
							lineHeight={20}
							style={tw.style(
								"mb-[25px] text-fans-grey-70 dark:text-fans-grey-b1",
							)}
							textAlign="center"
						>
							${price} + ${platformFee} platform fee + ${vatFee}{" "}
							VAT
						</FypText>

						{discount && discountDays && (
							<FypText
								fontSize={15}
								lineHeight={20}
								style={tw.style(
									"mb-[25px]",
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								After {discountDays} months will renew at normal
								${total} amount.
							</FypText>
						)}

						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={500}
							style={tw.style("mb-[15px]")}
						>
							Payment method
						</FypText>

						<FansView margin={{ b: 20 }}>
							<PaymentMethodDropdown
								value={payment}
								options={paymentMethods}
								handleAddMethod={handleAddMethod}
								onChange={(customerPaymentProfileId) =>
									setPayment(customerPaymentProfileId)
								}
							/>
						</FansView>

						<FansText
							fontSize={12}
							lineHeight={16}
							color="red"
							style={tw.style("mb-5")}
						>
							{error}
						</FansText>
						<RoundButton onPress={onPayment}>
							{freeTrial && freeTrialDays
								? "Start Free Trial"
								: `Pay $${total}`}
						</RoundButton>
					</FansView>
				)}
			</Modal>
			<AddPaymentCardDialog
				visible={openPaymentModal}
				handleClose={handleClosePaymentModal}
				handleToggleModal={setOpenPaymentModal}
			/>
		</>
	);
};

export default SubscribeDialog;
