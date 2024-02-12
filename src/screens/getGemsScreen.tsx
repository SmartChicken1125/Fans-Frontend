import {
	ChevronDownSvg,
	PushNotificationSvg,
	RoundedTipSvg,
	Gem1Svg,
} from "@assets/svgs/common";
import FormControl from "@components/common/FormControl";
import RoundButton from "@components/common/RoundButton";
import {
	FypCollapsible,
	FypNullableView,
	FypText,
	FypSvg,
	FypDropdown,
	FypCountryDropdown,
	FypCheckbox,
} from "@components/common/base";
import CheckoutOption from "@components/common/checkoutOption";
import CustomMaskInput from "@components/common/customMaskInput";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout, { LayoutContentsContainer } from "@components/common/layout";
import NotificationBox from "@components/common/notificationBox";
import { FansDivider, FansText, FansView } from "@components/controls";
import { checkoutOptions, gemOptions } from "@constants/common";
import { ANIMATION_LOADING_DIALOG_ID } from "@constants/modal";
import { useAppContext, ModalActionType } from "@context/useAppContext";
import {
	AUTHORIZE_NET_API_LOGIN_ID,
	AUTHORIZE_NET_CLIENT_KEY,
	AUTHORIZE_NET_ENVIRONMENT,
	// STRIPE_PUBLISHABLE_KEY,
	GEM_EXCHANGE_RATE,
} from "@env";
import {
	gemsPrice,
	gemsAuthorizeNetPurchase,
	gemsPayPalPurchase,
	// gemsStripePurchase,
} from "@helper/endpoints/gems/apis";
import states from "@helper/geo/state.json";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
// import {
// 	Elements,
// 	PaymentElement,
// 	useElements,
// 	useStripe,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js/pure";
import { CheckoutType, RoundButtonType } from "@usertypes/commonEnums";
import { IGemType } from "@usertypes/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import debounce from "lodash/debounce";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useAcceptJs } from "react-acceptjs";
import { Image, ScrollView, View } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";

const DEFAULT_GEM_AMOUNT = "1000";

interface DescriptionProps {
	title: string;
	description: string;
	icon: React.ReactNode;
}

export const Description: FC<DescriptionProps> = (props) => {
	const { title, description, icon } = props;

	return (
		<FansView position="relative" padding={{ l: 40 }}>
			<FansView position="absolute" style={tw.style("top-1 left-0")}>
				{icon}
			</FansView>
			<FansView gap={10}>
				<FypText fontSize={17} lineHeight={24} fontWeight={600}>
					{title}
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{description}
				</FypText>
			</FansView>
		</FansView>
	);
};

export const TopInformationSection = () => {
	const [collapsed, setCollapsed] = useState(true);
	return (
		<FansView margin={{ b: 28 }}>
			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
				pressableProps={{
					onPress: () => setCollapsed(!collapsed),
				}}
			>
				<FypText
					fontSize={17}
					lineHeight={22}
					fontWeight={600}
					color="purple"
				>
					What are Gems?
				</FypText>
				<FypSvg
					width={13}
					height={13}
					svg={ChevronDownSvg}
					style={[
						tw.style("text-fans-grey-70 dark:text-fans-grey-b1"),
						{
							transform: [
								{
									rotate: collapsed ? "0deg" : "180deg",
								},
							],
						},
					]}
				/>
			</FansView>
			<FypCollapsible collapsed={collapsed}>
				<FansView gap={26} margin={{ t: 32 }}>
					<Description
						title="Creator tipping system"
						description="Gems are FYP.Fans currency, exclusively for tipping creators"
						icon={
							<FypSvg
								width={19}
								height={19}
								color="fans-purple"
								svg={RoundedTipSvg}
							/>
						}
					/>
					<Description
						title="Gems to dollars"
						description="100 gems equal 1 USD"
						icon={
							<FypSvg
								width={21}
								height={21}
								color="fans-purple"
								svg={Gem1Svg}
							/>
						}
					/>
					<Description
						title="Boost your profile"
						description="Sending gems to creators earns you XP and helps increase your profile rank"
						icon={
							<FypSvg
								width={18}
								height={25}
								color="fans-purple"
								svg={PushNotificationSvg}
							/>
						}
					/>
				</FansView>
			</FypCollapsible>
		</FansView>
	);
};

interface AmountOptionProps {
	text: string;
	selected: boolean;
	onSelect: () => void;
}

export const AmountOption: FC<AmountOptionProps> = (props) => {
	const { text, selected, onSelect } = props;
	return (
		<Button
			mode="contained"
			style={tw.style(
				"bg-fans-grey m-0 flex-1 dark:bg-fans-grey-43",
				selected && "bg-fans-purple dark:bg-fans-purple",
			)}
			labelStyle={tw.style(
				"text-[18px] leading-6 text-black dark:text-fans-white font-medium my-2 mx-0 flex-1",
				selected && "text-white",
			)}
			onPress={onSelect}
		>
			{text}
		</Button>
	);
};

const GetGemsScreen = () => {
	const router = useRouter();
	const { gems = DEFAULT_GEM_AMOUNT } = useLocalSearchParams();
	const featureGates = useFeatureGates();

	// const stripe = useStripe();
	// const elements = useElements();
	const { dispatchData } = useAcceptJs({
		environment: AUTHORIZE_NET_ENVIRONMENT,
		authData: {
			apiLoginID: AUTHORIZE_NET_API_LOGIN_ID,
			clientKey: AUTHORIZE_NET_CLIENT_KEY,
		},
	});
	const { dispatch } = useAppContext();

	const [selectedGem, setSelectedGem] = useState<IGemType | undefined>();
	const [amount, setAmount] = useState("0");
	const [platformFee, setPlatformFee] = useState("");
	const [vatFee, setVatFee] = useState("");
	const [total, setTotal] = useState("");
	const [otherAmount, setOtherAmount] = useState<boolean>(false);
	const [checkoutOption, setCheckoutOption] = useState<CheckoutType>(
		CheckoutType.CreditCard,
	);
	const [cardholderName, setCardholderName] = useState("");
	const [cardNumber, setCardNumber] = useState("");
	const [expireDate, setExpireDate] = useState("");
	const [cvc, setCvc] = useState("");
	const [country, setCountry] = useState("");
	const [state, setState] = useState("");
	const [address, setAddress] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [city, setCity] = useState("");
	const [saveDetails, setSaveDetails] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const stateOptions = useMemo(
		() =>
			states
				.filter((s) => s.countryCode === country)
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((el) => ({
					data: el.name,
					label: el.name,
				})),
		[country],
	);

	useEffect(() => {
		if (typeof gems === "string") {
			const gemNumber = Number(gems);
			const gemExchangeRate = Number(GEM_EXCHANGE_RATE);
			if (!isNaN(gemNumber)) {
				setAmount(String(gemNumber * gemExchangeRate));
			}
		}
	}, []);

	useEffect(() => {
		if (amount === "0") return;
		router.push({
			pathname: "/get-gems",
			params: { gems: Number(amount) / Number(GEM_EXCHANGE_RATE) },
		});
		setSelectedGem(
			gemOptions.find(
				(el) =>
					Number(amount) >= el.price && Number(amount) < el.price * 2,
			) || gemOptions.at(-1),
		);
	}, [amount]);

	const fetchGemsPrice = async (
		currentGems: string | string[],
		currentCheckoutOption: CheckoutType,
		currentCountry: string,
		currentState: string,
		currentZipCode: string,
		currentCity: string,
		currentAddress: string,
	) => {
		const response = await gemsPrice({
			gems: Number(currentGems),
			service: currentCheckoutOption,
			customerInformation: {
				country: currentCountry,
				state: currentState,
				zip: currentZipCode,
				city: currentCity,
				address: currentAddress,
			},
		});

		if (response.ok) {
			const { platformFee, vatFee, total } = response.data;
			setPlatformFee(platformFee);
			setVatFee(vatFee);
			setTotal(total);
		} else {
			Toast.show({
				type: "error",
				text1: response.data.message,
			});
		}
	};

	const callFetchGemsPrice = () => {
		fetchGemsPrice(
			gems,
			checkoutOption,
			country,
			state,
			zipCode,
			city,
			address,
		);
	};

	useEffect(() => {
		callFetchGemsPrice();
	}, [gems, checkoutOption]);

	useEffect(() => {
		const debouncedCall = debounce(callFetchGemsPrice, 500);
		debouncedCall();

		return debouncedCall.cancel;
	}, [gems, checkoutOption, country, state, zipCode, city, address]);

	const showAnimationLoading = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: ANIMATION_LOADING_DIALOG_ID, show: true },
		});
	};
	const hideAnimationLoading = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: ANIMATION_LOADING_DIALOG_ID, show: false },
		});
	};

	const handleSelectGems = (gems: string) => {
		setAmount(gems);
		setOtherAmount(false);
	};

	const handlePayPal = async () => {
		try {
			const response = await gemsPayPalPurchase({
				gems: Number(gems),
				customerInformation: {
					country: country,
					state: state,
					zip: zipCode,
					city: city,
					address: address,
				},
			});
			if (response.ok) {
				showAnimationLoading();
				setTimeout(() => {
					hideAnimationLoading();
					router.push(response.data.approvalLink);
				}, 3000);
				// router.push(response.data.approvalLink);
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "An error occurred with the PayPal purchase",
			});
		}
	};

	// const handleStripe = async () => {
	// 	if (!stripe || !elements) {
	// 		return;
	// 	}

	// 	const { error } = await stripe.confirmPayment({
	// 		elements,
	// 		confirmParams: {
	// 			return_url: `${window.location.origin}/success`,
	// 		},
	// 		redirect: "if_required",
	// 	});

	// 	if (error) {
	// 		Toast.show({
	// 			type: "error",
	// 			text1: "An error occurred with the Stripe purchase",
	// 		});
	// 	} else {
	// 		Toast.show({
	// 			type: "success",
	// 			text1: "Purchase successful",
	// 		});
	// 		showAnimationLoading();
	// 		setTimeout(() => {
	// 			hideAnimationLoading();
	// 			dispatch.fetchUserInfo();
	// 			router.replace("/posts");
	// 		}, 5000);
	// 	}
	// };

	const handleAuthorizeNet = async () => {
		type AuthorizeNetError = {
			messages: {
				message: [{ text: string }];
			};
		};

		const firstName = cardholderName.split(" ")[0];
		const lastName = cardholderName.split(" ")[1];

		if (!firstName || !lastName) {
			Toast.show({
				type: "error",
				text1: "Please enter your full name",
			});
			return;
		}

		try {
			const response = await dispatchData({
				cardData: {
					cardNumber: cardNumber.replace(/\s/g, ""),
					fullName: cardholderName,
					cardCode: cvc,
					month: expireDate.split("/")[0],
					year: expireDate.split("/")[1],
				},
			});
			if (response.messages.resultCode === "Error") {
				Toast.show({
					type: "error",
					text1: response.messages.message[0].text,
				});
			} else {
				showAnimationLoading();

				const purchase = await gemsAuthorizeNetPurchase({
					gems: Number(gems),
					opaqueDataValue: response.opaqueData.dataValue,
					customerInformation: {
						firstName: firstName,
						lastName: lastName,
						country: country,
						state: state,
						address: address,
						zip: zipCode,
						city: city,
					},
				});

				hideAnimationLoading();

				if (purchase.ok) {
					Toast.show({
						type: "success",
						text1: "Purchase successful",
					});
					dispatch.fetchUserInfo();
					router.replace("/posts");
				} else {
					Toast.show({
						type: "error",
						text1: purchase.data.message,
					});
				}
			}
		} catch (error) {
			const typedError = error as AuthorizeNetError;
			Toast.show({
				type: "error",
				text1:
					typedError.messages.message[0].text || "An error occurred",
			});
		}
	};

	const handlePay = () => {
		setSubmitted(true);
		if (otherAmount && parseFloat(amount ?? "0") > 200) {
			Toast.show({
				type: "error",
				text1: "Error: Transactions must be below $200",
			});
			return;
		}

		if (amount === "0") {
			Toast.show({
				type: "error",
				text1: "Please enter a valid amount",
			});
			return;
		}

		setSubmitted(false);
		switch (checkoutOption) {
			case CheckoutType.PayPal:
				handlePayPal();
				break;
			// case CheckoutType.Stripe:
			// 	handleStripe();
			// 	break;
			case CheckoutType.CreditCard:
				handleAuthorizeNet();
				break;
		}
	};
	return (
		<AppLayout>
			<View style={tw.style("flex-1")}>
				<ScrollView style={tw.style("flex-1")}>
					<LayoutContentsContainer hideRightSection>
						<CustomTopNavBar
							title="Get Gems"
							onClickLeft={() => router.replace("posts")}
						/>
						<View style={tw.style("px-[18px] md:px-0 pt-10")}>
							<FypNullableView
								visible={featureGates.has(
									"2023_12-gems-new-ui",
								)}
							>
								<TopInformationSection />
							</FypNullableView>

							<View>
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={600}
									margin={{ b: 24 }}
								>
									Select amount to add
								</FypText>
								<View
									style={tw.style(
										"flex-row flex-wrap gap-x-2 mb-[10px]",
									)}
								>
									<AmountOption
										text="$10.00"
										selected={amount === "10"}
										onSelect={() => handleSelectGems("10")}
									/>
									<AmountOption
										text="$20.00"
										selected={amount === "20"}
										onSelect={() => handleSelectGems("20")}
									/>
									<AmountOption
										text="$50.00"
										selected={amount === "50"}
										onSelect={() => handleSelectGems("50")}
									/>
								</View>
								<View
									style={tw.style(
										"flex-row flex-wrap gap-x-2 mb-[10px]",
									)}
								>
									<AmountOption
										text="$100.00"
										selected={amount === "100"}
										onSelect={() => handleSelectGems("100")}
									/>
									<AmountOption
										text="$200.00"
										selected={amount === "200"}
										onSelect={() => handleSelectGems("200")}
									/>
									<AmountOption
										text="Other..."
										selected={otherAmount}
										onSelect={() => {
											setAmount("0");
											setOtherAmount(true);
										}}
									/>
								</View>
								<FypCollapsible collapsed={!otherAmount}>
									<View style={tw.style("pt-[34px]")}>
										<FormControl
											label="Enter amount"
											value={amount}
											onChangeText={(val: string) => {
												setAmount(val);
											}}
											placeholder="e.g. 200"
											hasError={
												otherAmount &&
												parseFloat(amount ?? "0") > 1000
											}
											validateString="Amount can be max $1000"
											keyboardType="numeric"
										/>
									</View>
								</FypCollapsible>
							</View>

							<View style={tw.style("mt-8")}>
								<FypText
									fontSize={15}
									lineHeight={20}
									fontWeight={600}
									margin={{ b: 12 }}
								>
									Amount
								</FypText>
								<FypText fontSize={15} lineHeight={20}>
									${amount} USD
								</FypText>

								<FypText
									fontSize={15}
									lineHeight={20}
									fontWeight={600}
									margin={{ y: 12 }}
								>
									Platform fee
								</FypText>
								<FypText fontSize={15} lineHeight={20}>
									${platformFee} USD
								</FypText>
								<FypText
									fontSize={15}
									lineHeight={20}
									fontWeight={600}
									margin={{ y: 12 }}
								>
									VAT
								</FypText>
								<FypText fontSize={15} lineHeight={20}>
									${vatFee} USD
								</FypText>
								<FypText
									fontSize={17}
									lineHeight={22}
									fontWeight={600}
									margin={{ y: 12 }}
								>
									Total
								</FypText>
								<View style={tw.style("flex-row items-center")}>
									<FypText
										fontSize={19}
										lineHeight={26}
										fontWeight={600}
									>
										${total} USD
									</FypText>
									<View
										style={tw.style(
											"flex-row items-center ml-auto",
										)}
									>
										{selectedGem?.icon ? (
											<Image
												source={selectedGem.icon}
												style={{
													// width: selectedGem.width * 0.56,
													// height: selectedGem.height * 0.56,
													width: 41.2,
													height: 38.2,
												}}
											/>
										) : null}
										<FypText
											fontSize={19}
											lineHeight={26}
											fontWeight={500}
											margin={{ l: 10 }}
											style={tw.style(
												`${selectedGem?.color}`,
											)}
										>
											{`${gems} Gems`}
										</FypText>
									</View>
								</View>
							</View>

							<FansDivider
								style={tw.style("my-5 md:mb-7 md:mt-8")}
							/>
							{featureGates.has(
								"2023_12-get-gems-stripe-method",
							) ? (
								<View style={tw.style("mb-8")}>
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										margin={{ b: 15 }}
									>
										Checkout
									</FypText>
									<View style={tw.style("flex-row gap-x-2")}>
										{checkoutOptions.map((el) => (
											<CheckoutOption
												key={el.name}
												data={el}
												selected={
													checkoutOption === el.type
												}
												onSelect={() =>
													setCheckoutOption(el.type)
												}
											/>
										))}
									</View>
								</View>
							) : null}

							{checkoutOption === CheckoutType.CreditCard && (
								<View>
									<FormControl
										label="Cardholder name"
										value={cardholderName}
										onChangeText={(val: string) =>
											setCardholderName(val)
										}
										placeholder="Enter full name"
										styles="mb-8"
									/>

									<FansView margin={{ b: 32 }}>
										<FansText
											fontSize={17}
											lineHeight={21}
											style={tw.style(
												"font-semibold mb-[15px]",
											)}
										>
											Card number
										</FansText>
										<CustomMaskInput
											placeholder="1234 1234 1234 1234"
											customStyles="pr-11"
											value={cardNumber}
											onChangeText={(val) =>
												setCardNumber(val)
											}
											type="creditCard"
										/>
									</FansView>

									<View
										style={tw.style(
											"flex-row justify-between gap-x-[14px] mb-8",
										)}
									>
										<View>
											<FansText
												fontSize={17}
												lineHeight={22}
												style={tw.style(
													"mb-[14px] font-semibold",
												)}
											>
												Expire date
											</FansText>
											<CustomMaskInput
												placeholder="MM / YY"
												value={expireDate}
												onChangeText={(val) =>
													setExpireDate(val)
												}
												type="monthYear"
											/>
										</View>

										<FormControl
											label="CVC"
											value={cvc}
											onChangeText={(val: string) =>
												setCvc(val)
											}
											placeholder="CVC"
											styles="flex-1"
										/>
									</View>
									<View style={tw.style("mb-8")}>
										<View>
											<FansText
												fontSize={17}
												lineHeight={22}
												style={tw.style(
													"mb-[14px] font-semibold",
												)}
											>
												Country
											</FansText>
											<FypCountryDropdown
												data={[]}
												value={country}
												onSelect={(val) =>
													setCountry(val as string)
												}
											/>
										</View>
									</View>
									{(!country || stateOptions.length > 0) && (
										<View style={tw.style("mb-8")}>
											<View>
												<FansText
													fontSize={17}
													lineHeight={22}
													style={tw.style(
														"mb-[14px] font-semibold",
													)}
												>
													State
												</FansText>
												<FypDropdown
													data={stateOptions}
													value={state}
													onSelect={(val) =>
														setState(val as string)
													}
													placeholder="Select State"
													search
												/>
											</View>
										</View>
									)}
									<View style={tw.style("mb-8")}>
										<FormControl
											label="Street"
											value={address}
											onChangeText={(val: string) =>
												setAddress(val)
											}
											placeholder="Street"
											styles="flex-1"
										/>
									</View>
									<View
										style={tw.style(
											"flex-row justify-between gap-x-[14px] mb-8",
										)}
									>
										<FormControl
											label="Zip Code"
											value={zipCode}
											onChangeText={(val: string) =>
												setZipCode(val)
											}
											placeholder="Zip Code"
											styles="flex-1"
										/>

										<FormControl
											label="City"
											value={city}
											onChangeText={(val: string) =>
												setCity(val)
											}
											placeholder="City"
											styles="flex-1"
										/>
									</View>

									<NotificationBox style={tw.style("mb-10")}>
										<FansText
											style={tw.style(
												"text-base leading-[21px] text-fans-purple text-center",
											)}
										>
											🔒 Secure Checkout{"\n"} Please note
											that we do not store or process any
											credit/debit card information on our
											site. All payment transactions are
											securely handled through
											Authorize.Net, a Visa solution
											company.
										</FansText>
									</NotificationBox>
								</View>
							)}

							{/* {checkoutOption === CheckoutType.Stripe && (
								<View style={tw.style("mb-8")}>
									<PaymentElement />
								</View>
							)} */}

							<View
								style={tw.style(
									"flex-row items-center mb-[20px]",
								)}
							>
								<FypCheckbox
									checked={saveDetails}
									onPress={() => setSaveDetails(!saveDetails)}
								/>
								<FypText
									fontSize={16}
									lineHeight={21}
									margin={{ l: 18 }}
								>
									Save details for future purchases
								</FypText>
							</View>

							<RoundButton
								variant={RoundButtonType.OUTLINE_PRIMARY}
								onPress={handlePay}
							>
								Pay ${total} USD
							</RoundButton>

							<View style={tw.style("mt-[22px] mb-[77px]")}>
								<FypText
									style={tw.style(
										"text-[12px] leading-[21px] text-fans-grey-70 dark:text-fans-grey-b1 text-center",
									)}
								>
									By moving forward, you agree to our{" "}
									<FypText
										style={tw.style(
											"text-[12px] leading-[21px] text-fans-purple text-center underline",
										)}
										onPress={() => router.push("/terms")}
									>
										Terms of Use.
									</FypText>
								</FypText>
							</View>
						</View>
					</LayoutContentsContainer>
				</ScrollView>
			</View>
		</AppLayout>
	);
};

// const GetGemsScreenWrapper = () => {
// 	const { gems = DEFAULT_GEM_AMOUNT } = useLocalSearchParams();
// 	const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// 	const [stripeClientSecret, setStripeClientSecret] = useState("");

// 	useEffect(() => {
// 		const fetchStripeClientSecret = async () => {
// 			const response = await gemsStripePurchase({
// 				gems: Number(gems),
// 				customerInformation: {
// 					country: "US",
// 					state: "CA",
// 					zip: "90001",
// 					city: "Los Angeles",
// 					address: "123 Main St",
// 				},
// 			});
// 			if (response.ok) {
// 				setStripeClientSecret(response.data.clientSecret);
// 			}
// 		};

// 		fetchStripeClientSecret();
// 	}, [gems]);

// 	if (!stripeClientSecret) return null;
// 	return (
// 		<Elements
// 			stripe={stripePromise}
// 			options={{
// 				clientSecret: stripeClientSecret,
// 				appearance: {
// 					variables: {
// 						spacingUnit: "6px",
// 						borderRadius: "5px",
// 						fontWeightNormal: "700",
// 						spacingGridColumn: "20px",
// 					},
// 				},
// 			}}
// 		>
// 			<GetGemsScreen />
// 		</Elements>
// 	);
// };

export default GetGemsScreen;
