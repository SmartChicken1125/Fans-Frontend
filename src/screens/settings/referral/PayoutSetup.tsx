import { ChevronLeft1Svg } from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import RoundTextInput from "@components/common/RoundTextInput";
import {
	FypCollapsible,
	FypCountryDropdown,
	FypLink,
	FypText,
} from "@components/common/base";
import CustomRadio from "@components/common/customRadio";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import {
	FansDivider,
	FansGap,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import {
	createPayPalPayoutMethod,
	fetchPayoutMethod,
	updatePayoutMethod,
} from "@helper/endpoints/payout/apis";
import tw from "@lib/tailwind";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { RoundButtonType } from "@usertypes/commonEnums";
import { SettingsReferralProgramNativeStackParams } from "@usertypes/navigations";
import { IStripeForm } from "@usertypes/types";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const PayoutSetupScreen = () =>
	// props: ReferralProgramNativeStackScreenProps<"PayoutSetup">,
	{
		const router = useRouter();
		const featureGates = useFeatureGates();
		if (!featureGates.has("2023_12-fans-referral")) {
			router.replace("/posts");
			return <></>;
		}

		const navigation =
			useNavigation<
				NativeStackNavigationProp<SettingsReferralProgramNativeStackParams>
			>();
		navigation.setOptions({
			headerShown: false,
		});

		const { id, isGreen = false } = useLocalSearchParams();
		const insets = useSafeAreaInsets();

		const [setUpMethod, setSetUpMethod] = useState("Individual");
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

					const response = await fetchPayoutMethod(
						{ id: id as string },
						{ id: id as string },
					);

					if (response.ok) {
						setSetUpMethod(response.data.entityType);
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
							paypalEmail: paypalEmail,
							country: country,
							entityType: setUpMethod,
							usCitizenOrResident: isUsCityzen,
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
					const response = await createPayPalPayoutMethod({
						paypalEmail: paypalEmail,
						country: country,
						entityType: setUpMethod,
						usCitizenOrResident: isUsCityzen,
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
			<AppLayout>
				<FansView style={tw.style("relative w-full")}>
					<FansView
						height={{ xs: 64, lg: 103 }}
						alignItems="center"
						flexDirection="row"
						padding={{ x: 24 }}
						style={tw.style(
							"bg-fans-white dark:bg-fans-black-1d",
							"border-b border-fans-grey-f0 dark:border-fans-grey-43",
						)}
					>
						<FansView
							touchableOpacityProps={{
								onPress: () => {
									if (navigation.canGoBack()) {
										navigation.goBack();
									} else {
										if (router.canGoBack()) {
											router.back();
										} else {
											router.push({
												pathname: "posts",
												params: { screen: "Home" },
											});
										}
									}
								},
							}}
							width={40}
							height={40}
							padding={{ x: 4, y: 12 }}
						>
							<FansSvg
								width={8}
								height={16}
								svg={ChevronLeft1Svg}
								color1={
									tw.prefixMatch("dark")
										? "grey-b1"
										: "grey-70"
								}
							/>
						</FansView>
						<FansGap viewStyle={{ flex: "1" }} />
						<FansText fontFamily="inter-bold" fontSize={19}>
							Payout setup
						</FansText>
						<FansGap viewStyle={{ flex: "1" }} />
						<FansView
							touchableOpacityProps={{
								onPress: onPayoutMethod,
							}}
							height={40}
						>
							<FansText
								color={isGreen ? "green" : "purple"}
								fontFamily="inter-bold"
								fontSize={17}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									height: 40,
								}}
							>
								Add
							</FansText>
						</FansView>
					</FansView>

					<ScrollView style={tw.style("relative w-full")}>
						<LayoutContentsContainer>
							<View
								style={[
									{
										paddingBottom: insets.bottom + 35,
									},
									tw.style("px-[18px] pt-6"),
								]}
							>
								<View style={tw.style("mb-6")}>
									<Text
										style={tw.style(
											"text-[19px] leading-[26px] font-semibold text-black mb-[26px]",
										)}
									>
										Business status
									</Text>
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
												onPress={() =>
													setSetUpMethod("Individual")
												}
												checked={
													setUpMethod === "Individual"
												}
												bgColor={
													isGreen
														? "bg-fans-green dark:bg-fans-green-29"
														: "bg-fans-purple"
												}
											/>
										</View>
										<FansDivider
											style={tw.style("h-[1px] my-[6px]")}
										/>
										<View
											style={tw.style(
												"flex-row items-center py-[14px]",
											)}
										>
											<CustomRadio
												label="I am or represent a corporation"
												onPress={() =>
													setSetUpMethod(
														"Corporation",
													)
												}
												checked={
													setUpMethod ===
													"Corporation"
												}
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
												onPress={() =>
													setIsUsCityzen(true)
												}
												checked={isUsCityzen}
												bgColor={
													isGreen
														? "bg-fans-green dark:bg-fans-green-29"
														: "bg-fans-purple"
												}
											/>
										</View>
										<FansDivider
											style={tw.style("h-[1px] my-[6px]")}
										/>
										<View
											style={tw.style(
												"flex-row items-center py-[14px]",
											)}
										>
											<CustomRadio
												label="I am not a US citizen or resident"
												onPress={() =>
													setIsUsCityzen(false)
												}
												checked={!isUsCityzen}
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
									<Text
										style={tw.style(
											"text-[19px] leading-[26px] font-semibold text-black mb-[26px]",
										)}
									>
										Payout method
									</Text>
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

										<View>
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
											<FypText
												fontSize={16}
												lineHeight={21}
												style={tw.style(
													"text-fans-dark-grey dark:text-fans-grey-b1",
												)}
											>
												Payout fee is 1% of the amount
												transferred, with a minimum of
												USD $0.25 and a maximum of USD
												$20{" "}
												<FypLink
													color={
														isGreen
															? "green-4d"
															: "purple-a8"
													}
												>
													Learn more
												</FypLink>
											</FypText>
											<FypCollapsible
												collapsed={
													paidMethod === "deposit" ||
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
										</View>

										<FansDivider
											style={tw.style(
												"h-[1px] mt-5 mb-[6px]",
											)}
										/>

										{/* <View>
													<View
														style={tw.style(
															"py-[14px]",
														)}
													>
														<CustomRadio
															label="Direct deposit via Stripe"
															onPress={() =>
																setPaidMethod(
																	"deposit",
																)
															}
															checked={
																paidMethod ===
																"deposit"
															}
															bgColor={isGreen ? "fans-green" : "fans-purple" }
														/>
													</View>
													<CustomText
														size="base"
														style="text-fans-dark-grey"
													>
														Payout fee is USD $0.25
														per payout
													</CustomText>
													<View
														style={tw.style(
															"flex-row",
														)}
													>
														<Button
															style={tw.style(
																"m-0",
															)}
															labelStyle={tw.style(
																"text-fans-purple text-base leading-[21px] m-0",
															)}
														>
															Learn more
														</Button>
													</View>
													<Collapsible
														collapsed={
															paidMethod ===
																"paypal" ||
															paidMethod ===
																"paxum"
														}
													>
														<View
															style={tw.style(
																"pt-4",
															)}
														>
															<View
																style={tw.style(
																	"mb-5",
																)}
															>
																<CustomText
																	size="lg"
																	style="text-black mb-4"
																>
																	Name
																</CustomText>
																<RoundTextInput
																	placeholder="First name"
																	value={
																		stripeForm.firstName
																	}
																	onChangeText={(
																		val,
																	) =>
																		onChangeStripeForm(
																			"firstName",
																			val,
																		)
																	}
																	customStyles="mb-[10px]"
																/>
																<RoundTextInput
																	placeholder="Last name"
																	value={
																		stripeForm.lastName
																	}
																	onChangeText={(
																		val,
																	) =>
																		onChangeStripeForm(
																			"lastName",
																			val,
																		)
																	}
																/>
															</View>

															<View
																style={tw.style(
																	"mb-5",
																)}
															>
																<CustomText
																	size="lg"
																	style="text-black mb-4"
																>
																	Address
																</CustomText>
																<RoundTextInput
																	placeholder="Street Address 1"
																	value={
																		stripeForm.address1
																	}
																	onChangeText={(
																		val,
																	) =>
																		onChangeStripeForm(
																			"address1",
																			val,
																		)
																	}
																	customStyles="mb-[10px]"
																/>
																<RoundTextInput
																	placeholder="Street Address 2"
																	value={
																		stripeForm.address2
																	}
																	onChangeText={(
																		val,
																	) =>
																		onChangeStripeForm(
																			"address2",
																			val,
																		)
																	}
																	customStyles="mb-[10px]"
																/>
																<RoundTextInput
																	placeholder="City"
																	value={
																		stripeForm.city
																	}
																	onChangeText={(
																		val,
																	) =>
																		onChangeStripeForm(
																			"city",
																			val,
																		)
																	}
																	customStyles="mb-[10px]"
																/>
																<RoundTextInput
																	placeholder="State"
																	value={
																		stripeForm.state
																	}
																	onChangeText={(
																		val,
																	) =>
																		onChangeStripeForm(
																			"state",
																			val,
																		)
																	}
																	customStyles="mb-[10px]"
																/>
																<RoundTextInput
																	placeholder="ZIP"
																	value={
																		stripeForm.zip
																	}
																	onChangeText={(
																		val,
																	) =>
																		onChangeStripeForm(
																			"zip",
																			val,
																		)
																	}
																/>
															</View>

															<View
																style={tw.style(
																	"mb-5",
																)}
															>
																<CustomText
																	size="lg"
																	style="text-black mb-4"
																>
																	Birth date
																</CustomText>
															</View>

															<View
																style={tw.style(
																	"mb-5",
																)}
															>
																<CustomText
																	size="lg"
																	style="text-black mb-4"
																>
																	Bank
																	information
																</CustomText>
																<RoundTextInput
																	placeholder="Individual SSN"
																	value={
																		stripeForm.individualSSN
																	}
																	onChangeText={(
																		val,
																	) =>
																		onChangeStripeForm(
																			"individualSSN",
																			val,
																		)
																	}
																	customStyles="mb-[10px]"
																/>
																<RoundTextInput
																	placeholder="Bank routing number"
																	value={
																		stripeForm.bankRoutingNumber
																	}
																	onChangeText={(
																		val,
																	) =>
																		onChangeStripeForm(
																			"bankRoutingNumber",
																			val,
																		)
																	}
																	customStyles="mb-[10px]"
																/>
																<RoundTextInput
																	placeholder="Bank account number"
																	value={
																		stripeForm.bankAccountNumber
																	}
																	onChangeText={(
																		val,
																	) =>
																		onChangeStripeForm(
																			"bankAccountNumber",
																			val,
																		)
																	}
																/>
															</View>
														</View>
													</Collapsible>
												</View> */}

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
													isGreen
														? "fans-green"
														: "fans-purple"
												} text-[17px]`,
											)}
										>
											Cancel
										</Button>
									</View>
								</View>
							</View>
						</LayoutContentsContainer>
					</ScrollView>
				</FansView>
			</AppLayout>
		);
	};

export default PayoutSetupScreen;
