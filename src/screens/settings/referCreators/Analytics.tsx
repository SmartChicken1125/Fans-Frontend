import { CalendarSvg, ChevronDownSvg, SearchSvg } from "@assets/svgs/common";
import {
	FansChips3,
	FansGap,
	FansHorizontalDivider,
	FansScreen3,
	FansText,
	FansTextInput,
	FansView,
} from "@components/controls";
import { FilterDuringDialog } from "@components/dialogs/chat";
import { BanModal } from "@components/modals";
import { Transaction } from "@components/payment";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import { LineChart } from "@components/screens/settings/analytics";
import {
	getCreatorReferralCreators,
	getCreatorReferralLinkPerformance,
	getCreatorReferralTotalEarning,
	getCreatorReferralTransactions,
} from "@helper/endpoints/referral/apis";
import {
	GetCreatorReferralCreatorsReqQueryParams,
	GetCreatorReferralTotalEarningReqQueryParams,
} from "@helper/endpoints/referral/schemas";
import tw from "@lib/tailwind";
import {
	NativeStackNavigationProp,
	createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import {
	ReferralProgramNativeStackParams,
	SettingsReferCreatorsNativeStackParams,
} from "@usertypes/navigations";
import {
	CreatorReferralCreator,
	CreatorReferralLinkPerformance,
	CreatorReferralTransaction,
	ITimeline,
} from "@usertypes/types";
import {
	CategoryScale,
	Chart,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import { useNavigation, useRouter } from "expo-router";
import { DateTime } from "luxon";
import React, { Fragment, useEffect, useState } from "react";
import SettingsNavigationHeader from "../../../components/screens/settings/SettingsNavigationHeader";
import TransactionHistorySheet from "./TransactionHistorySheet";
import CreatorItem from "./item/CreatorItem";
import LinkItem from "./item/LinkItem";

const Stack =
	createNativeStackNavigator<SettingsReferCreatorsNativeStackParams>();

const SettingsReferCreatorsNativeStack = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="ReferralAnalytics"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="ReferralAnalytics"
				component={ReferCreatorsAnalyticsContentView}
				options={{
					title: "Refer creator analytics",
				}}
			/>
		</Stack.Navigator>
	);
};

Chart.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

interface LinkPerformanceProps {
	onBan: () => void;
}

const LinkPerformance = (props: LinkPerformanceProps) => {
	const items = [{ text: "Highest earnings" }, { text: "Highest CTR" }];
	const [selectedIndex, selectIndex] = useState(0);
	const handleSelect = (index: number) => {
		selectIndex(index);
	};

	const { onBan: handlePressBan } = props;
	const [selected, setItem] = useState(0);
	const [refreshKey, setRefreshKey] = useState(0);

	const handlePressExpand = (index: number, state: boolean) => {
		if (state) setItem(index);
		else setItem(-1);
	};

	const [links, setLinks] = useState<CreatorReferralLinkPerformance[]>([]);
	const [filteredLinks, setFilteredLinks] = useState<
		CreatorReferralLinkPerformance[]
	>([]);
	const [searchQuery, setSearchQuery] = useState("");

	const onChangeSearch = (query: string) => {
		setSearchQuery(query);
	};

	useEffect(() => {
		setFilteredLinks(
			links.filter((el) => (el.code ?? "").indexOf(searchQuery) >= 0),
		);
	}, [searchQuery, links, refreshKey]);

	const [startDate, setStartDate] = useState<DateTime | undefined>();
	const [endDate, setEndDate] = useState<DateTime | undefined>();
	useEffect(() => {
		const fetchLinkPerformance = async () => {
			const resp = await getCreatorReferralLinkPerformance({
				from: startDate?.toISO() ?? undefined,
				to: endDate?.toISO() ?? undefined,
				sort: selectedIndex == 0 ? "highest_earnings" : "highest_ctr",
			});
			if (resp.ok) {
				setLinks(resp.data.creatorReferrals);
			}
		};

		fetchLinkPerformance();
	}, [selectedIndex, startDate, endDate]);

	const [isOpenCalendar, setIsOpenCalendar] = useState(false);
	const handleOpenCalendar = () => {
		setIsOpenCalendar(true);
	};
	const handleCloseCalendar = () => {
		setIsOpenCalendar(false);
	};

	return (
		<FansView>
			<FansText fontSize={23}>Link Performance</FansText>

			<FansTextInput
				icon={SearchSvg}
				placeholder="Search"
				style={tw.style("mt-[21px]")}
				value={searchQuery}
				onChangeText={onChangeSearch}
			/>

			<FansGap height={15.3} />

			<FansView flexDirection="row" alignItems="center">
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

				<FansView grow />

				<FansView
					width={26.5}
					height={28.49}
					touchableOpacityProps={{ onPress: handleOpenCalendar }}
					padding={5}
				>
					<CalendarSvg width={16.5} height={18.49} />
				</FansView>
			</FansView>

			<FansGap height={15.3} />

			{filteredLinks.map((item, index) => {
				const { id } = item;
				return (
					<Fragment key={id}>
						{index !== 0 && (
							<FansHorizontalDivider
								height={2}
								style={{ marginVertical: 16 }}
							/>
						)}
						<LinkItem
							data={item}
							onDeleteLink={() => {
								setRefreshKey(refreshKey + 1);
							}}
						/>
					</Fragment>
				);
			})}

			<FilterDuringDialog
				open={isOpenCalendar}
				onClose={handleCloseCalendar}
				onSubmit={(from, to) => {
					if (typeof from === "string") {
						setStartDate(DateTime.fromISO(from));
					} else {
						setStartDate(DateTime.fromISO(from.toISOString()));
					}
					if (typeof to === "string") {
						setEndDate(DateTime.fromISO(to));
					} else {
						setStartDate(DateTime.fromISO(to.toISOString()));
					}
				}}
			/>
		</FansView>
	);
};

const Transactions = () => {
	const [transactions, setTransactions] = useState<
		CreatorReferralTransaction[]
	>([]);

	const [searchQuery, setSearchQuery] = useState("");
	const onChangeSearch = (query: string) => {
		setSearchQuery(query);
	};
	const [page, setPage] = useState(1);
	const router = useRouter();

	useEffect(() => {
		const fetchLinkPerformance = async () => {
			const resp = await getCreatorReferralTransactions({
				query: searchQuery,
				page: page,
				size: 10,
			});
			if (resp.ok) {
				setTransactions(resp.data.transactions);
			}
		};

		fetchLinkPerformance();
	}, [searchQuery, page]);

	const [isTransactionSheetVisible, setTransactionSheetVisible] =
		useState(false);
	const [selectedTransaction, setSelectedTransaction] =
		useState<CreatorReferralTransaction>();
	const handleCloseTransactionDialog = () =>
		setTransactionSheetVisible(false);

	return (
		<FansView>
			<FansText fontSize={23}>Transactions</FansText>
			<FansTextInput
				icon={SearchSvg}
				placeholder="Search"
				style={tw.style("mt-[21px]")}
				value={searchQuery}
				onChangeText={onChangeSearch}
			/>

			<FansGap height={15.3} />
			<FansView style={tw.style("mt-[33px]")}>
				{transactions.map((item, index) => (
					<Transaction
						data={item}
						key={index}
						onClickAvatar={() => {
							if (item.referent?.profileLink) {
								router.push(`/${item.referent?.profileLink}`);
							}
						}}
						onClickMenu={() => {
							setTransactionSheetVisible(true);
							setSelectedTransaction(item);
						}}
					/>
				))}
			</FansView>

			{isTransactionSheetVisible && (
				<TransactionHistorySheet
					creatorReferralTransaction={selectedTransaction}
					onClose={handleCloseTransactionDialog}
					onSubmit={() => {}}
				/>
			)}
		</FansView>
	);
};

const Earnings = () => {
	const items = [{ text: "Highest earnings" }, { text: "Highest MMR" }];
	const [selectedIndex, selectIndex] = useState(0);
	const handleSelect = (index: number) => {
		selectIndex(index);
	};

	const [transactions, setTransactions] = useState<
		CreatorReferralTransaction[]
	>([]);
	const [timeline, setTimeline] = useState<ITimeline[]>([]);
	const [period, setPeriod] = useState("today");
	const [duration, setDuration] = useState("Today");
	const [points, setPoints] = useState<DateTime[]>([]);

	const [earnings, setEarnings] = useState(0);

	const [creators, setCreators] = useState<CreatorReferralCreator[]>([]);
	const [filteredCreators, setFilteredCreators] = useState<
		CreatorReferralCreator[]
	>([]);

	const [selectedCreator, setSelectedCreator] = useState("");
	const [selectedTimeline, setSelectedTimeline] = useState<ITimeline[]>([]);
	const [selectedDuration, setSelectedDuration] = useState("Today");

	const [searchQuery, setSearchQuery] = useState("");

	const onChangeSearch = (query: string) => {
		setSearchQuery(query);
	};

	const router = useRouter();

	useEffect(() => {
		setFilteredCreators(
			creators.filter(
				(el) =>
					(el.referent?.displayName ?? "").indexOf(searchQuery) >= 0,
			),
		);
	}, [searchQuery, creators]);

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
				};
			}

			const resp = await getCreatorReferralTotalEarning(params);
			if (resp.ok) {
				setEarnings(resp.data.totalEarning);

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
					sort:
						selectedIndex == 0 ? "highest_earnings" : "highest_mmr",
				};
			} else {
				params = {
					sort:
						selectedIndex == 0 ? "highest_earnings" : "highest_mmr",
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
	}, [duration, selectedIndex]);

	return (
		<FansView>
			<FansText fontFamily="inter-medium" fontSize={23}>
				Earnings
			</FansText>
			<FansText color="green-4d" fontFamily="inter-medium" fontSize={34}>
				${earnings}
			</FansText>

			<FansGap height={28} />

			<LineChart
				timeline={timeline}
				duration={duration}
				setDuration={setDuration}
				period={period}
			/>

			<FansGap height={41} />

			<FansHorizontalDivider />

			<FansGap height={36} />

			<FansView flexDirection="row" alignItems="center">
				<FansText fontFamily="inter-medium" fontSize={19}>
					Referred creators
				</FansText>
				<FansView grow />
				<ChevronDownSvg width={14} height={7} rotation={180} />
			</FansView>

			<FansGap height={22} />

			<FansTextInput
				icon={SearchSvg}
				placeholder="Search"
				value={searchQuery}
				onChangeText={onChangeSearch}
			/>

			<FansGap height={15.3} />

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

			{filteredCreators.map((item, index) => {
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
								if (item.referent?.profileLink) {
									router.push(
										`/${item.referent?.profileLink}`,
									);
								}
							}}
							onClick={() => {
								setSelectedCreator(item.referentId);
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
						{selectedCreator === item.referentId && (
							<LineChart
								timeline={selectedTimeline}
								duration={selectedDuration}
								setDuration={setSelectedDuration}
								period={period}
							/>
						)}
					</Fragment>
				);
			})}
		</FansView>
	);
};

const ReferCreatorsAnalyticsContentView = () => {
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

	navigation.setOptions({
		header: (props) => SettingsNavigationHeader(props, router),
	});

	const items = [
		{ text: "Earnings" },
		{ text: "Link performance" },
		{ text: "Transactions" },
	];

	const [isBanModalVisible, setBanModalVisible] = useState(false);
	const [selectedIndex, selectIndex] = useState(0);

	const handleBan = () => setBanModalVisible(true);

	const handleCloseBanModal = () => setBanModalVisible(true);

	const handleSelect = (index: number) => {
		selectIndex(index);
	};

	return (
		<FansScreen3 contentStyle1={{ maxWidth: { lg: 670 } }}>
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
			<FansGap height={30} />
			{selectedIndex === 0 && <Earnings />}
			{selectedIndex === 1 && <LinkPerformance onBan={handleBan} />}
			{selectedIndex === 2 && <Transactions />}
			<BanModal
				visible={isBanModalVisible}
				onClose={handleCloseBanModal}
				onSubmit={() => {}}
			/>{" "}
		</FansScreen3>
	);
};

const ReferCreatorsAnalyticsScreen = () => {
	return SettingsNavigationLayout(<SettingsReferCreatorsNativeStack />);
};

export default ReferCreatorsAnalyticsScreen;
