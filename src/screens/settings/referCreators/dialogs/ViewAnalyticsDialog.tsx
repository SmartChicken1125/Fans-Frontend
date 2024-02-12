import { ChevronLeft1Svg, CloseSvg } from "@assets/svgs/common";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import {
	FansGap,
	FansHorizontalDivider,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import { LineChart } from "@components/screens/settings/analytics";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import { formatPrice } from "@helper/Utils";
import {
	getCreatorReferralCreators,
	getCreatorReferralTotalEarning,
} from "@helper/endpoints/referral/apis";
import {
	GetCreatorReferralCreatorsReqQueryParams,
	GetCreatorReferralTotalEarningReqQueryParams,
} from "@helper/endpoints/referral/schemas";
import tw from "@lib/tailwind";
import {
	CreatorReferral,
	CreatorReferralCreator,
	CreatorReferralTransaction,
	ITimeline,
} from "@usertypes/types";
import { useRouter } from "expo-router";
import { DateTime } from "luxon";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import CreatorItem from "../item/CreatorItem";

const ViewAnalyticsDialog = (props: { referral: CreatorReferral }) => {
	const { state, dispatch } = useAppContext();
	const { openViewAnalyticsModal } = state.common;

	const [transactions, setTransactions] = useState<
		CreatorReferralTransaction[]
	>([]);
	const [timeline, setTimeline] = useState<ITimeline[]>([]);
	const [period, setPeriod] = useState("today");
	const [duration, setDuration] = useState("Today");
	const [points, setPoints] = useState<DateTime[]>([]);

	const [visibleCreators, setVisibleCreators] = useState(false);

	const [selectedCreator, setSelectedCreator] = useState("");
	const [selectedTimeline, setSelectedTimeline] = useState<ITimeline[]>([]);
	const [selectedDuration, setSelectedDuration] = useState("Today");

	const [earnings, setEarnings] = useState(0);
	const [
		prevPeriodEarningsPercentageDifference,
		setPrevPeriodEarningsPercentageDifference,
	] = useState(0);
	const [numberOfCreators, setNumberOfCreators] = useState(0);

	const [link, setLink] = useState(
		`fyp.fans/?r=${props.referral.code ?? ""}`,
	);
	useEffect(() => {
		setLink(`fyp.fans/?r=${props.referral.code ?? ""}`);
	}, [props, props.referral, props.referral.code]);

	const open = useMemo(
		() => (openViewAnalyticsModal ? true : false),
		[openViewAnalyticsModal],
	);

	const onClose = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleViewAnalyticsModal,
			data: false,
		});
	};
	const handleViewCreators = () => {
		setVisibleCreators(true);
	};
	const handleHideCreators = () => {
		setVisibleCreators(false);
	};

	const [creators, setCreators] = useState<CreatorReferralCreator[]>([]);
	const router = useRouter();

	const getTimeline = (transactions: CreatorReferralTransaction[]) => {
		const timeline = new Map<DateTime, ITimeline>();
		points.forEach((point) => {
			timeline.set(point, {
				date: point.toISO()!,
				earnings: 0,
			});
		});

		transactions.forEach((transaction) => {
			points.forEach((point) => {
				if (
					point > DateTime.fromJSDate(new Date(transaction.updatedAt))
				) {
					timeline.set(point, {
						date: point.toISO()!,
						earnings:
							transaction.amount +
							(timeline.get(point)?.earnings ?? 0),
					});
				}
			});
		});

		return Array.from(timeline.values());
	};

	useEffect(() => {
		const fetchEarningsAnalytics = async () => {
			const now = DateTime.local();
			let params: GetCreatorReferralTotalEarningReqQueryParams = {};
			let interval = {};
			let current;

			switch (duration) {
				case "Today":
					current = now.minus({ days: 1 });
					interval = { seconds: 3 * 60 * 60 };
					break;
				case "1W":
					current = now.minus({ weeks: 1 });
					interval = { days: 1 };
					break;
				case "1M":
					current = now.minus({ months: 1 });
					interval = { days: 3 };
					break;
				case "3M":
					current = now.minus({ months: 3 });
					interval = { weeks: 1 };
					break;
				case "6M":
					current = now.minus({ months: 6 });
					interval = { months: 1 };
					break;
				case "1Y":
					current = now.minus({ years: 1 });
					interval = { months: 1 };
					break;
				case "All":
					break;
			}

			setPoints([]);
			if (current) {
				while (current <= now) {
					points.push(current);
					current = current.plus(interval);
				}

				params = {
					from: current.toISO()!,
					to: now.toISO()!,
					code: props.referral.code,
				};
			} else {
				params = {
					code: props.referral.code,
				};
			}

			const resp = await getCreatorReferralTotalEarning(params);
			if (resp.ok) {
				setEarnings(resp.data.totalEarning);
				setPrevPeriodEarningsPercentageDifference(resp.data.percentage);
				setNumberOfCreators(resp.data.creatorCount);

				if (duration === "All") {
					if (resp.data.transactions.length > 0) {
						const first = resp.data.transactions[0];
						const firstTime = DateTime.fromJSDate(
							new Date(first.updatedAt),
						);

						if (firstTime > now.minus({ days: 1 })) {
							current = now.minus({ days: 1 });
							interval = { seconds: 3 * 60 * 60 };
							setPeriod("hour");
						} else if (firstTime > now.minus({ weeks: 1 })) {
							current = now.minus({ weeks: 1 });
							interval = { days: 1 };
							setPeriod("day");
						} else if (firstTime > now.minus({ months: 1 })) {
							current = now.minus({ months: 1 });
							interval = { days: 3 };
							setPeriod("day");
						} else if (firstTime > now.minus({ months: 3 })) {
							current = now.minus({ months: 3 });
							interval = { weeks: 1 };
							setPeriod("day");
						} else if (firstTime > now.minus({ months: 6 })) {
							current = now.minus({ months: 6 });
							interval = { months: 1 };
							setPeriod("month");
						} else if (firstTime > now.minus({ years: 1 })) {
							current = now.minus({ years: 1 });
							interval = { months: 1 };
							setPeriod("month");
						} else {
							current = now;
							let years = 0;
							while (firstTime < current) {
								years++;
								current = now.minus({ years: 5 });
								interval = { years: years };
							}
							setPeriod("year");
						}

						while (current <= now) {
							points.push(current);
							current = current.plus(interval);
						}
					} else {
						interval = { days: 1 };
						current = now.minus({ weeks: 1 });
						while (current <= now) {
							points.push(current);
							current = current.plus(interval);
						}

						setPeriod("day");
					}
				}

				setTransactions(resp.data.transactions);
				setTimeline(getTimeline(resp.data.transactions));
			}
		};

		const fetchCreators = async () => {
			let params: GetCreatorReferralCreatorsReqQueryParams = {};
			let interval = {};
			let current;

			const now = DateTime.local();
			switch (duration) {
				case "Today":
					current = now.minus({ days: 1 });
					interval = { seconds: 3 * 60 * 60 };
					break;
				case "1W":
					current = now.minus({ weeks: 1 });
					interval = { days: 1 };
					break;
				case "1M":
					current = now.minus({ months: 1 });
					interval = { days: 3 };
					break;
				case "3M":
					current = now.minus({ months: 3 });
					interval = { weeks: 1 };
					break;
				case "6M":
					current = now.minus({ months: 6 });
					interval = { months: 1 };
					break;
				case "1Y":
					current = now.minus({ years: 1 });
					interval = { months: 1 };
					break;
				case "All":
					break;
			}

			if (current) {
				while (current <= now) {
					current = current.plus(interval);
				}

				params = {
					from: current.toISO()!,
					to: now.toISO()!,
					code: props.referral.code,
				};
			} else {
				params = {
					code: props.referral.code,
				};
			}

			setSelectedCreator("");

			const resp = await getCreatorReferralCreators(params);
			if (resp.ok) {
				setCreators(resp.data.creators);
			}
		};

		fetchEarningsAnalytics();
		fetchCreators();
	}, [duration, props.referral.code]);

	return (
		<BottomSheetWrapper
			open={open}
			onClose={onClose}
			dialogWrapperStyle="md:max-w-[740px]"
			topLineStyle="md:hidden"
		>
			<View style={tw.style("pb-3 md:pb-0 px-[19px] md:px-[32px]")}>
				<View
					style={tw.style(
						"relative md:pb-[34px] md:pt-[15px] items-center",
					)}
				>
					<View
						style={tw.style(
							"hidden absolute right-[0px] top-[6px] md:flex w-7.5 h-7.5",
						)}
					>
						<IconButton
							icon={() => <CloseSvg size={13.2} color="#fff" />}
							containerColor="rgba(0,0,0,0.3)"
							style={tw.style("m-0 w-7.5 h-7.5 ")}
							onPress={onClose}
						/>
					</View>

					{visibleCreators && (
						<FansView
							touchableOpacityProps={{
								onPress: handleHideCreators,
							}}
							width={32}
							height={24}
							padding={{ x: 12, y: 4 }}
							style={{
								position: "absolute",
								left: 0,
							}}
						>
							<FansSvg
								width={8}
								height={16}
								svg={ChevronLeft1Svg}
							/>
						</FansView>
					)}

					<FansText fontFamily="inter-bold" fontSize={19}>
						{visibleCreators ? "Referred creators" : link}
					</FansText>

					<FansGap height={38} />

					{!visibleCreators ? (
						<FansView width="full">
							<FansText fontFamily="inter-medium" fontSize={23}>
								Total earnings
							</FansText>
							<FansText
								color="green-4d"
								fontFamily="inter-medium"
								fontSize={34}
							>
								{formatPrice(earnings)}
							</FansText>

							<FansGap height={26} />

							<FansText fontFamily="inter-medium" fontSize={23}>
								Affiliate percentage
							</FansText>
							<FansText
								color="green-4d"
								fontFamily="inter-medium"
								fontSize={34}
							>
								{prevPeriodEarningsPercentageDifference.toLocaleString()}
								%
							</FansText>

							<FansGap height={26} />

							<FansView
								grow
								flexDirection="row"
								alignItems="center"
								justifyContent="between"
							>
								<FansText
									fontFamily="inter-medium"
									fontSize={23}
								>
									Total creators
								</FansText>
								<FansText
									color="green-4d"
									fontFamily="inter-medium"
									fontSize={17}
									onPress={handleViewCreators}
								>
									View creators
								</FansText>
							</FansView>
							<FansText
								color="green-4d"
								fontFamily="inter-medium"
								fontSize={34}
							>
								{numberOfCreators}
							</FansText>

							<FansGap height={44.5} />

							<LineChart
								timeline={timeline}
								duration={duration}
								setDuration={setDuration}
								period={period}
							/>
						</FansView>
					) : (
						<FansView width="full">
							{creators.map((item, index) => {
								return (
									<Fragment key={index}>
										{index !== 0 && (
											<FansHorizontalDivider
												height={2}
												style={{ marginVertical: 16 }}
											/>
										)}
										<CreatorItem
											data={item}
											onClickAvatar={() => {
												if (
													item.referent?.profileLink
												) {
													router.push(
														`/${item.referent?.profileLink}`,
													);
												}
											}}
											onClick={() => {
												setSelectedCreator(
													item.referentId,
												);
												setSelectedDuration("Today");
												setSelectedTimeline(
													getTimeline(
														transactions.filter(
															(transaction) =>
																transaction.referentId ===
																item.referentId,
														),
													),
												);
											}}
										/>
										{selectedCreator ===
											item.referentId && (
											<LineChart
												timeline={selectedTimeline}
												duration={selectedDuration}
												setDuration={
													setSelectedDuration
												}
												period={period}
											/>
										)}
									</Fragment>
								);
							})}
						</FansView>
					)}
				</View>
			</View>
		</BottomSheetWrapper>
	);
};

export default ViewAnalyticsDialog;
