import {
	BlockSvg,
	CheckSvg,
	ChevronDownSvg,
	ChevronLeftSvg,
	ChevronRight2Svg,
	CloseSvg,
	PayoutSvg,
	PhonewithCashSvg,
	ThreeDotsVerticalSvg,
} from "@assets/svgs/common";
import RoundButton from "@components/common/RoundButton";
import {
	FansChips3,
	FansGap,
	FansHorizontalDivider,
	FansScreen3,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import { executePayout, getPayoutLogs } from "@helper/endpoints/payout/apis";
import tw from "@lib/tailwind";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { RoundButtonType } from "@usertypes/commonEnums";
import { ReferralProgramNativeStackParams } from "@usertypes/navigations";
import { IPayoutLog } from "@usertypes/types";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { DateTime } from "luxon";
import React, { Fragment, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import PayoutPendingModal from "./modal/PayoutPendingModal";

const ReferCreatorsPaymentsScreen = () => {
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

	const { refresh = false } = useLocalSearchParams();

	const [payoutLogs, setPayoutLogs] = useState<IPayoutLog[]>([]);

	const items = [
		{ text: "All" },
		{ text: "Pending" },
		{ text: "Declined" },
		{ text: "Past" },
	];
	const [selectedIndex, selectIndex] = useState(0);
	const handleSelect = (index: number) => {
		selectIndex(index);
	};

	const [page, setPage] = useState(1);
	const [pages, setPages] = useState(1);

	const [inProgress, setInProgress] = useState(false);

	const { dispatch, state } = useAppContext();
	const { userInfo } = state.user;

	const [isPayoutLogSheetVisible, setPayoutLogSheetVisible] = useState(false);
	const [selectedPayoutLog, setSelectedPayoutLog] =
		useState<IPayoutLog | null>();

	const handlePressEditSettings = () => {
		navigation.navigate("ReferralPayoutSetup");
	};
	const handleClosePayoutLogDialog = () => setPayoutLogSheetVisible(false);

	const getPaymentHistoryData = async () => {
		const logsData = await getPayoutLogs({}, { page });
		if (logsData.ok) {
			setPayoutLogs(logsData.data.payoutLogs);
			setPages(logsData.data.pages);
		}
	};

	const handlePressPayoutLog = (log: IPayoutLog) => {
		setPayoutLogSheetVisible(true);
		setSelectedPayoutLog(log);
	};

	const [isPayoutPendingModalOpened, setPayoutPendingModalOpened] =
		useState(false);
	const handlePayout = async () => {
		setInProgress(true);
		try {
			const response = await executePayout();
			if (response.ok) {
				dispatch.fetchUserInfo();
				setPayoutPendingModalOpened(true);
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

	const handleClosePayoutPendingModal = () => {
		setPayoutPendingModalOpened(false);
	};

	useEffect(() => {
		getPaymentHistoryData();
	}, [refresh]);

	useEffect(() => {
		getPaymentHistoryData();
	}, [page]);

	function Pagination() {
		const handlePageChange = (pageNumber: number) => {
			setPage(pageNumber);
		};

		const handleNext = () => {
			setPage((prevPageNumber) => Math.min(prevPageNumber + 1, pages));
		};

		const handlePrev = () => {
			setPage((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
		};

		const getPages = () => {
			const startPage = Math.max(page - 2, 1);
			const endPage = Math.min(startPage + 4, pages);
			return Array.from(
				{ length: endPage - startPage + 1 },
				(_, idx) => startPage + idx,
			);
		};

		return (
			<FansView alignItems="center" flexDirection="row">
				<TouchableOpacity onPress={handlePrev}>
					<FansView
						width={30}
						height={30}
						alignItems="center"
						borderColor={page === 1 ? "grey-de" : "grey-70"}
						borderRadius="full"
						justifyContent="center"
					>
						<FansSvg
							width={6.56}
							height={13.13}
							svg={ChevronLeftSvg}
							color1={page === 1 ? "grey-de" : "grey-70"}
						/>
					</FansView>
				</TouchableOpacity>
				<FansGap grow />
				<FansView flexDirection="row" style={tw.style("gap-[36px]")}>
					{getPages().map((pageNumber) => (
						<FansText
							key={pageNumber}
							onPress={() => handlePageChange(pageNumber)}
							fontFamily="inter-medium"
							fontSize={19}
							color={page === pageNumber ? "grey-70" : "grey-de"}
						>
							{pageNumber}
						</FansText>
					))}
				</FansView>
				<FansGap grow />
				<TouchableOpacity onPress={handleNext}>
					<FansView
						width={30}
						height={30}
						alignItems="center"
						borderColor={page === pages ? "grey-de" : "grey-70"}
						borderRadius="full"
						justifyContent="center"
					>
						<FansSvg
							width={6.56}
							height={13.13}
							svg={ChevronRight2Svg}
							color1={page === pages ? "grey-de" : "grey-70"}
						/>
					</FansView>
				</TouchableOpacity>
			</FansView>
		);
	}

	return (
		<FansScreen3 contentStyle1={{ maxWidth: { lg: 670 } }}>
			<FansView
				style={tw.style(
					"mt-[36px] bg-fans-white px-[17px] py-[22px]  shadow-lg rounded-[15px]",
					"w-full",
				)}
			>
				{tw.prefixMatch("lg") ? (
					<FansView style={tw.style("items-center")}>
						<FansText
							fontFamily="inter-semibold"
							fontSize={23}
							color="grey-70"
						>
							Your balance
						</FansText>
						<FansText fontFamily="inter-semibold" fontSize={45}>
							${userInfo.payoutBalance}
						</FansText>

						<FansGap height={24.3} />

						<RoundButton
							variant={RoundButtonType.OUTLINE_SECONDARY}
							onPress={handlePayout}
						>
							<FansView
								style={tw.style(
									"flex-row items-center w-[323px] h-full",
								)}
							>
								<FansView grow />
								<FansSvg
									width={14.68}
									height={14.67}
									svg={PayoutSvg}
									color1="green-4d"
								/>
								<FansGap width={5} />
								<FansText
									fontSize={19}
									style={tw.style("font-inter-bold")}
								>
									Payout
								</FansText>
								<FansView grow />
							</FansView>
						</RoundButton>

						<FansView
							style={{
								position: "absolute",
								left: 26.6,
								top: 0,
								bottom: 0,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<PhonewithCashSvg width={117.48} height={108.67} />
						</FansView>
					</FansView>
				) : (
					<FansView>
						<FansView style={{ flexDirection: "row" }}>
							<PhonewithCashSvg width={70.6} height={65.31} />

							<FansGap width={17.9} />

							<FansView>
								<FansText
									fontFamily="inter-semibold"
									fontSize={23}
								>
									Your balance
								</FansText>
								<FansGap height={6} />
								<FansText
									fontFamily="inter-semibold"
									fontSize={23}
								>
									${userInfo.payoutBalance}
								</FansText>
							</FansView>
						</FansView>

						<FansGap height={22} />

						<RoundButton
							disabled={inProgress}
							variant={RoundButtonType.SECONDARY}
							onPress={handlePayout}
						>
							<FansText
								fontSize={19}
								style={tw.style("font-inter-bold")}
							>
								Payout
							</FansText>
						</RoundButton>
					</FansView>
				)}
			</FansView>

			<FansGap height={29.1} />

			<FansText fontFamily="inter-semibold" fontSize={19}>
				Payout settings
			</FansText>
			<FansGap height={11} />
			<FansText color="grey-70" fontSize={16}>
				Edit your payment settings, including how you'd like to get paid
				and your tax information
			</FansText>

			<FansGap height={21} />

			<RoundButton
				variant={RoundButtonType.OUTLINE_SECONDARY}
				onPress={handlePressEditSettings}
			>
				<FansText fontSize={19} style={tw.style("font-inter-bold")}>
					Edit settings
				</FansText>
			</RoundButton>

			<FansGap height={32} />

			<FansText fontFamily="inter-semibold" fontSize={19}>
				Payout fee schedule
			</FansText>
			<FansGap height={11} />
			<FansText color="grey-70" fontSize={16}>
				This rate applies to the full amount of successful payouts,
				including any tax amounts applied
			</FansText>

			<FansGap height={49} />

			<FansText fontFamily="inter-semibold" fontSize={17}>
				Rate per payout
			</FansText>
			<FansGap height={34} />
			<FansText fontFamily="inter-regular" fontSize={16}>
				1% Fee
			</FansText>
			<FansGap height={37} />
			<FansText color="grey-70" fontSize={16}>
				Additional 1% to non-US PayPal payments
			</FansText>

			<FansGap height={39.1} />
			<FansHorizontalDivider />
			<FansGap height={36} />

			<FansView flexDirection="row" alignItems="center">
				<FansText fontFamily="inter-medium" fontSize={19}>
					Pending & past payouts
				</FansText>
				<FansView grow />
				<ChevronDownSvg width={14} height={7} rotation={180} />
			</FansView>

			<FansGap height={22} />

			<FansChips3
				data={items}
				value={selectedIndex}
				viewStyle={{
					style: tw.style(
						"mx-[-17px] px-[17px] py-2 grow-0 shrink-0",
					),
				}}
				chipsStyle={{ backgroundColor: "green-4d" }}
				onChangeValue={handleSelect}
				scrollEventThrottle={16}
			/>

			<FansGap height={15.3} />

			{payoutLogs.map((item, index) => {
				const { amount, createdAt, status } = item;

				const isSubscriptionUpdate = status === "Successful";
				const isPaymentFailed = status === "Cancelled";

				return (
					<Fragment key={index}>
						<FansView
							height={75}
							alignItems="center"
							flexDirection="row"
						>
							<FansView grow>
								<FansText fontSize={16}>
									${amount.toLocaleString()}
								</FansText>
								<FansText fontSize={13} color="grey-70">
									{"Wells Fargo Bank **** 1234"}
								</FansText>
							</FansView>
							<FansView alignItems="end">
								<FansView
									style={tw.style(
										isSubscriptionUpdate
											? "bg-fans-green/10 pl-2 pr-2 pt-0.5 pb-0.5 self-end"
											: "bg-fans-red-fd pl-2 pr-2 pt-0.5 pb-0.5 self-end",
									)}
									alignItems="center"
									borderRadius="full"
									flexDirection="row"
									justifyContent="center"
								>
									{isSubscriptionUpdate ? (
										<FansSvg
											width={10.04}
											height={7.01}
											svg={CheckSvg}
											color1="green"
										/>
									) : isPaymentFailed ? (
										<FansSvg
											width={7.73}
											height={7.73}
											svg={CloseSvg}
											color1="red"
										/>
									) : (
										<FansSvg
											width={11.07}
											height={11.06}
											svg={BlockSvg}
											color="red"
										/>
									)}
									<FansGap width={5} />
									<FansText
										color={
											isSubscriptionUpdate
												? "green"
												: "red"
										}
										fontSize={14}
									>
										{status.toUpperCase()}
									</FansText>
								</FansView>
								<FansText color="grey-70" fontSize={14}>
									{DateTime.fromISO(createdAt).toFormat(
										"MMM d, h:m a",
									)}
								</FansText>
							</FansView>
							<FansGap width={19.5} />
							<TouchableOpacity
								onPress={() => handlePressPayoutLog(item)}
							>
								<ThreeDotsVerticalSvg size={18} />
							</TouchableOpacity>
						</FansView>
					</Fragment>
				);
			})}
			<FansGap height={22.5} />
			<Pagination />
			<FansGap height={20} />

			{/* {isPayoutLogSheetVisible && selectedPayoutLog && (
				<PaymentHistorySheet
					payoutLog={selectedPayoutLog}
					onClose={handleClosePayoutLogDialog}
					onSubmit={() => {}}
				/>
			)} */}

			<PayoutPendingModal
				visible={isPayoutPendingModalOpened}
				onClose={handleClosePayoutPendingModal}
				onSubmit={() => {}}
			/>
		</FansScreen3>
	);
};

export default ReferCreatorsPaymentsScreen;
