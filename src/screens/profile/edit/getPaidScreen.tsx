import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import { FypCollapsible, FypText } from "@components/common/base";
import CardActions from "@components/common/cardActions";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import PaymentMethod from "@components/common/paymentMethod";
import { FansDivider, FansText, FansView } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import {
	deletePayoutMethod,
	executePayout,
	fetchPayoutPaymentMethods,
	fetchPayoutSchedule,
	updatePayoutSchedule,
} from "@helper/endpoints/payout/apis";
import tw from "@lib/tailwind";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
	IconTypes,
	PaymentMethodType,
	RoundButtonType,
} from "@usertypes/commonEnums";
import { SettingsReferralProgramNativeStackParams } from "@usertypes/navigations";
import { ICardAction, PayPalPayoutMethod } from "@usertypes/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const GetPaidScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SettingsReferralProgramNativeStackParams>
		>();

	const { isGreen = false, refresh = false } = useLocalSearchParams();
	const { state, dispatch } = useAppContext();
	const { profile, user } = state;
	const { userInfo } = user;
	const insets = useSafeAreaInsets();

	const [autoPayouts, setAutoPayouts] = useState(false);
	const [price, setPrice] = useState<number | undefined>();
	const [paymentMethods, setPaymentMethods] = useState<PayPalPayoutMethod[]>(
		[],
	);
	const [openPaymentMethodActions, setOpenPaymentMethodActions] =
		useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
	const [inProgress, setInProgress] = useState(false);
	const [maxPayout, setMaxPayout] = useState(0);
	const [totalPayoutAmount, setTotalPayoutAmount] = useState(0);

	useEffect(() => {
		const getPayoutSchedule = async () => {
			const paymentMethodsData = await fetchPayoutSchedule();
			if (paymentMethodsData.ok) {
				setAutoPayouts(paymentMethodsData.data.mode === "Automatic");
				setPrice(paymentMethodsData.data.threshold);
				setMaxPayout(paymentMethodsData.data.maxPayout);
				setTotalPayoutAmount(paymentMethodsData.data.totalPayoutAmount);
			}
		};
		getPayoutSchedule();

		const getPaymentMethods = async () => {
			const paymentMethodsData = await fetchPayoutPaymentMethods();
			if (paymentMethodsData.ok) {
				setPaymentMethods(paymentMethodsData.data);
			}
		};
		getPaymentMethods();
	}, [refresh]);

	useEffect(() => {
		updatePayoutSchedule({
			mode: autoPayouts ? "Automatic" : "Manual",
			threshold: autoPayouts ? price : undefined,
		});
	}, [autoPayouts, price]);

	const onExecutePayout = async () => {
		setInProgress(true);
		try {
			const response = await executePayout();
			if (response.ok) {
				dispatch.fetchUserInfo();
				Toast.show({
					type: "success",
					text1: "Your payout request has been sent",
				});
			} else {
				Toast.show({
					type: "error",
					text1: response.data.message,
				});
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Failed to send payout request",
			});
		}
		setInProgress(false);
	};

	const handleOpenPostMethodActions = (id: string) => {
		setOpenPaymentMethodActions(true);
		setSelectedPaymentMethod(id);
	};

	const onEditPaymentMethod = () => {
		setOpenPaymentMethodActions(false);
		navigation.navigate("PayoutSetup", {
			id: selectedPaymentMethod,
		});
	};
	const onDeletePaymentMethod = async () => {
		setOpenPaymentMethodActions(false);
		setInProgress(true);
		try {
			const response = await deletePayoutMethod(
				{
					id: selectedPaymentMethod,
				},
				{
					id: selectedPaymentMethod,
				},
			);

			if (response.ok) {
				Toast.show({
					type: "success",
					text1: "Payment method deleted",
				});
				setPaymentMethods(
					paymentMethods.filter(
						(method) => method.id !== selectedPaymentMethod,
					),
				);
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Failed to delete payment method",
			});
		}
		setInProgress(false);
	};

	const paymentActions: ICardAction[] = [
		{
			title: "Edit",
			iconType: IconTypes.Edit,
			onClick: onEditPaymentMethod,
		},
		{
			title: "Delete",
			iconType: IconTypes.Cancel,
			iconColor: "#eb2121",
			onClick: onDeletePaymentMethod,
			labelClass: "text-fans-red",
		},
	];

	const onClickAgeVerify = () => {
		//todo: add age verify
	};

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<View style={tw.style("flex-1")}>
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer>
						<CustomTopNavBar
							title="Getting paid"
							onClickLeft={() => navigation.goBack()}
							onClickRight={onExecutePayout}
							rightLabel="Save"
							rightLabelColor={
								isGreen ? "fans-green" : "fans-purple"
							}
							loading={inProgress}
						/>
						<View
							style={[
								{
									paddingBottom: insets.bottom + 35,
								},
								tw.style("px-[18px] pt-6"),
							]}
						>
							<View
								style={[
									tw.style(
										"rounded-[15px] pt-7 pb-4 px-4.5 mt-5 mb-7.5",
									),
									{
										shadowColor: tw.prefixMatch("dark")
											? "rgba(255,255,255,0.16)"
											: "rgba(0,0,0,0.16)",
										shadowOffset: {
											width: 0,
											height: 3,
										},
										shadowRadius: 6,
									},
								]}
							>
								<View
									style={tw.style(
										"flex-row items-center mb-5.5",
									)}
								>
									<Image
										source={require("@assets/images/payment-balance.png")}
										style={tw.style(
											"w-[70.6px] h-[65.31px]",
										)}
										resizeMode="cover"
									/>
									<View style={tw.style("ml-4.5")}>
										<FansText
											fontSize={23}
											lineHeight={31}
											style={tw.style(
												"font-semibold mb-1.5",
												"text-fans-black dark:text-fans-white",
											)}
										>
											Your balance
										</FansText>
										<FansText
											fontSize={23}
											lineHeight={31}
											style={tw.style(
												"font-semibold",
												"text-fans-black dark:text-fans-white",
											)}
										>
											${userInfo.payoutBalance}
										</FansText>
									</View>
								</View>
								{paymentMethods.length > 0 && (
									// maxPayout !== 0 &&
									// totalPayoutAmount < maxPayout &&
									<RoundButton
										variant={
											RoundButtonType.OUTLINE_SECONDARY
										}
										onPress={onExecutePayout}
									>
										Payout
									</RoundButton>
								)}
							</View>

							{/* {maxPayout === 0 && (
									<FansView
										style={tw.style(
											"bg-fans-purple/10 mb-4",
										)}
										padding={20}
										borderRadius={15}
									>
										<FansText
											color="purple"
											fontFamily="inter-medium"
											fontSize={13}
										>
											ⓘ We manually verify new accounts
											before allowing access to payouts.
											This should not take longer than 24
											hours.
										</FansText>
									</FansView>
								)} */}

							{maxPayout !== 0 &&
								totalPayoutAmount >= maxPayout && (
									<FansView
										style={tw.style(
											"bg-fans-purple/10 mb-4",
										)}
										padding={20}
										borderRadius={15}
									>
										<FansText
											color="purple"
											fontFamily="inter-medium"
											fontSize={13}
										>
											ⓘ We have temporarily frozen your
											payouts. We will quickly manually
											review your account.
										</FansText>
									</FansView>
								)}

							<FypText
								fontSize={16}
								lineHeight={21}
								margin={{ b: 12 }}
								style={tw.style(
									"text-fans-dark-grey dark:text-fans-grey-43",
								)}
							>
								Fee Schedule: Platform fee: 7% of the income you
								earn on FYP.Fans Plus 3% + .30 Processing Fee{" "}
								<FypText
									fontSize={16}
									lineHeight={21}
									margin={{ b: 12 }}
									style={tw.style(
										"text-fans-dark-grey dark:text-fans-grey-43",
									)}
									fontWeight={700}
								>
									Minimum Payout: $20
								</FypText>
							</FypText>

							<FypText
								fontSize={16}
								lineHeight={21}
								margin={{ b: 28 }}
								style={tw.style(
									"text-fans-dark-grey dark:text-fans-grey-43",
								)}
							>
								When setting tiers and receiving payments, you
								will be using USD. Your fans will see the prices
								in their local currencies. In case FYP.Fans does
								not support a fan's currency, they will view
								your prices in USD
							</FypText>

							<View style={tw.style("mb-3")}>
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={600}
									margin={{ b: 12 }}
									style={tw.style(
										"text-fans-black dark:text-fans-white",
									)}
								>
									Payout settings
								</FypText>
								<FypText
									fontSize={16}
									lineHeight={21}
									style={tw.style(
										"text-fans-dark-grey dark:text-fans-grey-43",
									)}
								>
									Edit your payout settings, including how
									you'd like to get paid and your tax
									information.
								</FypText>
							</View>

							{/* {!(
								profile.ageVerifyId &&
								profile.ageVerifyStatus === "APPROVED"
							) && (
								<View
									style={tw.style(
										"bg-fans-purple py-[18px] px-5 rounded-[15px] mb-10",
									)}
								>
									<View
										style={tw.style(
											"flex-row items-center justify-center",
										)}
									>
										<OutlinedInfoSvg
											width={14.3}
											height={14.3}
											style={tw.style("mr-2")}
										/>
										<Text
											style={tw.style(
												"text-white text-base leading-[21px] font-normal",
											)}
										>
											We need to verify you're 18 or
											older.
										</Text>
									</View>

									<Text
										style={tw.style(
											"text-white text-base leading-[21px] text-center font-normal",
										)}
									>
										Please allow access to your camera
									</Text>

									<View
										style={tw.style(
											"w-[170px] mx-auto mt-3",
										)}
									>
										<RoundButton
											id="verify-age-button"
											variant={
												RoundButtonType.CONTAINED_WHITE
											}
											onPress={onClickAgeVerify}
										>
											Verify
										</RoundButton>
									</View>
								</View>
							)} */}

							{/* <View
									style={tw.style(
										"flex-row items-center justify-between h-13 items-center mb-3",
									)}
								>
									<CustomText size="lg" style="text-black">
										Auto payouts
									</CustomText>

									<FypSwitch
										value={autoPayouts}
										onValueChange={(val) =>
											setAutoPayouts(val)
										}
										primary={!isGreen}
									/>
								</View> */}

							<FypCollapsible collapsed={!autoPayouts}>
								<RoundTextInput
									placeholder="Input threshold for payout"
									customStyles="mb-4"
									value={price?.toString()}
									onChangeText={(val) =>
										setPrice(Number(val))
									}
									keyboardType="numeric"
								/>
							</FypCollapsible>

							{paymentMethods.length > 0 && (
								// maxPayout !== 0 &&
								// totalPayoutAmount < maxPayout &&

								<View style={tw.style("mb-4")}>
									<RoundButton
										variant={
											isGreen
												? RoundButtonType.SECONDARY
												: RoundButtonType.PRIMARY
										}
										onPress={onExecutePayout}
									>
										Request payout
									</RoundButton>
								</View>
							)}

							{paymentMethods.length === 0 && (
								<RoundButton
									variant={
										isGreen
											? RoundButtonType.SECONDARY
											: RoundButtonType.PRIMARY
									}
									onPress={() => {
										navigation.navigate("PayoutSetup");
									}}
								>
									Add payout method
								</RoundButton>
							)}

							<View style={tw.style("mt-10")}>
								{paymentMethods && paymentMethods[0] && (
									<View style={tw.style("mb-12")}>
										<FansText
											fontSize={17}
											lineHeight={22}
											style={tw.style(
												"font-semibold mb-7",
												"text-fans-black dark:text-fans-white",
											)}
										>
											Default
										</FansText>
										<PaymentMethod
											key={paymentMethods[0].id}
											title={paymentMethods[0].provider}
											paymentInformation={
												// paymentMethods[0]
												// 	.provider === "PayPal"
												// 	? paymentMethods[0]
												// 			.paypalEmail!
												// 	: ""
												paymentMethods[0].bankInfo
													?.bankAccountNumber || ""
											}
											paymentMethodType={
												PaymentMethodType[
													paymentMethods[0]
														.provider as keyof typeof PaymentMethodType
												]
											}
											onClickDots={() =>
												handleOpenPostMethodActions(
													paymentMethods[0].id,
												)
											}
										/>
									</View>
								)}
								<View style={tw.style("mb-12")}>
									{paymentMethods &&
										paymentMethods.length > 1 && (
											<FansText
												fontSize={17}
												lineHeight={22}
												style={tw.style(
													"font-semibold mb-7",
													"text-fans-black dark:text-fans-white",
												)}
											>
												Backup
											</FansText>
										)}
									{paymentMethods &&
										paymentMethods
											.slice(1)
											.map((method, index) => (
												<>
													<PaymentMethod
														key={method.id}
														title={method.provider}
														paymentInformation={
															// method.provider ===
															// "PayPal"
															// 	? method.paypalEmail!
															// 	: ""
															method.bankInfo
																?.bankAccountNumber ||
															""
														}
														paymentMethodType={
															PaymentMethodType[
																method.provider as keyof typeof PaymentMethodType
															]
														}
														onClickDots={() =>
															handleOpenPostMethodActions(
																method.id,
															)
														}
													/>
													<FansDivider
														style={tw.style("my-4")}
													/>
												</>
											))}
								</View>
							</View>
						</View>
					</LayoutContentsContainer>
				</ScrollView>
			</View>
			<CardActions
				open={openPaymentMethodActions}
				onClose={() => setOpenPaymentMethodActions(false)}
				actions={paymentActions}
			/>
		</AppLayout>
	);
};

export default GetPaidScreen;
