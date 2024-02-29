import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import {
	FypCollapsible,
	FypCountryDropdown,
	FypText,
} from "@components/common/base";
import CustomRadio from "@components/common/customRadio";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout from "@components/common/layout";
import { FansDivider, FansView } from "@components/controls";
import {
	createPayPalPayoutMethod,
	fetchPayoutMethod,
	updatePayoutMethod,
} from "@helper/endpoints/payout/apis";
import tw from "@lib/tailwind";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RoundButtonType } from "@usertypes/commonEnums";
import {
	ProfileNavigationStacks,
	SettingsReferralProgramNativeStackParams,
} from "@usertypes/navigations";
import { IStripeForm } from "@usertypes/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState, FC } from "react";
import { ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface IBankForm {
	setUpMethod: string;
	isUsCityzen?: boolean;
	paidMethod: string;
	paypalEmail: string;
	cPaypalEmail: string;
	country: string;
}

interface LinkBankAccountTabProps {
	onPayoutMethod: () => void;
	onChangeStripeForm: (name: string, value: string) => void;
	stripeForm: IStripeForm;
	bankForm: IBankForm;
	onChangeBankForm: (
		name: string,
		value: string | boolean | undefined,
	) => void;
}

const LinkBankAccountTab: FC<LinkBankAccountTabProps> = (props) => {
	const {
		onPayoutMethod,
		onChangeStripeForm,
		stripeForm,
		bankForm,
		onChangeBankForm,
	} = props;
	const { id, isGreen = false } = useLocalSearchParams();

	return (
		<FansView>
			<FansView margin={{ b: 24 }}>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={600}
					color="black"
					margin={{ b: 26 }}
				>
					Business status
				</FypText>
				<FansView margin={{ b: 24 }}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 10 }}
					>
						How are you set up?
					</FypText>
					<FansView
						flexDirection="row"
						alignItems="center"
						padding={{ y: 14 }}
					>
						<CustomRadio
							label="I am an individual"
							onPress={() =>
								onChangeBankForm("setUpMethod", "Individual")
							}
							checked={bankForm.setUpMethod === "Individual"}
							bgColor={
								isGreen
									? "bg-fans-green dark:bg-fans-green-29"
									: "bg-fans-purple"
							}
						/>
					</FansView>
					<FansDivider style={tw.style("h-[1px] my-[6px]")} />
					<FansView
						flexDirection="row"
						alignItems="center"
						padding={{ y: 14 }}
					>
						<CustomRadio
							label="I am or represent a corporation"
							onPress={() =>
								onChangeBankForm("setUpMethod", "Corporation")
							}
							checked={bankForm.setUpMethod === "Corporation"}
							bgColor={
								isGreen
									? "bg-fans-green dark:bg-fans-green-29"
									: "bg-fans-purple"
							}
						/>
					</FansView>
				</FansView>

				<FansView>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 10 }}
					>
						What's your citizenship status?
					</FypText>
					<FansView
						flexDirection="row"
						alignItems="center"
						padding={{ y: 14 }}
					>
						<CustomRadio
							label="I am a US citizen or resident"
							onPress={() =>
								onChangeBankForm("isUsCityzen", true)
							}
							checked={!!bankForm.isUsCityzen}
							bgColor={
								isGreen
									? "bg-fans-green dark:bg-fans-green-29"
									: "bg-fans-purple"
							}
						/>
					</FansView>
					<FansDivider style={tw.style("h-[1px] my-[6px]")} />
					<FansView
						flexDirection="row"
						alignItems="center"
						padding={{ y: 14 }}
					>
						<CustomRadio
							label="I am not a US citizen or resident"
							onPress={() =>
								onChangeBankForm("isUsCityzen", false)
							}
							checked={
								!bankForm.isUsCityzen &&
								bankForm.isUsCityzen !== undefined
							}
							bgColor={
								isGreen
									? "bg-fans-green dark:bg-fans-green-29"
									: "bg-fans-purple"
							}
						/>
					</FansView>
				</FansView>
			</FansView>

			<FansView>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={600}
					color="black"
					margin={{ b: 26 }}
				>
					Payout method
				</FypText>
				<FansView margin={{ b: 32 }}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 16 }}
					>
						What's your payout country?
					</FypText>
					<FansView position="relative">
						<FypCountryDropdown
							data={[]}
							value={bankForm.country}
							onSelect={(val) =>
								onChangeBankForm("country", val as string)
							}
						/>
					</FansView>
				</FansView>

				<FansView>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 10 }}
					>
						How would you like to get paid?
					</FypText>

					{/* <View>
										<View style={tw.style("py-[14px]")}>
											<CustomRadio
												label="PayPal"
												onPress={() =>
													setPaidMethod("PayPal")
												}
												checked={
													paidMethod === "PayPal"
												}
												bgColor={
													isGreen
													? "bg-fans-green dark:bg-fans-green-29"
													: "bg-fans-purple"
												}
											/>
										</View>
										<CustomText
											size="base"
											style="text-fans-dark-grey"
										>
											Payout fee is 1% of the amount
											transferred, with a minimum of USD
											$0.25 and a maximum of USD $20{" "}
											<FypLink
												color={
													isGreen
														? "green-4d"
														: "purple-a8"
												}
											>
												Learn more
											</FypLink>
										</CustomText>
										<FypCollapsible
											collapsed={
												paidMethod === "Bank" ||
												paidMethod === "paxum"
											}
										>
											<View
												style={tw.style(
													"pt-5 gap-y-[10px]",
												)}
											>
												<RoundTextInput
													placeholder="PayPal email"
													value={paypalEmail}
													onChangeText={(val) =>
														setPaypalEmail(val)
													}
												/>
												<RoundTextInput
													placeholder="Confirm PayPal email"
													value={cPaypalEmail}
													onChangeText={(val) =>
														setCPaypalEmail(val)
													}
												/>
											</View>
										</FypCollapsible>
									</View> */}

					{/* <FansDivider
										style={tw.style(
											"h-[1px] mt-5 mb-[6px]",
										)}
									/> */}

					<FansView>
						<FansView padding={{ y: 14 }}>
							<CustomRadio
								label="Direct Bank via Bank Account"
								onPress={() =>
									onChangeBankForm("paidMethod", "Bank")
								}
								checked={bankForm.paidMethod === "Bank"}
								bgColor={
									isGreen
										? "bg-fans-green dark:bg-fans-green-29"
										: "bg-fans-purple"
								}
							/>
						</FansView>
						<FypText fontSize={16} lineHeight={21} color="grey-70">
							1% currency conversion fee + 1% platform fee
						</FypText>
						<FansView flexDirection="row">
							<Button
								style={tw.style("m-0")}
								labelStyle={tw.style(
									"text-fans-purple text-base leading-[21px] m-0",
								)}
							>
								Learn more
							</Button>
						</FansView>
						<FypCollapsible
							collapsed={
								bankForm.paidMethod === "paypal" ||
								bankForm.paidMethod === "paxum"
							}
						>
							<FansView padding={{ y: 16 }}>
								<FansView margin={{ b: 20 }}>
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										color="black"
										margin={{ b: 16 }}
									>
										Name
									</FypText>
									<RoundTextInput
										placeholder="First name"
										value={stripeForm.firstName}
										onChangeText={(val) =>
											onChangeStripeForm("firstName", val)
										}
										customStyles="mb-[10px]"
										maxLength={50}
									/>
									<RoundTextInput
										placeholder="Last name"
										value={stripeForm.lastName}
										onChangeText={(val) =>
											onChangeStripeForm("lastName", val)
										}
										maxLength={50}
									/>
								</FansView>

								<FansView margin={{ b: 20 }}>
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										color="black"
										margin={{ b: 16 }}
									>
										Address
									</FypText>
									<RoundTextInput
										placeholder="Street Address 1"
										value={stripeForm.address1}
										onChangeText={(val) =>
											onChangeStripeForm("address1", val)
										}
										maxLength={100}
										customStyles="mb-[10px]"
									/>
									<RoundTextInput
										placeholder="Street Address 2"
										value={stripeForm.address2}
										onChangeText={(val) =>
											onChangeStripeForm("address2", val)
										}
										maxLength={100}
										customStyles="mb-[10px]"
									/>
									<RoundTextInput
										placeholder="City"
										value={stripeForm.city}
										onChangeText={(val) =>
											onChangeStripeForm("city", val)
										}
										maxLength={100}
										customStyles="mb-[10px]"
									/>
									<RoundTextInput
										placeholder="State"
										value={stripeForm.state}
										onChangeText={(val) =>
											onChangeStripeForm("state", val)
										}
										maxLength={100}
										customStyles="mb-[10px]"
									/>
									<RoundTextInput
										placeholder="ZIP"
										value={stripeForm.zip}
										onChangeText={(val) =>
											onChangeStripeForm("zip", val)
										}
										maxLength={20}
									/>
								</FansView>

								{/* <View style={tw.style("mb-5")}>
													<CustomText
														size="lg"
														style="text-black mb-4"
													>
														Birth date
													</CustomText>
												</View> */}

								<FansView margin={{ b: 20 }}>
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										color="black"
										margin={{ b: 16 }}
									>
										Bank information
									</FypText>
									<FansView margin={{ b: 15 }}>
										<FormControl
											label="Bank routing number"
											placeholder="Bank routing number"
											value={stripeForm.bankRoutingNumber}
											onChangeText={(val: string) =>
												onChangeStripeForm(
													"bankRoutingNumber",
													val,
												)
											}
											maxLength={100}
										/>
									</FansView>
									<FansView margin={{ b: 15 }}>
										<FormControl
											label="Bank account number"
											placeholder="Bank account number"
											value={stripeForm.bankAccountNumber}
											onChangeText={(val: string) =>
												onChangeStripeForm(
													"bankAccountNumber",
													val,
												)
											}
											maxLength={100}
										/>
									</FansView>
								</FansView>
							</FansView>
						</FypCollapsible>
					</FansView>

					{/* <FansDivider
													style={tw.style(
														"bg-fans-grey mt-6 mb-[6px]",
													)}
												/> */}

					{/* <View
													style={tw.style(
														"py-[14px] mb-5",
													)}
												>
													<CustomRadio
														label="Paxum (for + 18 creators)"
														onPress={() =>
															setPaidMethod(
																"paxum",
															)
														}
														checked={
															paidMethod ===
															"paxum"
														}
														bgColor={isGreen ? "fans-green" : "fans-purple" }
													/>
												</View> */}

					<RoundButton
						onPress={onPayoutMethod}
						variant={
							isGreen
								? RoundButtonType.SECONDARY
								: RoundButtonType.PRIMARY
						}
					>
						{id ? "Edit payout method" : "Add payout method"}
					</RoundButton>
					<Button
						labelStyle={tw.style(
							`text-${
								isGreen ? "fans-green" : "fans-purple"
							} text-[17px]`,
						)}
					>
						Cancel
					</Button>
				</FansView>
			</FansView>
		</FansView>
	);
};

const PayoutSetupScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<
				| ProfileNavigationStacks
				| SettingsReferralProgramNativeStackParams
			>
		>();
	const { id, isGreen = false } = useLocalSearchParams();
	const insets = useSafeAreaInsets();

	const [bankForm, setBankForm] = useState<IBankForm>({
		setUpMethod: "",
		isUsCityzen: undefined,
		paidMethod: "Bank",
		paypalEmail: "",
		cPaypalEmail: "",
		country: "US",
	});
	const [stripeForm, setStripeForm] = useState<IStripeForm>({
		firstName: "",
		lastName: "",
		address1: "",
		address2: "",
		city: "",
		state: "",
		zip: "",
		bankRoutingNumber: "",
		bankAccountNumber: "",
	});

	useEffect(() => {
		const fetchPayoutMethodData = async () => {
			try {
				if (!id) return;

				const response = await fetchPayoutMethod(
					{ id: id as string },
					{ id: id as string },
				);

				if (response.ok) {
					setBankForm({
						setUpMethod: response.data.entityType,
						isUsCityzen: response.data.usCitizenOrResident,
						country: response.data.country,
						paidMethod: response.data.provider,
						paypalEmail: response.data.paypalEmail || "",
						cPaypalEmail: response.data.paypalEmail || "",
					});
					if (response.data.bankInfo) {
						setStripeForm(response.data.bankInfo);
					}
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not fetch payout method",
				});
			}
		};

		fetchPayoutMethodData();
	}, []);

	const onChangeStripeForm = (name: string, value: string) => {
		setStripeForm({
			...stripeForm,
			[name]: value,
		});
	};

	const onPaypalPayoutMethod = async () => {
		if (!bankForm.paypalEmail) {
			Toast.show({
				type: "error",
				text1: "PayPal email is required.",
			});
			return;
		}

		if (bankForm.paypalEmail !== bankForm.cPaypalEmail) {
			Toast.show({
				type: "error",
				text1: "PayPal emails do not match.",
			});
			return;
		}

		if (id) {
			try {
				const response = await updatePayoutMethod(
					{
						paypalEmail: bankForm.paypalEmail,
						country: bankForm.country,
						entityType: bankForm.setUpMethod,
						usCitizenOrResident: !!bankForm.isUsCityzen,
					},
					{ id: id as string },
				);

				if (response.ok) {
					Toast.show({
						type: "success",
						text1: "PayPal payout method updated",
					});
					navigation.navigate("GetPaid", { refresh: true });
				} else {
					Toast.show({
						type: "error",
						text1: response.data.message,
					});
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not update PayPal payout method",
				});
			}
		} else {
			try {
				const response = await createPayPalPayoutMethod({
					paypalEmail: bankForm.paypalEmail,
					country: bankForm.country,
					entityType: bankForm.setUpMethod,
					usCitizenOrResident: !!bankForm.isUsCityzen,
				});

				if (response.ok) {
					Toast.show({
						type: "success",
						text1: "PayPal payout method added",
					});
					navigation.navigate("GetPaid", { refresh: true });
				} else {
					Toast.show({
						type: "error",
						text1: response.data.message,
					});
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not add PayPal payout method",
				});
			}
		}
	};

	const onDepositPayoutMethod = async () => {
		if (!stripeForm.firstName) {
			Toast.show({
				type: "error",
				text1: "First name is required.",
			});
			return;
		}

		if (!stripeForm.lastName) {
			Toast.show({
				type: "error",
				text1: "Last name is required.",
			});
			return;
		}

		if (!stripeForm.address1) {
			Toast.show({
				type: "error",
				text1: "Address 1 is required.",
			});
			return;
		}

		if (!stripeForm.city) {
			Toast.show({
				type: "error",
				text1: "City is required.",
			});
			return;
		}

		if (!stripeForm.state) {
			Toast.show({
				type: "error",
				text1: "State is required.",
			});
			return;
		}

		if (!stripeForm.zip) {
			Toast.show({
				type: "error",
				text1: "ZIP is required.",
			});
			return;
		}

		if (!stripeForm.bankRoutingNumber) {
			Toast.show({
				type: "error",
				text1: "Bank routing number is required.",
			});
			return;
		}

		if (!stripeForm.bankAccountNumber) {
			Toast.show({
				type: "error",
				text1: "Bank account number is required.",
			});
			return;
		}

		if (id) {
			try {
				const response = await updatePayoutMethod(
					{
						bankInfo: stripeForm,
						country: bankForm.country,
						entityType: bankForm.setUpMethod,
						usCitizenOrResident: !!bankForm.isUsCityzen,
					},
					{ id: id as string },
				);

				if (response.ok) {
					Toast.show({
						type: "success",
						text1: "Bank payout method updated",
					});
					navigation.navigate("GetPaid", { refresh: true });
				} else {
					Toast.show({
						type: "error",
						text1: response.data.message,
					});
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not update PayPal payout method",
				});
			}
		} else {
			try {
				const response = await createPayPalPayoutMethod({
					bankInfo: stripeForm,
					country: bankForm.country,
					entityType: bankForm.setUpMethod,
					usCitizenOrResident: !!bankForm.isUsCityzen,
				});

				if (response.ok) {
					Toast.show({
						type: "success",
						text1: "Bank payout method added",
					});
					navigation.navigate("GetPaid", { refresh: true });
				} else {
					Toast.show({
						type: "error",
						text1: response.data.message,
					});
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not add Bank payout method",
				});
			}
		}
	};

	const onPayoutMethod = async () => {
		if (bankForm.setUpMethod === "") {
			Toast.show({
				type: "error",
				text1: "Set up must select.",
			});
			return;
		}
		if (bankForm.isUsCityzen === undefined) {
			Toast.show({
				type: "error",
				text1: "Your citizenship must select.",
			});
			return;
		}
		if (bankForm.isUsCityzen && bankForm.country !== "US") {
			Toast.show({
				type: "error",
				text1: "US citizens must select 'US' as their country.",
			});
			return;
		}

		if (!bankForm.isUsCityzen && bankForm.country === "US") {
			Toast.show({
				type: "error",
				text1: "Only US citizens or residents can select 'US' as their country.",
			});
			return;
		}

		switch (bankForm.paidMethod) {
			case "PayPal":
				onPaypalPayoutMethod();
				break;
			case "Bank":
				onDepositPayoutMethod();
				break;
		}
	};

	const onChangeBankForm = (
		name: string,
		value: string | boolean | undefined,
	) => {
		setBankForm({
			...bankForm,
			[name]: value,
		});
	};

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<FansView flex="1">
				<ScrollView style={tw.style("flex-1")}>
					<CustomTopNavBar
						title="Payout setup"
						onClickLeft={() => navigation.goBack()}
						onClickRight={onPayoutMethod}
						rightLabel="Add"
						rightLabelColor={isGreen ? "fans-green" : "fans-purple"}
					/>
					<FansView padding={{ x: 18, t: 24, b: insets.bottom + 35 }}>
						<LinkBankAccountTab
							stripeForm={stripeForm}
							onChangeStripeForm={onChangeStripeForm}
							bankForm={bankForm}
							onChangeBankForm={onChangeBankForm}
							onPayoutMethod={onPayoutMethod}
						/>
					</FansView>
				</ScrollView>
			</FansView>
		</AppLayout>
	);
};

export default PayoutSetupScreen;
