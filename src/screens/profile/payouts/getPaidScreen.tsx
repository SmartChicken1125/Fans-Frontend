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
import { PayoutRequestSuccessModal } from "@components/profiles";
import { useAppContext } from "@context/useAppContext";
import { formatPrice } from "@helper/Utils";
import {
	fetchPayoutMethod,
	deletePayoutMethod,
	executePayout,
	getPayoutLogs,
} from "@helper/endpoints/payout/apis";
import tw from "@lib/tailwind";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { IconTypes, PaymentMethodType } from "@usertypes/commonEnums";
import { SettingsReferralProgramNativeStackParams } from "@usertypes/navigations";
import {
	ICardAction,
	IPayoutLog,
	PayoutMethod,
	PayPalPayoutMethod,
	SortType,
	PayoutHistory,
	PayoutStatusType,
} from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import { useNavigation, useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState, FC } from "react";
import { ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import OldGetPaidScreen from "./oldGetPaidScreen";

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

interface PayoutCardProps {
	amount: number;
	date: string;
	status: string;
	paymentInformation?: string;
}

const PayoutCard: FC<PayoutCardProps> = (props) => {
	const { amount, date, status, paymentInformation } = props;

	const [openLink] = useBlankLink();
	const [expanded, setExpanded] = useState(false);

	const handlePressSupport = () => {
		openLink("https://support.fyp.fans");
	};

	const titles = {
		Successful: "Payout processed",
		Cancelled: "Payout cancelled",
		Pending: "Payout pending",
	};

	const priceColors = {
		Successful: ["#24A2FF", "#23C9B1", "#89F276"],
		Cancelled: ["#E92950", "#E53EC6"],
		Pending: ["#FB6B63", "#F98632"],
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
							{titles[status as keyof typeof titles]}
						</FypText>
					</FansView>

					<FypText
						fontSize={14}
						lineHeight={21}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
						)}
					>
						{paymentInformation}
					</FypText>
				</FansView>
				<FansView gap={6} alignItems="end">
					<FypLinearGradientView
						colors={priceColors[status as keyof typeof priceColors]}
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
							{formatPrice(amount)}
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
							{moment(date).format("DD/MM/YYYY")}
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
							{moment(date).format("hh:mm a")}
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
								<PayoutDetail
									title="Amount"
									value={formatPrice(amount)}
								/>
							</FansView>
							<FansView flex="1">
								<PayoutDetail
									title="Initiated"
									value={moment(date).format(
										"MMM D, YYYY hh:mm a",
									)}
								/>
							</FansView>
						</FansView>
						<FansDivider />
						<FansView flexDirection="row" alignItems="center">
							<FansView flex="1">
								<PayoutDetail
									title="To"
									value={paymentInformation ?? ""}
								/>
							</FansView>
							<FansView flex="1">
								<PayoutDetail title="Status" value={status} />
							</FansView>
						</FansView>
					</FansView>
					<FansView gap={14} style={tw.style("md:hidden")}>
						<PayoutDetail
							title="Amount"
							value={formatPrice(amount)}
						/>
						<FansDivider />
						<PayoutDetail
							title="To"
							value={paymentInformation ?? ""}
						/>
						<FansDivider />
						<PayoutDetail
							title="Initiated"
							value={moment(date).format("MMM D, YYYY hh:mm a")}
						/>
						<FansDivider />
						<PayoutDetail title="Status" value={status} />
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

const NewGetPaidScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SettingsReferralProgramNativeStackParams>
		>();

	const router = useRouter();
	const { state, dispatch } = useAppContext();
	const { user } = state;
	const { userInfo } = user;

	const [paymentMethod, setPaymentMethod] = useState<
		PayoutMethod | undefined
	>();
	const [openPaymentMethodActions, setOpenPaymentMethodActions] =
		useState(false);
	const [inProgress, setInProgress] = useState(false);
	const [maxPayout, setMaxPayout] = useState(0);
	const [totalPayoutAmount, setTotalPayoutAmount] = useState(0);
	const [showPayouts, setShowPayouts] = useState(true);
	const [filter, setFilter] = useState("All");
	const [orderBy, setOrderBy] = useState<SortType>("Newest");
	const [page, setPage] = useState(1);
	const [payoutLogs, setPayoutLogs] = useState<IPayoutLog[]>([]);
	const [openRequestSuccessModal, setOpenRequestSuccessModal] =
		useState(false);

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
		const getPayoutMethod = async () => {
			const response = await fetchPayoutMethod();
			if (response.ok) setPaymentMethod(response.data);
		};
		getPayoutMethod();
	}, []);

	useEffect(() => {
		const fetchPayoutLogs = async () => {
			const response = await getPayoutLogs({
				page,
				filter,
				orderBy,
			});
			if (response.ok) {
				setPayoutLogs(response.data.payoutLogs);
			}
		};
		fetchPayoutLogs();
	}, [page, filter, orderBy]);

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
				setPage(1);
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

	const handleOpenPostMethodActions = () => {
		setOpenPaymentMethodActions(true);
	};

	const onEditPaymentMethod = () => {
		setOpenPaymentMethodActions(false);
		navigation.navigate("PayoutSetup");
	};

	const onDeletePaymentMethod = async () => {
		setOpenPaymentMethodActions(false);
		setInProgress(true);
		try {
			const response = await deletePayoutMethod({});

			if (response.ok) {
				Toast.show({
					type: "success",
					text1: "Payment method deleted",
				});
				setPaymentMethod(undefined);
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
						<FansView style={tw.style("md:px-[22px]")}>
							<CustomTopNavBar
								title="Payments"
								onClickLeft={() => navigation.goBack()}
								style="border-b-0"
							/>
						</FansView>

						<FansView style={tw.style("md:px-10 xl:pr-[140px]")}>
							<FansDivider style={tw.style("bg-fans-white/20")} />
						</FansView>
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
										// onPress: onExecutePayout,
										onPress: () =>
											setOpenRequestSuccessModal(true),
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

								{!paymentMethod && (
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

								{paymentMethod ? (
									<FansView>
										<PaymentMethod
											key={paymentMethod.id}
											title={paymentMethod.payoutMethod}
											paymentInformation={
												paymentMethod.payoutMethod ===
												"IBAN"
													? paymentMethod.iban!
													: paymentMethod.payoutMethod ===
													  "Payoneer"
													? paymentMethod.payoneer!
													: paymentMethod.payoutMethod ===
													  "Revolut"
													? paymentMethod.revolut!
													: paymentMethod.payoutMethod ===
													  "DirectDeposit"
													? paymentMethod.accountNumber!
													: ""
											}
											paymentMethodType={
												PaymentMethodType[
													paymentMethod.payoutMethod as keyof typeof PaymentMethodType
												]
											}
											onClickDots={() =>
												handleOpenPostMethodActions()
											}
										/>
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
										minimal currency conversion fee may
										apply if your bank operates in a
										currency other than USD
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
											style={tw.style(
												"w-[14px] h-[14px]",
											)}
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
														isSelected={
															filter === el
														}
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
											{payoutLogs.map((log) => (
												<PayoutCard
													key={log.id}
													amount={log.amount}
													date={log.createdAt}
													status={log.status}
													paymentInformation={
														log.paymentInformation
													}
												/>
											))}
										</FansView>
									</FypCollapsible>
								</FansView>
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
			<PayoutRequestSuccessModal
				visible={openRequestSuccessModal}
				handleClose={() => setOpenRequestSuccessModal(false)}
			/>
		</AppLayout>
	);
};

const GetPaidScreenWrapper = () => {
	const featureGates = useFeatureGates();
	return featureGates.has("2024_02-new-payout-screen") ? (
		<NewGetPaidScreen />
	) : (
		<OldGetPaidScreen />
	);
};

export default GetPaidScreenWrapper;
