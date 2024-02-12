import {
	ArrowDownSvg,
	ArrowUpSvg,
	Block1Svg,
	BlockSvg,
	Calendar1Svg,
	Chat1Svg,
	Check1Svg,
	ChevronDown3Svg,
	ChevronRight2Svg,
	ChevronUp1Svg,
	Close0Svg,
	Cursor1Svg,
	CursorSvg,
	Diamond1Svg,
	Dollar1Svg,
	Dollar5Svg,
	DotsVerticalSvg,
	EditSvg,
	Eye2Svg,
	Heart1Svg,
	ImageSvg,
	Mail2Svg,
	Reply1Svg,
	Search1Svg,
	ShopSvg,
	StatisticsSvg,
	ThreeDotsSvg,
	User1Svg,
} from "@assets/svgs/common";
import { LevelDevotedImage } from "@assets/svgs/images";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypLinearGradientView,
	FypLink,
	FypSvg,
	FypText,
} from "@components/common/base";
import {
	FansChips3,
	FansChips4,
	FansDivider,
	FansGap,
	FansHorizontalDivider,
	FansIconButton,
	FansImage2,
	FansScreen3,
	FansSvg,
	FansSwitch1,
	FansText,
	FansTextInput5,
	FansView,
} from "@components/controls";
import { BanModal } from "@components/modals";
import { PostAnalyticsModal } from "@components/modals/shop";
import { SendMessageDialog } from "@components/posts/dialogs";
import SettingsNavigationHeader from "@components/screens/settings/SettingsNavigationHeader";
import SettingsNavigationLayout from "@components/screens/settings/SettingsNavigationLayout";
import { LineChart } from "@components/screens/settings/analytics";
import {
	PostSheet,
	TransactionSheet,
} from "@components/sheet/settings/analytics";
import { defaultProfileData } from "@constants/common";
import { useAppContext } from "@context/useAppContext";
import {
	AnalyticsIPost,
	IPost,
	ISubscriber,
	ITransactionCreator,
} from "@helper/CommonAPISchemas";
import { cdnURL } from "@helper/Utils";
import { getOrCreateConversation } from "@helper/endpoints/chat/apis";
import {
	getEarnings,
	getSubscribers,
	getTransactions,
	refund,
	getPaidPostsEarnings,
	getTopPosts,
} from "@helper/endpoints/creator/apis";
import { getPaidPosts } from "@helper/endpoints/post/apis";
import { PostListRespBody } from "@helper/endpoints/post/schemas";
import { getPostAnalytics } from "@helper/endpoints/settings/apis";
import tw from "@lib/tailwind";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { updateInbox } from "@state/chat";
import { useFeatureGates } from "@state/featureGates";
import { PostType } from "@usertypes/commonEnums";
import { Colors } from "@usertypes/enums";
import { SettingsAnalyticsNativeStackParams } from "@usertypes/navigations";
import { IPostFilterQuery } from "@usertypes/params";
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
import { useRouter } from "expo-router";
import { DateTime } from "luxon";
import React, {
	FC,
	Fragment,
	MutableRefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Line } from "react-chartjs-2";
import { Animated, Image, NativeScrollEvent, ScrollView } from "react-native";
import {
	PanGestureHandler,
	PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import {
	useAnimatedGestureHandler,
	useSharedValue,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator<SettingsAnalyticsNativeStackParams>();

const SettingsAnalyticsNativeStack = () => {
	const router = useRouter();

	return (
		<Stack.Navigator
			initialRouteName="Analytics"
			screenOptions={{
				header: (props) => SettingsNavigationHeader(props, router),
			}}
		>
			<Stack.Screen
				name="Analytics"
				component={AnalyticsConstantView}
				options={{
					title: "Analytics",
				}}
			/>
		</Stack.Navigator>
	);
};

type ContextType = {
	x: number;
	y: number;
};

interface ITimeline {
	date: string;
	earnings: number;
}

Chart.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top" as const,
		},
		title: {
			display: true,
			text: "Chart.js Line Chart",
		},
	},
};

const labels = ["00", "06", "12", "18", "20"];

const data = {
	labels,
	datasets: [
		{
			label: "Dataset 1",
			data: [0, 90, 60, 75, 100],
			borderColor: "#4DCC36",
			tension: 0.8,
		},
	],
};

interface PromotionalCampaignsProps {
	onBan: () => void;
}

const PromotionalCampaigns = (props: PromotionalCampaignsProps) => {
	const { onBan: trigBan } = props;

	const items = [
		{
			url: "fyp.fans/janelove/campaign1",
			time: "2023-09-05T23:39:10.318Z",
			revenue: 1500,
			share: 20,
			profile: 590,
			cursor: 1750,
		},
		{
			url: "fyp.fans/janelove/campaign1",
			time: "2023-09-05T23:39:10.318Z",
			revenue: 1500,
			share: 20,
			profile: 590,
			cursor: 1750,
		},
		{
			url: "fyp.fans/janelove/campaign1",
			time: "2023-09-05T23:39:10.318Z",
			revenue: 1500,
			share: 20,
			profile: 590,
			cursor: 1750,
		},
		{
			url: "fyp.fans/janelove/campaign1",
			time: "2023-09-05T23:39:10.318Z",
			revenue: 1500,
			share: 20,
			profile: 590,
			cursor: 1750,
		},
	];

	return (
		<FansView>
			<FansText fontFamily="inter-semibold" fontSize={23}>
				Promotional campaigns
			</FansText>
			<FansGap height={33.5} />
			{items.map((item, index) => {
				const { url, time, revenue, share, profile, cursor } = item;

				const [isCollapsed, setCollapsed] = useState(index !== 2);
				const handlePressCollapse = () => setCollapsed(!isCollapsed);

				const [strDuration, setDuration] = useState("today");

				return (
					<Fragment key={index}>
						{index !== 0 && (
							<Fragment>
								<FansGap height={21.5} />
								<FansHorizontalDivider />
								<FansGap height={19.5} />
							</Fragment>
						)}
						<FansView>
							<FansView
								touchableOpacityProps={{
									onPress: handlePressCollapse,
								}}
								alignItems="center"
								flexDirection="row"
							>
								<FansView grow>
									<FansText
										fontFamily="inter-semibold"
										fontSize={16}
									>
										fyp.fans/janelove/campaign1
									</FansText>
								</FansView>
								<FansText
									color="grey-70"
									fontSize={14}
									textTransform="uppercase"
								>
									{DateTime.fromISO(time).toFormat("MMM d")}
								</FansText>
								<FansGap width={15.1} />
								<FansSvg
									width={11.87}
									height={5.93}
									svg={
										isCollapsed
											? ChevronDown3Svg
											: ChevronUp1Svg
									}
									color1="grey-70"
								/>
							</FansView>
							<FansGap height={10.5} />
							<FansView flexDirection="row" gap={7}>
								<FansView
									alignItems="center"
									backgroundColor={{
										color: "green-4d",
										opacity: 10,
									}}
									borderRadius="full"
									padding={{ x: 10 }}
								>
									<FansText
										color="green-4d"
										fontFamily="inter-semibold"
										fontSize={14}
									>
										REVENUE ${revenue.toLocaleString()}
									</FansText>
								</FansView>
								<FansView
									alignItems="center"
									backgroundColor={{
										color: "green-4d",
										opacity: 10,
									}}
									borderRadius="full"
									padding={{ x: 10 }}
								>
									<FansText
										color="green-4d"
										fontFamily="inter-semibold"
										fontSize={14}
										textTransform="uppercase"
									>
										{share}% Share
									</FansText>
								</FansView>
							</FansView>
							<FansView alignItems="end" flexDirection="row">
								<FansView flexDirection="row" gap={6}>
									<FansSvg
										width={15.43}
										height={15.71}
										svg={User1Svg}
										color1="green-4d"
									/>
									<FansText
										fontFamily="inter-semibold"
										fontSize={17}
									>
										{profile}
									</FansText>
								</FansView>
								<FansGap width={18.5} />
								<FansView flexDirection="row" gap={5.5}>
									<FansSvg
										width={12.04}
										height={15.71}
										svg={Cursor1Svg}
										color1="green-4d"
									/>
									<FansText
										fontFamily="inter-semibold"
										fontSize={17}
									>
										{cursor.toLocaleString()}
									</FansText>
								</FansView>
								<FansGap grow />
								<FansView
									touchableOpacityProps={{
										onPress: trigBan,
									}}
									backgroundColor="grey-f0"
									borderRadius="full"
									padding={10}
								>
									<BlockSvg size={16} color={Colors.Red} />
								</FansView>
							</FansView>
							{!isCollapsed && (
								<FansView>
									<Line options={options} data={data} />
									<FansView
										height={34}
										alignItems="center"
										borderColor="green-4d"
										borderRadius="full"
										flexDirection="row"
										justifyContent="around"
									>
										{[
											"Today",
											"1W",
											"1M",
											"3M",
											"6M",
											"1Y",
											"All",
										].map((item, index) => {
											const isActive =
												item === strDuration;

											const handlePressDuration = () =>
												setDuration(item);

											return (
												<FansView
													key={index}
													touchableOpacityProps={{
														onPress:
															handlePressDuration,
													}}
													backgroundColor={
														isActive
															? "green-4d"
															: "white"
													}
													borderRadius="full"
													padding={{
														x: isActive ? 10 : 0,
													}}
												>
													<FansText
														color={
															isActive
																? "white"
																: "green-4d"
														}
														fontFamily="inter-semibold"
														fontSize={14}
														textTransform="uppercase"
													>
														{item}
													</FansText>
												</FansView>
											);
										})}
									</FansView>
								</FansView>
							)}
						</FansView>
					</Fragment>
				);
			})}
		</FansView>
	);
};

const Subscribers = () => {
	const router = useRouter();
	const { dispatch } = useAppContext();

	const [numSelected, setSelected] = useState(0);
	const [initialSubscribers, setInitialSubscribers] = useState<ISubscriber[]>(
		[],
	);
	const [subscribers, setSubscribers] = useState<ISubscriber[]>([]);
	const [search, setSearch] = useState("");
	const [openMessageDialog, setOpenMessageDialog] = useState(false);
	const [subscriber, setSubscriber] = useState<ISubscriber | null>(null);

	const handleOpenMessageModal = (_user: ISubscriber) => {
		setSubscriber(_user);
		setOpenMessageDialog(true);
	};

	useEffect(() => {
		const fetchSubscribers = async () => {
			const resp = await getSubscribers();
			if (resp.ok) {
				const subscribers = resp.data.subscribers.sort(
					(a, b) => b.earnings - a.earnings,
				);
				setInitialSubscribers(subscribers);
				setSubscribers(subscribers);
			}
		};
		fetchSubscribers();
	}, []);

	useEffect(() => {
		const sortedSubscribers = [...subscribers].sort((a, b) => {
			if (numSelected === 0) {
				return b.earnings - a.earnings;
			} else if (numSelected === 1) {
				return b.level - a.level;
			} else if (numSelected === 2) {
				return b.period - a.period;
			}
			return 0;
		});

		setSubscribers(sortedSubscribers);
	}, [numSelected]);

	useEffect(() => {
		setSubscribers(
			initialSubscribers.filter((subscriber) =>
				subscriber.username
					.toLowerCase()
					.includes(search.toLowerCase()),
			),
		);
	}, [search]);

	const handleOpenMessage = async (fanId: string) => {
		try {
			dispatch.setShowLoading();
			const resp = await getOrCreateConversation(
				{},
				{
					userId: fanId,
				},
			);

			if (resp.ok) {
				updateInbox(resp.data);
				router.push(`/chat/${resp.data.id}`);
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		} finally {
			dispatch.setHideLoading();
		}
	};

	return (
		<FansView>
			<FansText fontFamily="inter-semibold" fontSize={23}>
				Subscribers
			</FansText>
			<FansGap height={13.3} />
			<FansTextInput5
				iconNode={
					<FansSvg width={13.14} height={13.26} svg={Search1Svg} />
				}
				textInputStyle={{ placeholder: "Search" }}
				onChangeText={setSearch}
				value={search}
			/>
			<FansGap height={15.1} />
			<FansChips4
				data={[
					{
						icon1: {
							width: 6.79,
							height: 13.96,
							svg: Dollar1Svg,
						},
						gap: 9,
						text: "Most money",
					},
					{
						icon1: {
							width: 12.79,
							height: 13.04,
							svg: Diamond1Svg,
						},
						gap: 9.1,
						text: "Highest level",
					},
					{
						icon1: {
							width: 11.54,
							height: 12.93,
							svg: Calendar1Svg,
						},
						gap: 10.2,
						text: "Most time",
					},
				]}
				value={numSelected}
				viewStyle1={{ margin: { x: -17 }, padding: { x: 17 } }}
				chipsStyle={{ backgroundColor: "green-4d" }}
				onChangeValue={setSelected}
			/>
			<FansGap height={15.4} />
			{subscribers.map((item, index) => {
				const {
					avatar,
					username,
					level,
					periodLabel,
					earnings,
					rebillOn,
				} = item;

				return (
					<Fragment key={index}>
						{index !== 0 && <FansHorizontalDivider />}
						<FansView
							height={75}
							alignItems="center"
							flexDirection="row"
						>
							<UserAvatar size="34px" image={avatar} />
							<FansGap width={13} />
							<FansView gap={2} grow>
								<FansText
									fontFamily="inter-semibold"
									fontSize={16}
								>
									{username}
								</FansText>
								<FansView
									alignItems="center"
									flexDirection="row"
									gap={6.6}
								>
									<FansSvg
										width={15.37}
										height={15.43}
										svg={LevelDevotedImage}
									/>
									<FansText color="grey-70" fontSize={16}>
										Level {level} • {periodLabel}
									</FansText>
								</FansView>
								{rebillOn && (
									<FansText color="grey-70" fontSize={16}>
										Rebill On
									</FansText>
								)}
							</FansView>
							<FansView
								backgroundColor={{
									color: "green-4d",
									opacity: 10,
								}}
								borderRadius="full"
								padding={{ x: 8, y: 4 }}
							>
								<FansText
									color="green-4d"
									fontFamily="inter-semibold"
									fontSize={14}
								>
									${earnings}
								</FansText>
							</FansView>
							<FansGap width={7} />
							<FansView
								width={34}
								height={34}
								alignItems="center"
								backgroundColor="grey-f0"
								borderRadius="full"
								justifyContent="center"
								pressableProps={{
									onPress: () =>
										handleOpenMessage(item.userId),
								}}
							>
								<FansSvg
									width={18.45}
									height={14.77}
									svg={Mail2Svg}
								/>
							</FansView>
						</FansView>
					</Fragment>
				);
			})}
			<SendMessageDialog
				open={openMessageDialog}
				onClose={() => setOpenMessageDialog(false)}
				reciever={{
					...defaultProfileData,
					userId: subscriber?.userId ?? "",
					displayName: subscriber?.username ?? "",
					avatar: subscriber?.avatar,
				}}
			/>
		</FansView>
	);
};

const Transactions = () => {
	const [isTransactionSheetVisible, setTransactionSheetVisible] =
		useState(false);
	const [dataTransaction, setTransaction] = useState<ITransactionCreator>();
	const handleCloseTransactionSheet = () => setTransactionSheetVisible(false);

	const [initialTransactions, setInitialTransactions] = useState<
		ITransactionCreator[]
	>([]);
	const [transactions, setTransactions] = useState<ITransactionCreator[]>([]);
	const [search, setSearch] = useState("");

	const onRefund = async (id: string) => {
		const resp = await refund({
			id: id,
		});

		if (resp.ok) {
			Toast.show({
				type: "success",
				text1: "Refund successful",
				text2: "The transaction has been refunded",
			});
		} else {
			Toast.show({
				type: "error",
				text1: "Refund failed",
				text2: resp.data.message,
			});
		}
	};

	useEffect(() => {
		const fetchTransactions = async () => {
			const resp = await getTransactions();
			if (resp.ok) {
				const transactions = resp.data.transactions;
				setInitialTransactions(transactions);
				setTransactions(transactions);
			}
		};
		fetchTransactions();
	}, []);

	useEffect(() => {
		setTransactions(
			initialTransactions.filter(
				(transaction) =>
					transaction.user.username
						.toLowerCase()
						.includes(search.toLowerCase()) ||
					transaction.description
						.toLowerCase()
						.includes(search.toLowerCase()),
			),
		);
	}, [search]);

	return (
		<FansView>
			<FansText fontFamily="inter-semibold" fontSize={23}>
				Transactions
			</FansText>
			<FansGap height={21} />
			<FansTextInput5
				textInputStyle={{ placeholder: "Search" }}
				iconNode={
					<FansSvg width={13.14} height={13.26} svg={Search1Svg} />
				}
				onChangeText={setSearch}
				value={search}
			/>
			<FansGap height={19.5} />
			<FansView>
				{transactions.map((item, index) => {
					const { user, description, status, createdAt, amount } =
						item;
					const { username, avatar } = user;

					const isSubscriptionUpdate = status === "Successful";
					const isPaymentFailed = status === "Cancelled";

					const handlePressTransaction = () => {
						setTransaction(item);
						setTransactionSheetVisible(true);
					};

					return (
						<Fragment key={index}>
							<FansView
								height={75}
								touchableOpacityProps={{
									onPress: handlePressTransaction,
								}}
								alignItems="center"
								flexDirection="row"
							>
								<UserAvatar size="34px" image={avatar} />
								<FansGap width={13} />
								<FansView gap={3} grow>
									<FansText
										fontFamily="inter-semibold"
										fontSize={16}
									>
										{username}
									</FansText>
									<FansText color="grey-70" fontSize={15}>
										{description}
									</FansText>
								</FansView>
								<FansView alignItems="end" gap={3}>
									<FansView
										alignItems="center"
										backgroundColor={
											isSubscriptionUpdate
												? {
														color: "green-4d",
														opacity: 10,
												  }
												: "red-fd"
										}
										borderRadius="full"
										flexDirection="row"
										padding={{ l: 3, r: 7 }}
									>
										<FansView
											height={20}
											alignItems="center"
											aspectRatio="square"
											justifyContent="center"
										>
											{isSubscriptionUpdate ? (
												<FansSvg
													width={10.04}
													height={7.01}
													svg={Check1Svg}
													color1="green-4d"
												/>
											) : isPaymentFailed ? (
												<FansSvg
													width={7.73}
													height={7.73}
													svg={Close0Svg}
													color1="red-eb"
												/>
											) : (
												<FansSvg
													width={11.07}
													height={11.06}
													svg={Block1Svg}
													color1="red-eb"
												/>
											)}
										</FansView>
										<FansText
											color={
												isSubscriptionUpdate
													? "green-4d"
													: "red-eb"
											}
											fontFamily="inter-semibold"
											fontSize={14}
										>
											${amount}
										</FansText>
									</FansView>
									<FansText
										color="grey-70"
										fontSize={14}
										textTransform="uppercase"
									>
										{DateTime.fromISO(createdAt).toFormat(
											"MMM d, h:mm a",
										)}
									</FansText>
								</FansView>
								<FansGap width={19.4} />
								<FansSvg
									width={3.55}
									height={17.38}
									svg={DotsVerticalSvg}
								/>
							</FansView>
							<FansHorizontalDivider />
						</Fragment>
					);
				})}
			</FansView>
			<TransactionSheet
				visible={isTransactionSheetVisible}
				data={dataTransaction}
				onClose={handleCloseTransactionSheet}
				onSubmit={onRefund}
			/>
		</FansView>
	);
};

const Posts = () => {
	const [page, setPage] = useState(1);
	const [size, setSize] = useState(10);
	const [total, setTotal] = useState(0);
	const [posts, setPosts] = useState<IPost[]>([]);
	const fetchPosts = useCallback(async () => {
		const resp = await getPostAnalytics({
			page,
			size,
		});
		if (resp.ok) {
			setPosts(resp.data.posts);
			setPage(resp.data.page);
			setSize(resp.data.size);
			setTotal(resp.data.total);
		}
		setPosts([
			{
				id: "1",
				profileId: "0",
				profile: defaultProfileData,
				title: "Loving my new outfit! You can see later.",
				type: PostType.Photo,
				caption: "",
				thumb: {
					id: "0",
					type: "",
					url: "",
				},
				medias: [],
				isArchived: false,
				isHidden: false,
				commentCount: 1750,
				likeCount: 590,
				createdAt: "2023-09-05T23:39:10.318Z",
				updatedAt: "",
				bookmarkCount: 17,
				taggedPeoples: [],
				isPaidPost: false,
				isPaidOut: false,
				isPinned: false,
				isSelf: true,
				isExclusive: false,
				isPosted: true,
			},
			{
				id: "2",
				profileId: "0",
				profile: defaultProfileData,
				title: "Loving my new outfit! You can see later.",
				type: PostType.Photo,
				caption: "",
				thumb: {
					id: "0",
					type: "",
					url: "",
				},
				medias: [],
				isArchived: false,
				isHidden: false,
				commentCount: 1750,
				likeCount: 590,
				createdAt: "2023-09-05T23:39:10.318Z",
				updatedAt: "",
				bookmarkCount: 17,
				taggedPeoples: [],
				isPaidPost: false,
				isPaidOut: false,
				isPinned: false,
				isSelf: true,
				isExclusive: false,
				isPosted: true,
			},
			{
				id: "3",
				profileId: "0",
				profile: defaultProfileData,
				title: "Loving my new outfit! You can see later.",
				type: PostType.Photo,
				caption: "",
				thumb: {
					id: "0",
					type: "",
					url: "",
				},
				medias: [],
				isArchived: false,
				isHidden: false,
				commentCount: 1750,
				likeCount: 590,
				createdAt: "2023-09-05T23:39:10.318Z",
				updatedAt: "",
				bookmarkCount: 17,
				taggedPeoples: [],
				isPaidPost: false,
				isPaidOut: false,
				isPinned: false,
				isSelf: true,
				isExclusive: false,
				isPosted: true,
			},
			{
				id: "4",
				profileId: "0",
				profile: defaultProfileData,
				title: "Loving my new outfit! You can see later.",
				type: PostType.Photo,
				caption: "",
				thumb: {
					id: "0",
					type: "",
					url: "",
				},
				medias: [],
				isArchived: false,
				isHidden: false,
				commentCount: 1750,
				likeCount: 590,
				createdAt: "2023-09-05T23:39:10.318Z",
				updatedAt: "",
				bookmarkCount: 17,
				taggedPeoples: [],
				isPaidPost: false,
				isPaidOut: false,
				isPinned: false,
				isSelf: true,
				isExclusive: false,
				isPosted: true,
			},
			{
				id: "5",
				profileId: "0",
				profile: defaultProfileData,
				title: "Loving my new outfit! You can see later.",
				type: PostType.Photo,
				caption: "",
				thumb: {
					id: "0",
					type: "",
					url: "",
				},
				medias: [],
				isArchived: false,
				isHidden: false,
				commentCount: 1750,
				likeCount: 590,
				createdAt: "2023-09-05T23:39:10.318Z",
				updatedAt: "",
				bookmarkCount: 17,
				taggedPeoples: [],
				isPaidPost: false,
				isPaidOut: false,
				isPinned: false,
				isSelf: true,
				isExclusive: false,
				isPosted: true,
			},
		]);
	}, [page, size]);

	useEffect(() => {
		fetchPosts();
	}, []);

	const [isPostSheetVisible, setPostSheetVisible] = useState(false);
	const [dataPost, setPost] = useState<IPost>();
	const handleClosePostSheet = () => setPostSheetVisible(false);

	const defaultAvatar = require("@assets/images/default-avatar.png");

	return (
		<FansView gap={23}>
			<FansText fontFamily="inter-semibold" fontSize={23}>
				Posts
			</FansText>
			<FansView gap={9}>
				{posts.map((value, index) => {
					const {
						id,
						title,
						commentCount,
						likeCount,
						createdAt,
						bookmarkCount,
					} = value;

					const handlePress = () => {
						setPost(value), setPostSheetVisible(true);
					};

					return (
						<FansView
							key={id}
							height={138}
							touchableOpacityProps={{ onPress: handlePress }}
							borderColor="grey-f0"
							borderRadius={15}
							justifyContent="center"
							padding={{ x: 17 }}
						>
							<FansView
								alignItems="center"
								flexDirection="row"
								gap={15.3}
							>
								<FansImage2
									width={54.5}
									height={54.5}
									source={defaultAvatar}
									viewStyle={{ borderRadius: 7 }}
									imageStyle={{ resizeMode: "cover" }}
								/>
								<FansView width={0} gap={4} grow>
									<FansText
										fontFamily="inter-medium"
										fontSize={16}
										numberOfLines={1}
									>
										{title}
									</FansText>
									<FansText
										color="grey-70"
										fontSize={14}
										textTransform="uppercase"
									>
										{DateTime.fromISO(createdAt).toFormat(
											"MMM d, h:mm a",
										)}
									</FansText>
								</FansView>
							</FansView>
							<FansGap height={14} />
							<FansHorizontalDivider />
							<FansGap height={15.5} />
							<FansView alignItems="center" flexDirection="row">
								<FansView
									alignItems="center"
									flexDirection="row"
									gap={3.2}
								>
									<FansSvg
										width={18.52}
										height={12.97}
										svg={Eye2Svg}
										color1="green-4d"
									/>
									<FansText
										fontFamily="inter-semibold"
										fontSize={17}
									>
										{commentCount.toLocaleString()}
									</FansText>
								</FansView>
								<FansGap width={16.6} />
								<FansView
									alignItems="center"
									flexDirection="row"
									gap={6.8}
								>
									<FansSvg
										width={14.68}
										height={12.97}
										svg={Heart1Svg}
										color1="green-4d"
									/>
									<FansText
										fontFamily="inter-semibold"
										fontSize={17}
									>
										{likeCount.toLocaleString()}
									</FansText>
								</FansView>
								<FansGap width={17.8} />
								<FansView
									alignItems="center"
									flexDirection="row"
									gap={4.9}
								>
									<FansSvg
										width={15.3}
										height={15.3}
										svg={Chat1Svg}
										color1="green-4d"
									/>
									<FansText
										fontFamily="inter-semibold"
										fontSize={17}
									>
										{commentCount.toLocaleString()}
									</FansText>
								</FansView>
								<FansGap width={16.6} />
								<FansView
									alignItems="center"
									flexDirection="row"
									gap={4.3}
								>
									<FansSvg
										width={16.16}
										height={11.25}
										svg={Reply1Svg}
										color1="green-4d"
									/>
									<FansText
										fontFamily="inter-semibold"
										fontSize={17}
									>
										{bookmarkCount.toLocaleString()}
									</FansText>
								</FansView>
							</FansView>
						</FansView>
					);
				})}
			</FansView>
			<PostSheet
				visible={isPostSheetVisible}
				data={dataPost}
				onClose={handleClosePostSheet}
				onSubmit={() => {}}
			/>
		</FansView>
	);
};

interface ShopPostCardProps {
	post: AnalyticsIPost;
	handlePressGraph: () => void;
	handlePressFans: () => void;
}

const ShopPostCard: FC<ShopPostCardProps> = (props) => {
	const { post, handlePressGraph, handlePressFans } = props;

	return (
		<FansView
			gap={{ xs: 18, md: 18 }}
			style={tw.style(
				"border border-fans-grey dark:border-fans-grey-43 px-[17px] pt-[17px] pb-4 rounded-[15px]",
				"md:flex-row md:items-center md:border-0 md:rounded-0 md:p-0",
			)}
		>
			<FansView
				style={tw.style(
					"flex-row md:flex-1 md:flex-col border-0 md:border md:border-fans-grey dark:border-fans-grey-43 md:rounded-[15px]",
				)}
				gap={{ xs: 17, md: 15 }}
			>
				<FansView
					style={tw.style(
						"w-[110px] h-[110px] relative md:w-full md:h-[260px]",
					)}
				>
					<Image
						source={{ uri: cdnURL(post.thumb?.url) }}
						style={tw.style(
							"w-full h-full rounded-[7px] md:rounded-t-[15px] md:rounded-b-0",
						)}
					/>
					<FansView
						position="absolute"
						justifyContent="center"
						alignItems="center"
						flexDirection="row"
						gap={6}
						style={tw.style(
							"bg-fans-black/50 h-[26px] w-[58px] rounded-[26px] bottom-2 left-2",
							"md:bottom-[17px] md:bottom-[17px]",
						)}
					>
						<FypSvg
							svg={ImageSvg}
							width={11}
							height={11}
							color="fans-white"
						/>
						<FypText
							fontSize={14}
							fontWeight={600}
							lineHeight={19}
							style={tw.style("text-fans-white")}
						>
							{post.medias?.length}
						</FypText>
					</FansView>
				</FansView>
				<FansView flex="1" style={tw.style("md:px-[18px] md:pb-5")}>
					<FansView
						flexDirection="row"
						alignItems="center"
						justifyContent="between"
						style={tw.style("mb-5 md:mb-[6px]")}
					>
						<FypText fontSize={21} lineHeight={21} fontWeight={700}>
							${post.paidPost?.price}
						</FypText>
						<FansView flexDirection="row" gap={6}>
							<FansIconButton size={34}>
								<FypSvg
									svg={EditSvg}
									width={14}
									height={15}
									color="fans-black dark:fans-white"
								/>
							</FansIconButton>
							<FansIconButton size={34}>
								<FypSvg
									svg={ThreeDotsSvg}
									width={18}
									height={18}
									color="fans-black dark:fans-white"
								/>
							</FansIconButton>
						</FansView>
					</FansView>
					<FansView style={tw.style("max-w-50")}>
						<FypText
							fontSize={16}
							lineHeight={21}
							numberOfLines={2}
						>
							{post.caption}
						</FypText>
					</FansView>
				</FansView>
			</FansView>

			<FansView style={tw.style("md:hidden")}>
				<FansDivider />
				<FansView
					flexDirection="row"
					alignItems="center"
					margin={{ t: 14 }}
					justifyContent="between"
				>
					<FansView flexDirection="row" alignItems="center" gap={13}>
						<FypLinearGradientView
							colors={["#24a2ff", "#89f276"]}
							width={55}
							height={20}
							borderRadius={20}
							flexDirection="row"
							alignItems="center"
							justifyContent="center"
						>
							<FypText
								fontSize={14}
								fontWeight={600}
								lineHeight={19}
								textAlign="center"
								style={tw.style("text-fans-white")}
							>
								${post.paidPost?.price}
							</FypText>
						</FypLinearGradientView>
						<FansView
							flexDirection="row"
							alignItems="center"
							gap={5}
						>
							<FypSvg
								svg={ShopSvg}
								width={13}
								height={17}
								color="fans-green dark:fans-green-29"
							/>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
							>
								{post.purchases}
							</FypText>
						</FansView>
						<FansView
							flexDirection="row"
							alignItems="center"
							gap={5}
						>
							<FypSvg
								svg={CursorSvg}
								width={13}
								height={16}
								color="fans-green dark:fans-green-29"
							/>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
							>
								{post.purchases}
							</FypText>
						</FansView>
					</FansView>
					<FypLink
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						style={tw.style(
							"text-fans-green dark:text-fans-green-29",
						)}
						onPress={handlePressGraph}
					>
						View graph
					</FypLink>
				</FansView>
			</FansView>
			<FansView flex="1" style={tw.style("hidden md:flex pl-5")}>
				<FansView gap={15} margin={{ b: 20 }}>
					<FansView position="relative" flex="1">
						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={500}
							style={tw.style("mb-[2px]")}
						>
							Total revenue
						</FypText>
						<FypText
							fontSize={28}
							lineHeight={37}
							fontWeight={600}
							style={tw.style(
								"text-fans-green dark:text-fans-green-29",
							)}
						>
							${post.earnings}
						</FypText>
						<FypSvg
							svg={Dollar5Svg}
							width={21}
							height={23}
							color="fans-black dark:fans-white"
							style={tw.style("absolute top-[5px] right-0")}
						/>
						<FansDivider style={tw.style("mt-[14px]")} />
					</FansView>
					<FansView position="relative" flex="1">
						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={500}
							style={tw.style("mb-[2px]")}
						>
							Total purchases
						</FypText>
						<FypText
							fontSize={28}
							lineHeight={37}
							fontWeight={600}
							style={tw.style(
								"text-fans-green dark:text-fans-green-29",
							)}
						>
							{post.purchases}
						</FypText>
						<FypSvg
							svg={ShopSvg}
							width={21}
							height={26}
							color="fans-black dark:fans-white"
							style={tw.style("absolute top-2 right-0")}
						/>
						<FansDivider style={tw.style("mt-[14px]")} />
					</FansView>
					{/* <FansView position="relative" flex="1">
						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={500}
							style={tw.style("mb-[2px]")}
						>
							Click through rate
						</FypText>
						<FypText
							fontSize={28}
							lineHeight={37}
							fontWeight={600}
							style={tw.style(
								"text-fans-green dark:text-fans-green-29",
							)}
						>
							54
						</FypText>
						<FypSvg
							svg={CursorSvg}
							width={21}
							height={26}
							color="fans-black dark:fans-white"
							style={tw.style("absolute top-2 right-0")}
						/>
					</FansView> */}
				</FansView>
				<FansView gap={9}>
					<FansView
						height={34}
						gap={12}
						flexDirection="row"
						alignItems="center"
						borderRadius={34}
						justifyContent="center"
						style={tw.style(
							"w-full md:w-[310px] md:mx-auto border",
							"border-fans-green dark:border-fans-green-29",
						)}
						pressableProps={{
							onPress: handlePressGraph,
						}}
					>
						<FypSvg
							svg={StatisticsSvg}
							width={13}
							height={13}
							color="fans-green dark:fans-green-29"
						/>
						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={600}
							style={tw.style(
								"text-fans-green dark:text-fans-green-29",
							)}
						>
							View graph
						</FypText>
					</FansView>
					<FansView
						height={34}
						gap={12}
						flexDirection="row"
						alignItems="center"
						borderRadius={34}
						justifyContent="center"
						style={tw.style(
							"w-full md:w-[310px] md:mx-auto border",
							"border-fans-green dark:border-fans-green-29",
						)}
						pressableProps={{
							onPress: handlePressFans,
						}}
					>
						<FypSvg
							svg={ShopSvg}
							width={10}
							height={12}
							color="fans-green dark:fans-green-29"
						/>
						<FypText
							fontSize={17}
							lineHeight={22}
							fontWeight={600}
							style={tw.style(
								"text-fans-green dark:text-fans-green-29",
							)}
						>
							View purchased
						</FypText>
					</FansView>
				</FansView>
			</FansView>
		</FansView>
	);
};

const ShopContent = ({ isScrollEnd }: { isScrollEnd: boolean }) => {
	const { dispatch } = useAppContext();
	const router = useRouter();

	const [selectedPost, setSelectedPost] = useState<AnalyticsIPost>();
	const [openPostAnalytics, setOpenPostAnalytics] = useState(false);
	const [showFans, setShowFans] = useState(false);
	const [period, setPeriod] = useState("today");
	const [duration, setDuration] = useState("Today");
	const [earnings, setEarnings] = useState(0);
	const [purchases, setPurchases] = useState(0);
	const [prevPeriodLabel, setPrevPeriodLabel] = useState("");
	const [prevPeriodEarnings, setPrevPeriodEarnings] = useState(0);
	const [prevPeriodEarningsDifference, setPrevPeriodEarningsDifference] =
		useState(0);
	const [
		prevPeriodEarningsPercentageDifference,
		setPrevPeriodEarningsPercentageDifference,
	] = useState(0);
	const [timeline, setTimeline] = useState<ITimeline[]>([]);
	const [isShowProjectedEarnings, setShowProjectedEarnings] = useState(true);

	const [posts, setPosts] = useState<AnalyticsIPost[]>([]);

	useEffect(() => {
		const fetchEarningsAnalytics = async () => {
			let startDate: DateTime | undefined;
			let endDate: DateTime | undefined;

			switch (duration) {
				case "Today":
					startDate = DateTime.local();
					endDate = DateTime.local();
					break;
				case "1W":
					startDate = DateTime.local().minus({ weeks: 1 });
					endDate = DateTime.local();
					break;
				case "1M":
					startDate = DateTime.local().minus({ months: 1 });
					endDate = DateTime.local();
					break;
				case "3M":
					startDate = DateTime.local().minus({ months: 3 });
					endDate = DateTime.local();
					break;
				case "6M":
					startDate = DateTime.local().minus({ months: 6 });
					endDate = DateTime.local();
					break;
				case "1Y":
					startDate = DateTime.local().minus({ years: 1 });
					endDate = DateTime.local();
					break;
				case "All":
					break;
			}

			const resp = await getPaidPostsEarnings({
				startDate: startDate?.toISO() ?? undefined,
				endDate: endDate?.toISO() ?? undefined,
			});
			if (resp.ok) {
				setPeriod(resp.data.period);
				setEarnings(resp.data.earnings);
				setPurchases(resp.data.purchases);
				setPrevPeriodLabel(resp.data.prevPeriodLabel);
				setPrevPeriodEarnings(resp.data.prevPeriodEarnings);
				setPrevPeriodEarningsDifference(
					resp.data.prevPeriodEarningsDifference,
				);
				setPrevPeriodEarningsPercentageDifference(
					resp.data.prevPeriodEarningsPercentageDifference,
				);
				setTimeline(resp.data.timeline);
			}
		};

		const fetchTopSellingPosts = async () => {
			const resp = await getTopPosts();
			if (resp.ok) {
				setPosts(resp.data);
			}
		};

		fetchTopSellingPosts();
		fetchEarningsAnalytics();
	}, [duration]);

	const handleOpenMessage = async (fanId: string) => {
		try {
			dispatch.setShowLoading();
			const resp = await getOrCreateConversation(
				{},
				{
					userId: fanId,
				},
			);

			if (resp.ok) {
				updateInbox(resp.data);
				router.push(`/chat/${resp.data.id}`);
			} else {
				Toast.show({
					type: "error",
					text1: resp.data.message,
				});
			}
		} finally {
			dispatch.setHideLoading();
		}
	};

	return (
		<FansView>
			<FansView>
				<FypText fontSize={23} lineHeight={31} fontWeight={600}>
					Total revenue
				</FypText>
				<FypText
					fontSize={34}
					lineHeight={46}
					fontWeight={600}
					style={tw.style("text-fans-green dark:text-fans-green-29")}
				>
					{`$${earnings}`}
				</FypText>
			</FansView>
			<FansGap height={9} />
			<FansView alignItems="center" flexDirection="row">
				{prevPeriodEarningsDifference !== 0 && (
					<FansSvg
						width={11.02}
						height={12.68}
						svg={
							prevPeriodEarningsDifference > 0
								? ArrowUpSvg
								: ArrowDownSvg
						}
						color1={
							prevPeriodEarningsDifference > 0
								? "green-4d"
								: "red-eb"
						}
					/>
				)}

				{prevPeriodEarningsDifference !== 0 && <FansGap width={8} />}
				<FansText
					color={
						prevPeriodEarningsDifference === 0
							? `${
									tw.prefixMatch("dark")
										? "grey-b1"
										: "grey-70"
							  }`
							: prevPeriodEarningsDifference > 0
							? "green-4d"
							: "red-eb"
					}
					fontSize={16}
				>
					${prevPeriodEarningsDifference.toLocaleString()} (
					{prevPeriodEarningsDifference > 0 ? "+" : ""}
					{prevPeriodEarningsPercentageDifference.toLocaleString()}% )
				</FansText>
				<FansGap width={7} />
				<FansText
					fontSize={14}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					• {prevPeriodLabel}
				</FansText>
			</FansView>
			<FansGap height={26} />
			<FansView margin={{ b: 14 }}>
				<FypText fontSize={23} lineHeight={31} fontWeight={600}>
					Total purchases
				</FypText>
				<FypText
					fontSize={34}
					lineHeight={46}
					fontWeight={600}
					style={tw.style("text-fans-green dark:text-fans-green-29")}
				>
					{purchases}
				</FypText>
			</FansView>
			<FansView>
				<LineChart
					timeline={timeline}
					duration={duration}
					setDuration={setDuration}
					period={period}
				/>
			</FansView>
			<FansDivider
				style={tw.style("mt-[34px] mb-7 md:mt-[38px] md:mb-9")}
			/>
			<FypText
				fontSize={17}
				lineHeight={24}
				fontWeight={600}
				style={tw.style("mb-4 md:mb-[30px]")}
			>
				Top selling posts
			</FypText>
			<FansView gap={16}>
				{posts.map((post) => (
					<ShopPostCard
						key={post.id}
						post={post}
						handlePressGraph={() => {
							setShowFans(false);
							setOpenPostAnalytics(true);
							setSelectedPost(post);
						}}
						handlePressFans={() => {
							setShowFans(true);
							setOpenPostAnalytics(true);
							setSelectedPost(post);
						}}
					/>
				))}
			</FansView>
			<PostAnalyticsModal
				visible={openPostAnalytics}
				showFans={showFans}
				onDismiss={() => setOpenPostAnalytics(false)}
				post={selectedPost}
				handleOpenMessage={handleOpenMessage}
			/>
		</FansView>
	);
};

const AnalyticsConstantView = () => {
	const { state } = useAppContext();
	const { userInfo } = state.user;
	const featureGates = useFeatureGates();

	const items = featureGates.has("2023_12-shop-tab-on-creators-profile")
		? [
				{ text: "Earnings" },
				// { text: "Promotional campaigns" },
				{ text: "Subscribers" },
				{ text: "Transactions" },
				// { text: "Posts" }, // TODO: uncomment when API is ready
				{ text: "Shop" },
		  ]
		: [
				{ text: "Earnings" },
				// { text: "Promotional campaigns" },
				{ text: "Subscribers" },
				{ text: "Transactions" },
				// { text: "Posts" }, // TODO: uncomment when API is ready
		  ];

	const router = useRouter();

	const [isBanModalVisible, setBanModalVisible] = useState(false);
	const [selected, setSelected] = useState(0);
	const [isScrollEnd, setIsScrollEnd] = useState(false);

	const handleBan = () => setBanModalVisible(true);

	const handleCloseBanModal = () => setBanModalVisible(false);

	const handlePressBalance = () =>
		router.push({
			pathname: "profile",
			params: {
				screen: "GetPaid",
			},
		});

	const handleSelect = (index: number) => {
		setSelected(index);
	};

	const Earnings = () => {
		const [period, setPeriod] = useState("today");
		const [duration, setDuration] = useState("Today");
		const [earnings, setEarnings] = useState(0);
		const [prevPeriodLabel, setPrevPeriodLabel] = useState("");
		const [prevPeriodEarnings, setPrevPeriodEarnings] = useState(0);
		const [prevPeriodEarningsDifference, setPrevPeriodEarningsDifference] =
			useState(0);
		const [
			prevPeriodEarningsPercentageDifference,
			setPrevPeriodEarningsPercentageDifference,
		] = useState(0);
		const [timeline, setTimeline] = useState<ITimeline[]>([]);
		const [isShowProjectedEarnings, setShowProjectedEarnings] =
			useState(true);

		useEffect(() => {
			const fetchEarningsAnalytics = async () => {
				let startDate: DateTime | undefined;
				let endDate: DateTime | undefined;

				switch (duration) {
					case "Today":
						startDate = DateTime.local();
						endDate = DateTime.local();
						break;
					case "1W":
						startDate = DateTime.local().minus({ weeks: 1 });
						endDate = DateTime.local();
						break;
					case "1M":
						startDate = DateTime.local().minus({ months: 1 });
						endDate = DateTime.local();
						break;
					case "3M":
						startDate = DateTime.local().minus({ months: 3 });
						endDate = DateTime.local();
						break;
					case "6M":
						startDate = DateTime.local().minus({ months: 6 });
						endDate = DateTime.local();
						break;
					case "1Y":
						startDate = DateTime.local().minus({ years: 1 });
						endDate = DateTime.local();
						break;
					case "All":
						break;
				}

				const resp = await getEarnings({
					startDate: startDate?.toISO() ?? undefined,
					endDate: endDate?.toISO() ?? undefined,
				});
				if (resp.ok) {
					setPeriod(resp.data.period);
					setEarnings(resp.data.earnings);
					setPrevPeriodLabel(resp.data.prevPeriodLabel);
					setPrevPeriodEarnings(resp.data.prevPeriodEarnings);
					setPrevPeriodEarningsDifference(
						resp.data.prevPeriodEarningsDifference,
					);
					setPrevPeriodEarningsPercentageDifference(
						resp.data.prevPeriodEarningsPercentageDifference,
					);
					setTimeline(resp.data.timeline);
				}
			};

			fetchEarningsAnalytics();
		}, [duration]);

		return (
			<FansView>
				<FansView flexDirection="row" justifyContent="between">
					<FansView gap={9}>
						<FansText fontFamily="inter-semibold" fontSize={23}>
							Earnings
						</FansText>
						<FansText fontFamily="inter-semibold" fontSize={23}>
							${earnings}
						</FansText>
					</FansView>
					{/* <FansButton3
						height={34}
						title="Make more"
						buttonStyle={{
							backgroundColor: "white",
							borderColor: "green-4d",
							gap: 4.6,
						}}
						textStyle1={{ color: "green-4d", fontSize: 17 }}
						icon={
							<FansSvg
								width={15.95}
								height={15.94}
								svg={EarningSvg}
								color1="green-4d"
							/>
						}
					/> */}
				</FansView>
				<FansGap height={11} />
				<FansView alignItems="center" flexDirection="row">
					{prevPeriodEarningsDifference !== 0 && (
						<FansSvg
							width={11.02}
							height={12.68}
							svg={
								prevPeriodEarningsDifference > 0
									? ArrowUpSvg
									: ArrowDownSvg
							}
							color1={
								prevPeriodEarningsDifference > 0
									? "green-4d"
									: "red-eb"
							}
						/>
					)}

					{prevPeriodEarningsDifference !== 0 && (
						<FansGap width={8} />
					)}
					<FansText
						color={
							prevPeriodEarningsDifference === 0
								? `${
										tw.prefixMatch("dark")
											? "grey-b1"
											: "grey-70"
								  }`
								: prevPeriodEarningsDifference > 0
								? "green-4d"
								: "red-eb"
						}
						fontSize={16}
					>
						${prevPeriodEarningsDifference.toLocaleString()} (
						{prevPeriodEarningsDifference > 0 ? "+" : ""}
						{prevPeriodEarningsPercentageDifference.toLocaleString()}
						% )
					</FansText>
					<FansGap width={7} />
					<FansText
						fontSize={14}
						style={tw.style(
							"text-fans-grey-70 dark:text-fans-grey-b1",
						)}
					>
						• {prevPeriodLabel}
					</FansText>
				</FansView>
				<FansGap height={21.8} />
				<LineChart
					timeline={timeline}
					duration={duration}
					setDuration={setDuration}
					period={period}
				/>
				<FansGap height={31} />
				<FansView
					alignItems="center"
					flexDirection="row"
					touchableOpacityProps={{ onPress: handlePressBalance }}
				>
					<FansText fontSize={18}>Balance</FansText>
					<FansGap viewStyle={{ grow: true }} />
					<FansText fontSize={18}>${userInfo.payoutBalance}</FansText>
					<FansGap width={35.8} />
					<FansSvg
						width={6.14}
						height={12.28}
						svg={ChevronRight2Svg}
						color1="grey-70"
					/>
				</FansView>
				<FansGap height={21} />
				<FansHorizontalDivider />
				<FansGap height={20} />
				<FansSwitch1
					value={isShowProjectedEarnings}
					switchStyle={{ backgroundColor: "green-4d" }}
					label="Show projected earnings"
					onValueChange={setShowProjectedEarnings}
				/>
				<FansGap height={30} />
				{/* <FansView
					height={180}
					alignItems="center"
					borderColor="grey-f0"
					borderRadius={15}
					flexDirection="row"
					gap={14.8}
					padding={{ l: 13.5, r: 10 }}
				>
					<FansSvg
						width={80.69}
						height={74.64}
						svg={Income1Svg}
						color1="green-4d"
					/>
					<FansView width={0} grow>
						<FansText fontFamily="inter-semibold" fontSize={19}>
							Boost your income
						</FansText>
						<FansGap height={10} />
						<FansText fontSize={16}>
							Let our network of marketers help sky rocket your
							earnings!
						</FansText>
						<FansGap height={17} />
						<FansButton3
							width={188}
							height={42}
							buttonStyle={{
								backgroundColor: "green-4d",
								borderColor: "green-4d",
							}}
							title="Get started"
						/>
					</FansView>
				</FansView> */}
			</FansView>
		);
	};

	const [completeScrollBarWidth, setCompleteScrollBarWidth] = useState(1);
	const [visibleScrollBarWidth, setVisibleScrollBarWidth] = useState(0);

	const scrollIndicator = useRef(new Animated.Value(0)).current;

	const scrollIndicatorSize =
		completeScrollBarWidth > visibleScrollBarWidth
			? (visibleScrollBarWidth * visibleScrollBarWidth) /
			  completeScrollBarWidth
			: visibleScrollBarWidth;

	const difference =
		visibleScrollBarWidth > scrollIndicatorSize
			? visibleScrollBarWidth - scrollIndicatorSize
			: 1;

	const scrollIndicatorPosition = Animated.multiply(
		scrollIndicator,
		visibleScrollBarWidth / completeScrollBarWidth,
	).interpolate({
		inputRange: [0, difference],
		outputRange: [0, difference],
		extrapolate: "clamp",
	});

	const x = useSharedValue(0);
	const panGestureEvent = useAnimatedGestureHandler<
		PanGestureHandlerGestureEvent,
		ContextType
	>({
		onStart: (_, context) => {
			// context.x = x.value;
		},
		onActive: (event, context) => {
			context.x = event.translationX + x.value;
			scrollRef.current?.scrollTo({
				x: Math.min(
					Math.max(0, context.x),
					completeScrollBarWidth - visibleScrollBarWidth,
				),
				animated: false,
			});
		},
		onEnd: () => {
			// x.value = withSpring(0);
		},
	});
	const scrollRef =
		useRef<ScrollView | null>() as MutableRefObject<ScrollView | null>;

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 20;
		const _isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		setIsScrollEnd(_isScrollEnd);
	};

	return (
		<FansScreen3
			contentStyle1={{ maxWidth: { lg: 670 } }}
			onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
		>
			<FansChips3
				data={items}
				value={selected}
				viewStyle={{
					style: tw.style(
						"mx-[-17px] px-[17px] py-2 grow-0 shrink-0",
					),
				}}
				chipsStyle={{ backgroundColor: "green-4d" }}
				onChangeValue={handleSelect}
				onContentSizeChange={(width, _) => {
					setCompleteScrollBarWidth(width);
				}}
				onLayout={({
					nativeEvent: {
						layout: { width },
					},
				}) => {
					setVisibleScrollBarWidth(width);
				}}
				onScroll={Animated.event(
					[
						{
							nativeEvent: {
								contentOffset: { x: scrollIndicator },
							},
						},
					],
					{
						useNativeDriver: true,
						listener: (event) => {
							x.value = (
								event.nativeEvent as NativeScrollEvent
							).contentOffset.x;
						},
					},
				)}
				scrollEventThrottle={16}
				scrollRef={scrollRef}
			/>
			<PanGestureHandler onGestureEvent={panGestureEvent}>
				<Animated.View
					style={{
						height: 8,
						borderRadius: 8,
						backgroundColor: "#4DCC36",
						width: scrollIndicatorSize,
						transform: [{ translateX: scrollIndicatorPosition }],
					}}
				/>
			</PanGestureHandler>

			<FansGap height={30} />
			{(() => {
				switch (selected) {
					case 0: {
						return <Earnings />;
					}
				}
				return <></>;
			})()}
			{/* {selected === 1 && <PromotionalCampaigns onBan={handleBan} />} */}
			{selected === 1 && <Subscribers />}
			{selected === 2 && <Transactions />}
			{/* {selected === 3 && <Posts />} */}
			{selected === 3 && <ShopContent isScrollEnd={isScrollEnd} />}
			<BanModal
				visible={isBanModalVisible}
				onClose={handleCloseBanModal}
				onSubmit={() => {}}
			/>
			<FansGap height={20} />
		</FansScreen3>
	);
};

const AnalyticsScreen = () => {
	return SettingsNavigationLayout(<SettingsAnalyticsNativeStack />);
};

export default AnalyticsScreen;
