import { ChevronLeft1Svg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import {
	FypCollapsible,
	FypCountryDropdown,
	FypText,
} from "@components/common/base";
import CustomRadio from "@components/common/customRadio";
import {
	FansDivider,
	FansGap,
	FansScreen3,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import {
	createOrUpdatePayoutMethod,
	fetchPayoutMethodById,
	updatePayoutMethod,
} from "@helper/endpoints/payout/apis";
import tw from "@lib/tailwind";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ReferralProgramNativeStackParams } from "@usertypes/navigations";
import { IStripeForm } from "@usertypes/types";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const ReferCreatorsPayoutSetupScreen = () => {
	const router = useRouter();
	const featureGates = useFeatureGates();
	if (!featureGates.has("2023_11-referral-links")) {
		router.replace("/posts");
		return <></>;
	}

	const navigation =
		useNavigation<
			NativeStackNavigationProp<ReferralProgramNativeStackParams>
		>();

	const onHandleBack = () => {
		if (navigation.canGoBack()) {
			navigation.goBack();
		} else {
			if (router.canGoBack()) {
				router.back();
			} else {
				router.replace({
					pathname: "posts",
					params: { screen: "Home" },
				});
			}
		}
	};

	const { id, isGreen = false } = useLocalSearchParams();
	const insets = useSafeAreaInsets();

	const [entityType, setEntityType] = useState("Individual");
	const [isUsCityzen, setIsUsCityzen] = useState(true);

	const [paidMethod, setPaidMethod] = useState("PayPal");
	const [paypalEmail, setPaypalEmail] = useState("");
	const [cPaypalEmail, setCPaypalEmail] = useState("");
	const [country, setCountry] = useState("US");

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

				const response = await fetchPayoutMethodById(
					{ id: id as string },
					{ id: id as string },
				);

				if (response.ok) {
					setEntityType(response.data.entityType);
					setIsUsCityzen(response.data.usCitizenOrResident);
					setCountry(response.data.country);
					setPaidMethod(response.data.provider);
					setPaypalEmail(response.data.paypalEmail || "");
					setCPaypalEmail(response.data.paypalEmail || "");
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
		if (!paypalEmail) {
			Toast.show({
				type: "error",
				text1: "PayPal email is required.",
			});
			return;
		}

		if (paypalEmail !== cPaypalEmail) {
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
						country: country,
						state: "",
						city: "",
						street: "",
						zip: "",
						payoutMethod: "PayPal",
						entityType: entityType,
						usCitizenOrResident: isUsCityzen,
						paypalEmail: paypalEmail,
					},
					{ id: id as string },
				);

				if (response.ok) {
					Toast.show({
						type: "success",
						text1: "PayPal payout method updated",
					});
					navigation.navigate("GetPaid");
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not update PayPal payout method",
				});
			}
		} else {
			try {
				const response = await createOrUpdatePayoutMethod({
					country: country,
					state: "",
					city: "",
					street: "",
					zip: "",
					payoutMethod: "PayPal",
					entityType: entityType,
					usCitizenOrResident: isUsCityzen,
					paypalEmail: paypalEmail,
				});

				if (response.ok) {
					Toast.show({
						type: "success",
						text1: "PayPal payout method added",
					});
					navigation.navigate("GetPaid");
				}
			} catch (error) {
				Toast.show({
					type: "error",
					text1: "Could not add PayPal payout method",
				});
			}
		}
	};

	const onPayoutMethod = async () => {
		if (isUsCityzen && country !== "US") {
			Toast.show({
				type: "error",
				text1: "US citizens must select 'US' as their country.",
			});
			return;
		}

		if (!isUsCityzen && country === "US") {
			Toast.show({
				type: "error",
				text1: "Only US citizens or residents can select 'US' as their country.",
			});
			return;
		}

		switch (paidMethod) {
			case "PayPal":
				onPaypalPayoutMethod();
				break;
		}
	};

	return (
		<View style={tw.style("flex-1 bg-white")}>
			<FansView
				height={{ xs: 64, lg: 103 }}
				alignItems="center"
				backgroundColor="white"
				border={{ b: 1 }}
				borderColor="grey-f0"
				flexDirection="row"
				padding={{ x: 24 }}
			>
				<FansView
					touchableOpacityProps={{ onPress: onHandleBack }}
					width={40}
					height={40}
					padding={{ x: 4, y: 12 }}
				>
					<FansSvg
						width={8}
						height={16}
						svg={ChevronLeft1Svg}
						color1="grey-70"
					/>
				</FansView>
				<FansGap viewStyle={{ flex: "1" }} />
				<FansText fontFamily="inter-bold" fontSize={19}>
					Payout setup
				</FansText>
				<FansGap viewStyle={{ flex: "1" }} />
				<FansGap width={40} />

				<Button
					labelStyle={tw.style(
						"text-fans-green text-[17px] font-inter-bold",
					)}
					style={{
						position: "absolute",
						right: 0,
					}}
					onPress={() => navigation.navigate("AddPaymentMethod")}
				>
					Add
				</Button>
			</FansView>

			<FansScreen3 contentStyle1={{ maxWidth: { lg: 670 } }}>
				<View
					style={[
						{
							paddingBottom: insets.bottom + 35,
						},
						tw.style("px-[18px] pt-6"),
					]}
				>
					<View style={tw.style("mb-6")}>
						<FypText
							fontSize={19}
							lineHeight={26}
							fontWeight={600}
							color="black"
							margin={{ b: 26 }}
						>
							Business status
						</FypText>
						<View style={tw.style("mb-6")}>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								margin={{ b: 10 }}
							>
								How are you set up?
							</FypText>
							<View
								style={tw.style(
									"flex-row items-center py-[14px]",
								)}
							>
								<CustomRadio
									label="I am an individual"
									onPress={() => setEntityType("Individual")}
									checked={entityType === "Individual"}
									bgColor={
										isGreen ? "fans-green" : "fans-purple"
									}
								/>
							</View>
							<FansDivider style={tw.style("h-[1px] my-[6px]")} />
							<View
								style={tw.style(
									"flex-row items-center py-[14px]",
								)}
							>
								<CustomRadio
									label="I am or represent a corporation"
									onPress={() => setEntityType("Corporation")}
									checked={entityType === "Corporation"}
									bgColor={
										isGreen
											? "bg-fans-green dark:bg-fans-green-29"
											: "bg-fans-purple"
									}
								/>
							</View>
						</View>

						<View>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								margin={{ b: 10 }}
							>
								What's your citizenship status?
							</FypText>
							<View
								style={tw.style(
									"flex-row items-center py-[14px]",
								)}
							>
								<CustomRadio
									label="I am a US citizen or resident"
									onPress={() => setIsUsCityzen(true)}
									checked={!!isUsCityzen}
									bgColor={
										isGreen
											? "bg-fans-green dark:bg-fans-green-29"
											: "bg-fans-purple"
									}
								/>
							</View>
							<FansDivider style={tw.style("h-[1px] my-[6px]")} />
							<View
								style={tw.style(
									"flex-row items-center py-[14px]",
								)}
							>
								<CustomRadio
									label="I am not a US citizen or resident"
									onPress={() => setIsUsCityzen(false)}
									checked={
										!isUsCityzen &&
										isUsCityzen !== undefined
									}
									bgColor={
										isGreen
											? "bg-fans-green dark:bg-fans-green-29"
											: "bg-fans-purple"
									}
								/>
							</View>
						</View>
					</View>

					<View>
						<FypText
							fontSize={19}
							lineHeight={26}
							fontWeight={600}
							color="black"
							margin={{ b: 26 }}
						>
							Payout method
						</FypText>
						<View style={tw.style("mb-8")}>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								margin={{ b: 16 }}
							>
								What's your payout country?
							</FypText>
							<View style={tw.style("relative")}>
								<FypCountryDropdown
									data={[]}
									value={country}
									onSelect={(val) =>
										setCountry(val as string)
									}
								/>
							</View>
						</View>

						<View>
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

							<View>
								<View style={tw.style("py-[14px]")}>
									<CustomRadio
										label="Direct Bank via Bank Account"
										onPress={() => setPaidMethod("Bank")}
										checked={paidMethod === "Bank"}
										bgColor={
											isGreen
												? "bg-fans-green dark:bg-fans-green-29"
												: "bg-fans-purple"
										}
									/>
								</View>
								<FypText
									fontSize={16}
									lineHeight={21}
									color="grey-70"
								>
									1% currency conversion fee + 1% platform fee
								</FypText>
								<View style={tw.style("flex-row")}>
									<Button
										style={tw.style("m-0")}
										labelStyle={tw.style(
											"text-fans-purple text-base leading-[21px] m-0",
										)}
									>
										Learn more
									</Button>
								</View>
								<FypCollapsible
									collapsed={
										paidMethod === "paypal" ||
										paidMethod === "paxum"
									}
								>
									<View style={tw.style("pt-4")}>
										<View style={tw.style("mb-5")}>
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
													onChangeStripeForm(
														"firstName",
														val,
													)
												}
												customStyles="mb-[10px]"
												maxLength={50}
											/>
											<RoundTextInput
												placeholder="Last name"
												value={stripeForm.lastName}
												onChangeText={(val) =>
													onChangeStripeForm(
														"lastName",
														val,
													)
												}
												maxLength={50}
											/>
										</View>

										<View style={tw.style("mb-5")}>
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
													onChangeStripeForm(
														"address1",
														val,
													)
												}
												maxLength={100}
												customStyles="mb-[10px]"
											/>
											<RoundTextInput
												placeholder="Street Address 2"
												value={stripeForm.address2}
												onChangeText={(val) =>
													onChangeStripeForm(
														"address2",
														val,
													)
												}
												maxLength={100}
												customStyles="mb-[10px]"
											/>
											<RoundTextInput
												placeholder="City"
												value={stripeForm.city}
												onChangeText={(val) =>
													onChangeStripeForm(
														"city",
														val,
													)
												}
												maxLength={100}
												customStyles="mb-[10px]"
											/>
											<RoundTextInput
												placeholder="State"
												value={stripeForm.state}
												onChangeText={(val) =>
													onChangeStripeForm(
														"state",
														val,
													)
												}
												maxLength={100}
												customStyles="mb-[10px]"
											/>
											<RoundTextInput
												placeholder="ZIP"
												value={stripeForm.zip}
												onChangeText={(val) =>
													onChangeStripeForm(
														"zip",
														val,
													)
												}
												maxLength={20}
											/>
										</View>

										{/* <View style={tw.style("mb-5")}>
													<CustomText
														size="lg"
														style="text-black mb-4"
													>
														Birth date
													</CustomText>
												</View> */}

										<View style={tw.style("mb-5")}>
											<FypText
												fontSize={17}
												lineHeight={22}
												fontWeight={600}
												color="black"
												margin={{ b: 16 }}
											>
												Bank information
											</FypText>
											<RoundTextInput
												placeholder="Bank routing number"
												value={
													stripeForm.bankRoutingNumber
												}
												onChangeText={(val) =>
													onChangeStripeForm(
														"bankRoutingNumber",
														val,
													)
												}
												customStyles="mb-[10px]"
												maxLength={100}
											/>
											<RoundTextInput
												placeholder="Bank account number"
												value={
													stripeForm.bankAccountNumber
												}
												onChangeText={(val) =>
													onChangeStripeForm(
														"bankAccountNumber",
														val,
													)
												}
												maxLength={100}
											/>
										</View>
									</View>
								</FypCollapsible>
							</View>

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
								{id
									? "Edit payout method"
									: "Add payout method"}
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
						</View>
					</View>
				</View>
			</FansScreen3>
		</View>
	);
};

export default ReferCreatorsPayoutSetupScreen;
