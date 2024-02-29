import {
	AnalyticsSvg,
	OutlinedInfoSvg,
	ChevronDownSvg,
} from "@assets/svgs/common";
import {
	FypButton2,
	FypCollapsible,
	FypLinearGradientView,
	FypSvg,
	FypText,
	FypRotateIcon,
	FypSortButton,
} from "@components/common/base";
import CardActions from "@components/common/cardActions";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout from "@components/common/layout";
import PaymentMethod from "@components/common/paymentMethod";
import {
	FansDivider,
	FansGap,
	FansIconButton,
	FansView,
} from "@components/controls";
import { FilterButton } from "@components/posts/common";
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
import { IconTypes, PaymentMethodType } from "@usertypes/commonEnums";
import { SettingsReferralProgramNativeStackParams } from "@usertypes/navigations";
import { ICardAction, PayPalPayoutMethod, SortType } from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState, FC } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const payments = [
	{
		id: "1",
		provider: "PayPal",
		country: "USA",
		entityType: "",
		usCitizenOrResident: true,
		paymentInformation: "paypal.com",
	},
	{
		id: "2",
		provider: "Bank",
		country: "USA",
		entityType: "",
		usCitizenOrResident: true,
		paymentInformation: "**** 1234 / 000123000",
	},
	{
		id: "3",
		provider: "Payoneer",
		country: "USA",
		entityType: "",
		usCitizenOrResident: true,
		paymentInformation: "mail@gmail.com",
	},
	{
		id: "4",
		provider: "Revolut",
		country: "USA",
		entityType: "",
		usCitizenOrResident: true,
		paymentInformation: "revolut.me/user",
	},
];

interface ITestPayPalPayoutMethod extends PayPalPayoutMethod {
	paymentInformation: string;
}

interface PayoutDetailProps {
	title: string;
	value: string;
}

const PayoutDetail: FC<PayoutDetailProps> = (props) => {
	const { title, value } = props;
	return (
		<FansView flexDirection="row" alignItems="center">
			<FypText fontSize={16} lineHeight={21} fontWeight={600}>
				{`${title}: `}
			</FypText>
			<FypText
				fontSize={16}
				lineHeight={21}
				style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
			>
				{value}
			</FypText>
		</FansView>
	);
};

interface PayoutCardProps {}

const PayoutCard: FC<PayoutCardProps> = () => {
	const [openLink] = useBlankLink();
	const [expanded, setExpanded] = useState(false);

	const handlePressSupport = () => {
		openLink("https://support.fyp.fans");
	};

	return (
		<FansView
			borderRadius={15}
			style={tw.style(
				"border border-fans-grey-f0 dark:border-fans-grey-43",
			)}
		>
			<FansView
				padding={{ t: 18, b: 19, l: 17, r: 44 }}
				flexDirection="row"
				justifyContent="between"
				position="relative"
				pressableProps={{
					onPress: () => setExpanded(!expanded),
				}}
			>
				<FansView>
					<FansView
						margin={{ b: 7 }}
						flexDirection="row"
						alignItems="center"
					>
						<FypText fontSize={18} lineHeight={26} fontWeight={600}>
							Payout processed
						</FypText>
					</FansView>

					<FypText
						fontSize={14}
						lineHeight={21}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
						)}
					>
						Wells fargo Bank **** 1234
					</FypText>
				</FansView>
				<FansView gap={6} alignItems="end">
					<FypLinearGradientView
						colors={["#24A2FF", "#23C9B1", "#89F276"]}
						start={[0, 1]}
						end={[1, 0]}
						width={68}
						height={26}
						alignItems="center"
						justifyContent="center"
						borderRadius={26}
					>
						<FypText
							fontSize={14}
							lineHeight={19}
							fontWeight={600}
							color="white"
						>
							$100
						</FypText>
					</FypLinearGradientView>

					<FansView flexDirection="row" alignItems="center">
						<FypText
							fontSize={14}
							lineHeight={21}
							style={tw.style(
								"text-fans-grey-48 dark:text-fans-grey-b1",
							)}
						>
							01/02/24
						</FypText>
						<FansView
							width={4}
							height={4}
							borderRadius={4}
							margin={{ l: 4, r: 8 }}
							style={tw.style(
								"bg-fans-grey-48 dark:bg-fans-grey-b1",
								"hidden md:flex",
							)}
						></FansView>
						<FypText
							fontSize={14}
							lineHeight={21}
							style={tw.style(
								"text-fans-grey-48 dark:text-fans-grey-b1",
								"hidden md:flex",
							)}
						>
							4:23 am
						</FypText>
					</FansView>
				</FansView>
				<FansView
					width={16}
					height={16}
					position="absolute"
					top={23}
					right={16}
				>
					<FypRotateIcon
						rotated={expanded}
						style={tw.style("w-4 h-4")}
					>
						<FypSvg
							svg={ChevronDownSvg}
							width={16}
							height={10}
							color="fans-grey-48 dark:fans-grey-b1"
						/>
					</FypRotateIcon>
				</FansView>
			</FansView>
			<FypCollapsible collapsed={!expanded}>
				<FansView padding={{ x: 17, b: 16 }}>
					<FansDivider />
					<FansGap height={14} />
					<FansView gap={14} style={tw.style("hidden md:flex")}>
						<FansView flexDirection="row" alignItems="center">
							<FansView flex="1">
								<PayoutDetail title="Amount" value="$100" />
							</FansView>
							<FansView flex="1">
								<PayoutDetail
									title="Initiated"
									value="Jan 3, 2024 4:23 am"
								/>
							</FansView>
						</FansView>
						<FansDivider />
						<FansView flexDirection="row" alignItems="center">
							<FansView flex="1">
								<PayoutDetail
									title="To"
									value="Bank of New York Mellon"
								/>
							</FansView>
							<FansView flex="1">
								<PayoutDetail
									title="Status"
									value="Completed"
								/>
							</FansView>
						</FansView>
					</FansView>
					<FansView gap={14} style={tw.style("md:hidden")}>
						<PayoutDetail title="Amount" value="$100" />
						<FansDivider />
						<PayoutDetail
							title="To"
							value="Bank of New York Mellon"
						/>
						<FansDivider />
						<PayoutDetail
							title="Initiated"
							value="Jan 3, 2024 4:23 am"
						/>
						<FansDivider />
						<PayoutDetail title="Status" value="Completed" />
					</FansView>

					<FansGap height={35} />
					<FypButton2
						style={tw.style(
							"border border-fans-grey-48 dark:border-fans-grey-b1",
						)}
						textStyle={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
						)}
						pressableProps={{
							onPress: handlePressSupport,
						}}
					>
						Contact Support
					</FypButton2>
				</FansView>
			</FypCollapsible>
		</FansView>
	);
};

const GetPaidScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SettingsReferralProgramNativeStackParams>
		>();

	const router = useRouter();
	const { state, dispatch } = useAppContext();
	const { profile, user } = state;
	const { userInfo } = user;
	const insets = useSafeAreaInsets();

	const [autoPayouts, setAutoPayouts] = useState(false);
	const [price, setPrice] = useState<number | undefined>();
	const [paymentMethods, setPaymentMethods] = useState<
		ITestPayPalPayoutMethod[]
	>([...payments]);
	const [openPaymentMethodActions, setOpenPaymentMethodActions] =
		useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
	const [inProgress, setInProgress] = useState(false);
	const [maxPayout, setMaxPayout] = useState(0);
	const [totalPayoutAmount, setTotalPayoutAmount] = useState(0);
	const [showPayouts, setShowPayouts] = useState(false);
	const [filter, setFilter] = useState("All");
	const [orderBy, setOrderBy] = useState<SortType>("Newest");

	// useEffect(() => {
	// 	const getPayoutSchedule = async () => {
	// 		const paymentMethodsData = await fetchPayoutSchedule();
	// 		if (paymentMethodsData.ok) {
	// 			setAutoPayouts(paymentMethodsData.data.mode === "Automatic");
	// 			setPrice(paymentMethodsData.data.threshold);
	// 			setMaxPayout(paymentMethodsData.data.maxPayout);
	// 			setTotalPayoutAmount(paymentMethodsData.data.totalPayoutAmount);
	// 		}
	// 	};
	// 	getPayoutSchedule();

	// 	const getPaymentMethods = async () => {
	// 		const paymentMethodsData = await fetchPayoutPaymentMethods();
	// 		if (paymentMethodsData.ok) {
	// 			setPaymentMethods(paymentMethodsData.data);
	// 		}
	// 	};
	// 	getPaymentMethods();
	// }, [refresh]);

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

	const onGoToAnalytics = () => {
		router.push("/analytics");
	};

	const onGoToSetup = () => {
		navigation.navigate("PayoutSetup");
	};

	const paymentActions: ICardAction[] = [
		{
			title: "Replace payout method",
			iconType: IconTypes.Replace,
			onClick: onEditPaymentMethod,
		},
		{
			title: "Remove payout method",
			iconType: IconTypes.Cancel,
			iconColor: "fans-red",
			onClick: onDeletePaymentMethod,
			labelClass: "text-fans-red",
		},
	];

	return (
		<AppLayout
			title="Edit Profile | FYP.Fans"
			description="FYP.Fans allows creators to make an income doing what they love!"
		>
			<FansView flex="1">
				<ScrollView style={tw.style("flex-1")}>
					<FansView position="relative" padding={{ b: 40 }}>
						<FypLinearGradientView
							colors={["#BCCEF8", "#A8A9F7", "#E1C7FD"]}
							start={[0, 1]}
							end={[1, 0]}
							height={{ xs: 223, md: 306 }}
							width="full"
							top={0}
							left={0}
							position="absolute"
							style={tw.style("rounded-b-[15px]")}
						></FypLinearGradientView>
						<CustomTopNavBar
							title="Payments"
							onClickLeft={() => navigation.goBack()}
						/>
						<FansGap height={{ xs: 26, md: 28 }} />
						<FansView
							style={tw.style(
								"w-full md:max-w-[674px] md:mx-auto",
								"px-[18px] md:px-0",
							)}
						>
							<FansView
								borderRadius={15}
								padding={{ y: 20, x: 18 }}
								style={[
									tw.style(
										"bg-fans-white dark:bg-fans-black-1d",
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
								<FansIconButton
									size={42}
									backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
									style={tw.style(
										"absolute top-[18px] right-[18px] z-1",
									)}
									onPress={onGoToAnalytics}
								>
									<FypSvg
										svg={AnalyticsSvg}
										width={23}
										height={23}
										color="fans-black dark:fans-white"
									/>
								</FansIconButton>
								<FypText
									fontSize={21}
									fontWeight={600}
									lineHeight={28}
									style={tw.style(
										"text-fans-grey-48 dark:text-fans-grey-b1 md:text-center",
									)}
								>
									Your balance
								</FypText>
								<FansView
									flexDirection="row"
									alignItems="end"
									gap={29}
									style={tw.style("md:justify-center")}
								>
									<FypText
										fontSize={57}
										lineHeight={76}
										fontWeight={600}
										style={tw.style(
											"text-fans-black-1d dark:text-fans-white",
										)}
									>
										$
										{Math.trunc(
											userInfo.payoutBalance ?? 0,
										)}
										<FypText
											fontSize={57}
											lineHeight={76}
											fontWeight={600}
											style={tw.style(
												"text-fans-grey-9d",
											)}
										>
											.
										</FypText>
									</FypText>
									<FypText
										fontSize={37}
										lineHeight={49}
										fontWeight={600}
										margin={{ b: 5 }}
										style={tw.style("text-fans-grey-9d")}
									>
										{
											(
												(userInfo.payoutBalance ?? 0) -
												Math.trunc(
													userInfo.payoutBalance ?? 0,
												)
											)
												.toFixed(2)
												.toString()
												.split(".")[1]
										}
									</FypText>
								</FansView>
								<FansGap height={22} />
								<FypButton2
									loading={inProgress}
									style={tw.style("bg-fans-black")}
									textStyle={tw.style("text-fans-white")}
									pressableProps={{
										onPress: onExecutePayout,
									}}
								>
									Request payout
								</FypButton2>
							</FansView>

							<FansGap height={{ xs: 38, md: 42 }} />

							<FansView>
								<FypText
									fontSize={17}
									fontWeight={600}
									lineHeight={22}
									margin={{ b: 12 }}
								>
									Payout settings
								</FypText>
								<FypText
									fontSize={16}
									lineHeight={21}
									margin={{ b: 17 }}
									style={tw.style(
										"text-fans-grey-48 dark:text-fans-grey-b1",
									)}
								>
									Edit your payout settings, including how
									you'd like to get paid and your tax
									information
								</FypText>

								{paymentMethods.length === 0 && (
									<FansView gap={10}>
										<FansView
											style={tw.style(
												"bg-fans-purple-f4/10",
											)}
											padding={{ t: 16, b: 20, x: 18 }}
											borderRadius={15}
											gap={5}
										>
											<FypText
												fontSize={16}
												lineHeight={21}
												fontWeight={600}
												color="black"
												textAlign="center"
											>
												<FypSvg
													svg={OutlinedInfoSvg}
													width={14}
													height={14}
													color="fans-grey-48"
												/>
												{`  `}
												Payout method not added
											</FypText>
											<FypText
												fontSize={16}
												lineHeight={21}
												color="grey-48"
												textAlign="center"
											>
												Please{" "}
												<FypText
													fontSize={16}
													lineHeight={21}
													color="grey-48"
													fontWeight={600}
													style={tw.style(
														"underline",
													)}
													onPress={onGoToSetup}
												>
													click here
												</FypText>{" "}
												or below to add a bank account,
												Payoneer, or Revolut details
											</FypText>
										</FansView>
										<FypButton2
											style={tw.style(
												"border border-fans-purple",
											)}
											textStyle={tw.style(
												"text-fans-purple",
											)}
											pressableProps={{
												onPress: onGoToSetup,
											}}
										>
											Add payout method
										</FypButton2>
									</FansView>
								)}

								{paymentMethods.length > 0 ? (
									<FansView>
										<FansView gap={14}>
											{paymentMethods &&
												paymentMethods.map((method) => (
													<PaymentMethod
														key={method.id}
														title={method.provider}
														paymentInformation={
															method.paymentInformation
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
												))}
										</FansView>
										<FansGap height={10} />
										<FypButton2
											style={tw.style(
												"border border-fans-purple",
											)}
											textStyle={tw.style(
												"text-fans-purple",
											)}
											pressableProps={{
												onPress: onGoToSetup,
											}}
										>
											Replace
										</FypButton2>
									</FansView>
								) : null}
							</FansView>

							<FansGap height={{ xs: 34, md: 32 }} />

							<FansView>
								<FypText
									fontSize={17}
									fontWeight={600}
									lineHeight={22}
									margin={{ b: 12 }}
								>
									Rate per payout
								</FypText>
								<FypText
									fontSize={16}
									lineHeight={21}
									style={tw.style(
										"text-fans-grey-48 dark:text-fans-grey-b1",
									)}
								>
									Enjoy fee-free payouts. Please note, a
									minimal currency conversion fee may apply if
									your bank operates in a currency other than
									USD
								</FypText>
							</FansView>

							<FansGap height={34} />
							<FansDivider />
							<FansGap height={30} />

							<FansView>
								<FansView
									flexDirection="row"
									alignItems="center"
									gap={24}
									pressableProps={{
										onPress: () =>
											setShowPayouts(!showPayouts),
									}}
								>
									<FypText
										fontSize={17}
										fontWeight={600}
										lineHeight={22}
									>
										Pending & past payouts
									</FypText>
									<FypRotateIcon
										rotated={showPayouts}
										style={tw.style("w-[14px] h-[14px]")}
									>
										<FypSvg
											svg={ChevronDownSvg}
											width={14}
											height={8}
											color="fans-grey-48 dark:fans-grey-b1"
										/>
									</FypRotateIcon>
								</FansView>

								<FansGap height={15} />

								<FypCollapsible collapsed={!showPayouts}>
									<FansView
										flexDirection="row"
										alignItems="center"
										gap={7}
									>
										{["All", "Pending", "Declined"].map(
											(el) => (
												<FilterButton
													key={el}
													title={el}
													onClick={() =>
														setFilter(el)
													}
													isSelected={filter === el}
												/>
											),
										)}
									</FansView>
									<FansGap height={15} />
									<FypSortButton
										value={orderBy}
										handleToggle={setOrderBy}
									/>
									<FansGap height={27} />
									<FansView gap={9}>
										<PayoutCard />
										<PayoutCard />
										<PayoutCard />
										<PayoutCard />
									</FansView>
								</FypCollapsible>
							</FansView>
						</FansView>
					</FansView>
				</ScrollView>
			</FansView>
			<CardActions
				open={openPaymentMethodActions}
				onClose={() => setOpenPaymentMethodActions(false)}
				actions={paymentActions}
			/>
		</AppLayout>
	);
};

export default GetPaidScreen;
