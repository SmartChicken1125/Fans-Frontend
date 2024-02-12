import {
	Block3Svg,
	PlusSvg,
	Search1Svg,
	Trash2Svg,
	Warning1Svg,
} from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import {
	FansDivider,
	FansGap,
	FansHorizontalDivider,
	FansImage2,
	FansScreen3,
	FansSvg,
	FansSwitch1,
	FansText,
	FansTextInput5,
	FansVerticalDivider,
	FansView,
} from "@components/controls";
import { ProfileActionType, useAppContext } from "@context/useAppContext";
import {
	blockUser,
	getBlockedUsers,
	getProfile,
	searchUsersToBlock,
	updateMyProfile,
} from "@helper/endpoints/profile/apis";
import { ProfileReqBody } from "@helper/endpoints/profile/schemas";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
import { PrivacyNativeStackScreenProps } from "@usertypes/navigations";
import { IUser } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, {
	FC,
	Fragment,
	MutableRefObject,
	useEffect,
	useRef,
	useState,
} from "react";
import { Animated, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Switch } from "react-native-paper";

type ItemProps = {
	text: string;
	value: boolean;
	onValueChange: (value: boolean) => void;
};

const Item: React.FC<ItemProps> = (props) => (
	<View style={tw.style("flex-row justify-between items-center", "my-[5px]")}>
		<Text style={tw.style("text-[18px]")}>{props.text}</Text>
		<Switch
			value={props.value}
			color="#A854F5"
			onValueChange={props.onValueChange}
		/>
	</View>
);

interface UserItem {
	data: IUser;
	onDelete?: () => void;
	onAdd?: () => void;
}

const UserItem: FC<UserItem> = (props) => {
	const { data, onDelete: handleDelete, onAdd: handleAdd } = props;
	const { username } = data;

	const swipeableRef =
		useRef<Swipeable | null>() as MutableRefObject<Swipeable | null>;

	const onPressBlock = () => {
		swipeableRef.current?.close();
	};
	const onPressReport = () => {
		swipeableRef.current?.close();
	};
	const onPressDelete = () => {
		swipeableRef.current?.close();
		if (handleDelete) handleDelete();
	};

	const renderRightActions = () => {
		return (
			<FansView alignItems="center" flexDirection="row">
				<FansGap width={16} />
				<FansVerticalDivider height={34} />
				<FansGap width={16} />
				<FansView
					width={34}
					height={34}
					alignItems="center"
					borderRadius="full"
					justifyContent="center"
					touchableOpacityProps={{ onPress: onPressBlock }}
					style={tw.style("bg-fans-grey-f0 dark:bg-fans-grey-43")}
				>
					<FypSvg
						width={16}
						height={16}
						svg={Block3Svg}
						color="fans-black dark:fans-white"
					/>
				</FansView>
				<FansGap width={7} />
				<FansView
					width={34}
					height={34}
					alignItems="center"
					borderRadius="full"
					justifyContent="center"
					touchableOpacityProps={{ onPress: onPressReport }}
					style={tw.style("bg-fans-grey-f0 dark:bg-fans-grey-43")}
				>
					<FansSvg
						width={16.53}
						height={14.93}
						svg={Warning1Svg}
						color1="red"
					/>
				</FansView>
			</FansView>
		);
	};

	return handleDelete ? (
		<Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
			<FansView
				height={68}
				alignItems="center"
				flexDirection="row"
				style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
			>
				<FansImage2
					width={46}
					height={46}
					viewStyle={{ borderRadius: "full" }}
					source={require("@assets/images/default-avatar.png")}
				/>
				<FansGap width={13} />
				<FansView grow>
					<FansText fontFamily="inter-bold" fontSize={19}>
						{username}
					</FansText>
				</FansView>
				<FansView
					width={34}
					height={34}
					touchableOpacityProps={{ onPress: onPressDelete }}
					alignItems="center"
					borderRadius="full"
					justifyContent="center"
					style={tw.style("bg-fans-grey-f0 dark:bg-fans-grey-43")}
				>
					<FypSvg
						width={11.87}
						height={14.76}
						svg={Trash2Svg}
						color="fans-black dark:fans-white"
					/>
				</FansView>
			</FansView>
		</Swipeable>
	) : (
		<FansView
			height={68}
			alignItems="center"
			flexDirection="row"
			style={tw.style("bg-fans-white dark:bg-fans-black-1d")}
		>
			{handleAdd && (
				<FansView
					width={34}
					height={34}
					touchableOpacityProps={{ onPress: handleAdd }}
					alignItems="center"
					borderRadius="full"
					justifyContent="center"
					style={tw.style("bg-fans-grey-f0 dark:bg-fans-grey-43")}
				>
					<FypSvg
						width={11.87}
						height={14.76}
						svg={PlusSvg}
						color="fans-black dark:fans-white"
					/>
				</FansView>
			)}
			{handleAdd && <FansGap width={12} />}
			<FansImage2
				width={46}
				height={46}
				viewStyle={{ borderRadius: "full" }}
				source={require("@assets/images/default-avatar.png")}
			/>
			<FansGap width={13} />
			<FansView grow>
				<FansText fontFamily="inter-bold" fontSize={19}>
					{username}
				</FansText>
			</FansView>
		</FansView>
	);
};

const BlockedUsersTab = (props: {
	blockedUsers: IUser[];
	trigDeleteBlockedUser: (id: string) => void;
}) => {
	const { blockedUsers, trigDeleteBlockedUser } = props;

	return (
		<Fragment>
			<FansText fontFamily="inter-semibold" fontSize={17}>
				Blocked
			</FansText>
			<FansGap height={13.5} />
			<FansView>
				{blockedUsers.map((item, index) => {
					const { id } = item;
					const handleDelete = () => trigDeleteBlockedUser(id);

					return (
						<Fragment key={id}>
							{index !== 0 && (
								<FansHorizontalDivider height={2} />
							)}
							<UserItem data={item} onDelete={handleDelete} />
						</Fragment>
					);
				})}
			</FansView>
		</Fragment>
	);
};

const SearchResultSection = (props: {
	users: IUser[];
	trigBlockUser: (id: string) => void;
}) => {
	const { users, trigBlockUser } = props;

	return (
		<Fragment>
			<FansView>
				{users.map((item, index) => {
					const { id } = item;
					const handleAdd = () => trigBlockUser(id);

					return (
						<Fragment key={id}>
							{index !== 0 && (
								<FansHorizontalDivider height={2} />
							)}
							<UserItem data={item} onAdd={handleAdd} />
						</Fragment>
					);
				})}
			</FansView>
		</Fragment>
	);
};

const PrivacyScreen = (props: PrivacyNativeStackScreenProps<"Privacy">) => {
	const { state, dispatch } = useAppContext();
	const profile = state.profile;

	const [isSearching, setIsSearching] = useState(false);

	const [isHideTips, setHideTips] = useState(profile.hideTips ?? false);
	const [isHideLikes, setHideLikes] = useState(profile.hideLikes ?? false);
	const [isDisableComments, setDisableComments] = useState(
		profile.hideComments ?? false,
	);
	const [isExplicitCommentFiltering, setExplicitCommentFiltering] = useState(
		profile.explicitCommentFilter ?? false,
	);
	const [isAllowScreenshot, setIsAllowScreenshot] = useState(
		profile.isAllowedScreenshot ?? false,
	);
	const [isWatermark, setWatermark] = useState(profile.watermark ?? false);

	const topSectionHeight = useRef(new Animated.Value(490)).current;
	const cancelSearchButtonWidth = useRef(new Animated.Value(0)).current;
	const bottomSectionTabHeight = useRef(new Animated.Value(51)).current;

	const animateShowSearchUser = () => {
		Animated.timing(topSectionHeight, {
			toValue: 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
		Animated.timing(cancelSearchButtonWidth, {
			toValue: 64,
			duration: 300,
			useNativeDriver: false,
		}).start();
		Animated.timing(bottomSectionTabHeight, {
			toValue: 0,
			duration: 300,
			useNativeDriver: false,
		}).start();

		setIsSearching(true);
	};
	const animateHideSearchUser = () => {
		Animated.timing(topSectionHeight, {
			toValue: 490,
			duration: 300,
			useNativeDriver: false,
		}).start();
		Animated.timing(cancelSearchButtonWidth, {
			toValue: 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
		Animated.timing(bottomSectionTabHeight, {
			toValue: 51,
			duration: 300,
			useNativeDriver: false,
		}).start();

		setIsSearching(false);
	};

	const [blockedUsers, setBlockedUsers] = useState<IUser[]>([]);
	const trigDeleteBlockedUser = async (id: string) => {
		const resp = await blockUser({}, { id: id });

		if (resp.ok) {
			setSearchResult([
				...searchResult,
				...blockedUsers.filter((value) => value.id === id),
			]);
			setBlockedUsers((prev) => prev.filter((value) => value.id !== id));
		}
	};

	const [keyword, setKeyword] = useState("");
	const [searchResult, setSearchResult] = useState<IUser[]>([]);
	const trigBlockUser = async (id: string) => {
		const resp = await blockUser({}, { id: id });

		if (resp.ok) {
			setBlockedUsers([
				...blockedUsers,
				...searchResult.filter((value) => value.id === id),
			]);
			setSearchResult((prev) => prev.filter((value) => value.id !== id));

			animateHideSearchUser();
		}
	};

	const { navigation } = props;
	const router = useRouter();
	const featureGates = useFeatureGates();

	const saveSettings = async (body: ProfileReqBody) => {
		const resp = await updateMyProfile(body);

		if (resp.ok) {
			dispatch.setProfile({
				type: ProfileActionType.updateProfile,
				data: body,
			});
		}
	};

	useEffect(() => {
		const fetchMyProfile = async () => {
			const resp = await getProfile();
			if (resp.ok) {
				setHideTips(resp.data.hideTips ?? false);
				setHideLikes(resp.data.hideLikes ?? false);
				setDisableComments(resp.data.hideComments ?? false);
				setExplicitCommentFiltering(
					resp.data.explicitCommentFilter ?? false,
				);
				setIsAllowScreenshot(resp.data.isAllowedScreenshot ?? false);
				setWatermark(resp.data.watermark ?? false);
			}
		};

		const fetchBlockedUsers = async () => {
			const resp = await getBlockedUsers({});
			if (resp.ok) {
				setBlockedUsers(resp.data.blockedUsers);
			}
		};

		fetchMyProfile();
		fetchBlockedUsers();
	}, []);

	useEffect(() => {
		const searchUsers = async () => {
			const resp = await searchUsersToBlock({ query: keyword });
			if (resp.ok) {
				setSearchResult(resp.data.users);
			}
		};

		searchUsers();
	}, [keyword]);

	const handlePress = () => {
		if (isSearching) {
			animateHideSearchUser();
		} else if (navigation.canGoBack()) {
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

	return (
		<FansScreen3 contentStyle1={{ maxWidth: { lg: 670 } }}>
			<Animated.View
				style={{ height: topSectionHeight, overflow: "hidden" }}
			>
				<FansView gap={6}>
					{featureGates.has("2024_01-hide-tips") && (
						<FansSwitch1
							height={52}
							value={isHideTips}
							label="Hide tips"
							onValueChange={(value) => {
								setHideTips(value);
								saveSettings({ hideTips: value });
							}}
						/>
					)}
					{featureGates.has("2024_01-hide-tips") && <FansDivider />}
					<FansSwitch1
						height={52}
						value={isHideLikes}
						label="Hide likes"
						onValueChange={(value) => {
							setHideLikes(value);
							saveSettings({ hideLikes: value });
						}}
					/>
					<FansDivider />
					<FansSwitch1
						height={52}
						value={isDisableComments}
						label="Disable comments"
						onValueChange={(value) => {
							setDisableComments(value);
							saveSettings({ hideComments: value });
						}}
					/>
					<FansDivider />

					{featureGates.has("2024_01-explicit-comment-filter") && (
						<FansSwitch1
							height={52}
							value={isExplicitCommentFiltering}
							label="Explicit comment filtering"
							onValueChange={(value) => {
								setExplicitCommentFiltering(value);
								saveSettings({ explicitCommentFilter: value });
							}}
						/>
					)}
					{featureGates.has("2024_01-explicit-comment-filter") && (
						<FansDivider />
					)}

					{featureGates.has("2024_01-allow-screenshot") && (
						<FansSwitch1
							height={52}
							value={isAllowScreenshot}
							label="Allow fans to screenshot content"
							onValueChange={(value) => {
								setIsAllowScreenshot(value);
								saveSettings({ isAllowedScreenshot: value });
							}}
						/>
					)}
					{featureGates.has("2024_01-allow-screenshot") && (
						<FansDivider />
					)}

					<FansSwitch1
						height={52}
						value={isWatermark}
						label="Watermark"
						onValueChange={(value) => {
							setWatermark(value);
							saveSettings({ watermark: value });
						}}
					/>
				</FansView>
				<FansGap height={29} />
				<FansView>
					<FansText fontFamily="inter-semibold" fontSize={19}>
						Block users
					</FansText>
					<FansGap height={10} />
					<FansText
						fontSize={16}
						style={tw.style(
							"text-fans-grey-70 dark:text-fans-grey-b1",
						)}
					>
						They won't be able to access, view your profile, or
						interact with any of your content
					</FansText>
				</FansView>
			</Animated.View>
			<FansGap height={10} />
			<FansView alignItems="center" flexDirection="row" gap={12}>
				<FansTextInput5
					viewStyle={{ grow: true }}
					iconNode={
						<FypSvg
							width={13.14}
							height={13.26}
							svg={Search1Svg}
							color="fans-black dark:fans-white"
						/>
					}
					textInputStyle={{
						placeholder: "Search user",
						onFocus: animateShowSearchUser,
						style: tw.style(
							"bg-fans-grey-f0 dark:bg-fans-grey-43 border-fans-grey-f0 dark:border-fans-grey-43",
						),
					}}
					value={keyword}
					onChangeText={setKeyword}
				/>
				<Animated.View
					style={{
						width: cancelSearchButtonWidth,
						overflow: "hidden",
					}}
				>
					<FansView
						width={64}
						touchableOpacityProps={{
							onPress: animateHideSearchUser,
						}}
					>
						<FansText fontSize={19}>Cancel</FansText>
					</FansView>
				</Animated.View>
			</FansView>
			<FansGap height={10} />
			<FansView>
				<FansGap height={24.5} />

				{!isSearching && (
					<BlockedUsersTab
						blockedUsers={blockedUsers}
						trigDeleteBlockedUser={trigDeleteBlockedUser}
					/>
				)}

				{isSearching && (
					<SearchResultSection
						users={searchResult}
						trigBlockUser={trigBlockUser}
					/>
				)}
			</FansView>
			<FansGap height={20} />
		</FansScreen3>
	);
};

export default PrivacyScreen;
