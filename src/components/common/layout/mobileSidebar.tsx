import {
	BookmarkSvg,
	ChevronDownSvg,
	EditUserSvg,
	GemSvg,
	HeartSvg,
	LanguageSvg,
	LogoutSvg,
	MoonSvg,
	PaymentSvg,
	PolygonSvg,
	QuestionCircledSvg,
	RefferalSvg,
	SearchSvg,
	SettingSvg,
	ShopSvg,
	StarCheckSvg,
	SunSvg,
	SupportSvg,
} from "@assets/svgs/common";
import { FypNullableView, FypSvg, FypText } from "@components/common/base";
import BottomSheetWrapper from "@components/common/bottomSheetWrapper";
import { FansDivider, FansView } from "@components/controls";
import { MenuItem } from "@components/posts/common";
import { languages } from "@constants/languages";
import {
	CommonActionType,
	ProfileActionType,
	useAppContext,
} from "@context/useAppContext";
import { authLogout } from "@helper/endpoints/auth/apis";
import { getSubscribedProfiles } from "@helper/endpoints/userlist/apis";
import { SubscribedProfilesRespBody } from "@helper/endpoints/userlist/schemas";
import tw from "@lib/tailwind";
import { authAtom } from "@state/auth";
import { useFeatureGates } from "@state/featureGates";
import { SnapPoints, UserRoleTypes } from "@usertypes/commonEnums";
import { useBlankLink } from "@utils/useBlankLink";
import { useRouter } from "expo-router";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import {
	Dimensions,
	LayoutRectangle,
	NativeScrollEvent,
	Pressable,
	ScrollView,
	View,
	useWindowDimensions,
} from "react-native";
import { Menu } from "react-native-paper";
import { Popable } from "react-native-popable";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSetRecoilState } from "recoil";
import AvatarWithStatus from "../AvatarWithStatus";
import { MembershipSection } from "./tabMenu";
import UserPopupMenu from "./userPopupMenu";

const windowWidth = Dimensions.get("window").width;

export const LanguageButton = () => {
	const [language, setLanguage] = useState("en");
	const [openLangMenu, setOpenLangMenu] = useState(false);

	const onChangeLanguage = (lang: string) => {
		setLanguage(lang);
		setOpenLangMenu(false);
	};

	return (
		<FansView position="relative">
			<Menu
				visible={openLangMenu}
				onDismiss={() => setOpenLangMenu(false)}
				anchor={
					<MenuItem
						title={
							languages.find((lang) => lang.data === language)
								?.label ?? "English"
						}
						icon={
							<FypSvg
								svg={LanguageSvg}
								width={24}
								height={24}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={() => setOpenLangMenu(true)}
						endIcon={
							<FypSvg
								svg={ChevronDownSvg}
								width={12.28}
								height={6.14}
								color="fans-black dark:fans-white"
							/>
						}
					/>
				}
				contentStyle={tw.style("max-w-full bg-white")}
				style={tw.style("left-[18px] right-[18px] bg-white")}
			>
				{languages.map((lang) => (
					<Menu.Item
						key={lang.data}
						onPress={() => onChangeLanguage(lang.data)}
						title={lang.label}
						titleStyle={tw.style(
							"text-fans-black dark:text-fans-white",
						)}
						style={tw.style("w-full max-w-full")}
					/>
				))}
			</Menu>
		</FansView>
	);
};

interface LightDarkSwitchProps {
	toggleTheme: () => void;
}

export const LightDarkSwitch: FC<LightDarkSwitchProps> = (props) => {
	const { toggleTheme } = props;
	const isDarkMode = tw.prefixMatch("dark");
	const offset = useSharedValue(isDarkMode ? 0 : 1);

	const handleToggleTheme = () => {
		toggleTheme();
		offset.value = isDarkMode ? 1 : 0;
	};

	const thumbStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withTiming(offset.value * 37 + 4.5, {
						duration: 300,
						easing: Easing.bezier(0.5, 0.01, 0, 1),
					}),
				},
			],
		};
	});

	const buttonStyles = useAnimatedStyle(() => {
		return {
			backgroundColor: withTiming(isDarkMode ? "#434343" : "#a854f5", {
				duration: 500,
				easing: Easing.bezier(0.5, 0.01, 0, 1),
			}),
		};
	});

	return (
		<Pressable style={tw.style("mt-15 pl-5")} onPress={handleToggleTheme}>
			<Animated.View
				style={[
					tw.style("w-20 h-[42px] rounded-[25px] relative"),
					buttonStyles,
				]}
			>
				<FypSvg
					svg={SunSvg}
					width={25.3}
					height={25.3}
					style={tw.style("absolute top-[8.5px] left-[9px]")}
				/>
				<FypSvg
					svg={MoonSvg}
					width={24.06}
					height={24.05}
					style={tw.style("absolute top-[9px] right-[10px]")}
				/>
				<Animated.View
					style={[
						tw.style(
							"w-[34px] h-[34px] bg-white rounded-full absolute top-1",
						),
						thumbStyles,
					]}
				></Animated.View>
			</Animated.View>
		</Pressable>
	);
};

export const GemInfoPopable = () => {
	const ref = useRef<View>(null);

	const [layout, setLayout] = useState<LayoutRectangle>({
		width: 0,
		height: 0,
		x: 0,
		y: 0,
	});

	return (
		<View
			ref={ref}
			onLayout={(e) => {
				ref.current?.measureInWindow((x, y, width, height) => {
					setLayout({ x, y, width, height });
				});
			}}
		>
			<Popable
				// action="hover"
				// strictPosition={true}
				caret={false}
				position="bottom"
				style={{
					width: windowWidth - 36,
					left: -layout.x + 18,
					transform: [{ translateX: 0 }],
					marginTop: 20,
				}}
				backgroundColor="none"
				content={
					<FansView position="relative" padding={{ t: 13 }}>
						<FansView
							padding={{ x: 16, t: 15, b: 18 }}
							background="fans-purple-f6"
							borderRadius={15}
						>
							<FypText
								fontSize={16}
								lineHeight={21}
								textAlign="center"
								fontWeight={600}
								color="purple"
							>
								Gems are only used for tipping creators. This is
								our digital currency system, where 100 gems = $1
							</FypText>
						</FansView>
						<FypSvg
							width={24}
							height={13}
							color="fans-purple-f6"
							svg={PolygonSvg}
							style={[
								tw.style("absolute top-0"),
								{
									left: layout.x - 18,
									transform: [{ translateX: -6 }],
								},
							]}
						/>
					</FansView>
				}
			>
				<FypSvg
					width={15}
					height={15}
					color="fans-grey-b1"
					svg={QuestionCircledSvg}
				/>
			</Popable>
		</View>
	);
};

const MobileSidebar: FC = () => {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { state, dispatch } = useAppContext();
	const { toggleTheme } = dispatch;
	const setAuth = useSetRecoilState(authAtom);
	const { profile, user, common } = state;
	const { openSidebar } = common;
	const [openLink] = useBlankLink();
	const { height } = useWindowDimensions();
	const featureGates = useFeatureGates();

	const { userInfo } = state.user;
	const { type } = userInfo;

	const isCreator = type === UserRoleTypes.Creator;

	const [profiles, setProfiles] = useState<SubscribedProfilesRespBody>({
		profiles: [],
		page: 1,
		size: 10,
		total: 0,
	});
	const [isLoading, setIsLoading] = useState(false);

	const onClose = () => {
		dispatch.setCommon({
			type: CommonActionType.toggleSidebar,
			data: false,
		});
	};

	const onLogout = async () => {
		dispatch.setShowLoading();
		// await clearAllStorage();
		await authLogout(null);
		dispatch.setProfile({
			type: ProfileActionType.initProfile,
			data: {},
		});
		dispatch.setHideLoading();
		setAuth(undefined);
		onClose();
		router.push("/auth/login");
	};

	const onClickProfileLink = () => {
		onClose();
		if (user.userInfo.type === UserRoleTypes.Creator) {
			onClose();
			router.push("/profile");
		} else {
			router.push({
				pathname: "/profile",
				params: { screen: "ProfileName" },
			});
		}
	};

	const onSupport = useCallback(() => {
		onClose();
		openLink("https://support.fyp.fans/hc/en-us");
	}, []);

	const handlePressYourCards = () => {
		onClose();
		router.replace({
			pathname: "settings",
			params: { screen: "Payments" },
		});
	};

	const onGoToSubscriptions = () => {
		onClose();
		router.replace({
			pathname: "settings",
			params: { screen: "Subscriptions" },
		});
	};

	const onGoToReferCreators = () => {
		onClose();
		router.replace({
			pathname: "referrals",
		});
	};

	const onGoToSettings = () => {
		onClose();
		router.replace({
			pathname: "settings",
			params: { screen: tw.prefixMatch("lg") ? "Account" : "Settings" },
		});
	};

	const onNavigate = (pathname: string) => {
		onClose();
		router.push(pathname);
	};

	const onClickGetGem = () => {
		onClose();
		router.replace({ pathname: "get-gems", params: { gems: "1000" } });
	};

	const onGoToPrivacy = () => {
		openLink(
			"https://app.termly.io/document/privacy-policy/8234c269-74cc-48b6-9adb-be080aaaee11",
		);
	};

	const onClickDisplayName = () => {
		router.push(`/${profile.profileLink}`);
	};

	const fetchSubscribedProfiles = async () => {
		const query = {
			page: profiles.page,
			size: 10,
		};
		const resp = await getSubscribedProfiles(query);
		setIsLoading(false);
		if (resp.ok) {
			setProfiles({
				...resp.data,
				profiles:
					resp.data.page === 1
						? resp.data.profiles
						: [...profiles.profiles, ...resp.data.profiles],
			});
		}
	};

	const onScrollView = (nativeEvent: NativeScrollEvent) => {
		const paddingToBottom = 0;
		const isScrollEnd =
			nativeEvent.layoutMeasurement.height +
				nativeEvent.contentOffset.y >=
			nativeEvent.contentSize.height - paddingToBottom;
		if (isScrollEnd && !isLoading) {
			if (profiles.total > 10 * profiles.page) {
				setIsLoading(true);
				setProfiles({
					...profiles,
					page: profiles.page + 1,
				});
			}
		}
	};

	useEffect(() => {
		fetchSubscribedProfiles();
	}, []);

	useEffect(() => {
		fetchSubscribedProfiles();
	}, [profiles.page]);

	return (
		<BottomSheetWrapper
			open={openSidebar}
			onClose={onClose}
			snapPoint={SnapPoints.Ninety}
		>
			<FansView height={height * 0.9 - 50} position="relative">
				<ScrollView
					onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
					scrollEventThrottle={30}
					style={{
						paddingBottom: insets.bottom + 20,
					}}
				>
					<FansView
						padding={{ x: 18 }}
						flexDirection="row"
						margin={{ b: 30 }}
						style={tw.style("z-10")}
					>
						<FansView width={95} height={95} borderRadius={95}>
							<AvatarWithStatus
								avatar={user.userInfo.avatar}
								size={95}
							/>
						</FansView>

						<FansView margin={{ l: 16 }}>
							{profile.displayName && (
								<FansView
									flexDirection="row"
									alignItems="center"
								>
									<FypText
										fontSize={19}
										lineHeight={26}
										fontWeight={700}
										margin={{ r: 12 }}
										style={tw.style(
											"text-fans-black dark:text-fans-white",
										)}
									>
										{profile.displayName}
									</FypText>
									<StarCheckSvg width={15.66} height={15} />
								</FansView>
							)}
							<FypText
								fontSize={16}
								lineHeight={22}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								{user.userInfo.username
									? `@${user.userInfo.username}`
									: ""}
							</FypText>

							<FansView
								flexDirection="row"
								alignItems="center"
								margin={{ t: 14 }}
							>
								<FansView
									width={145}
									height={34}
									padding={{ l: 17 }}
									borderRadius={34}
									flexDirection="row"
									alignItems="center"
									border={1}
									borderColor="purple"
									touchableOpacityProps={{
										onPress: () => {
											onClose();
											onClickGetGem();
										},
									}}
								>
									<GemSvg size={17.4} />
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										color="purple"
										margin={{ l: 5 }}
									>
										Get Gems
									</FypText>
								</FansView>
								<FypNullableView
									visible={featureGates.has(
										"2023_12-gems-new-ui",
									)}
								>
									<FansView margin={{ l: 10 }}>
										<GemInfoPopable />
									</FansView>
								</FypNullableView>
							</FansView>
						</FansView>
					</FansView>
					<MenuItem
						title="Search"
						icon={
							<FypSvg
								svg={SearchSvg}
								width={19.22}
								height={19.4}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={() => onNavigate("/search")}
					/>

					<MenuItem
						title="Subscriptions"
						icon={
							<FypSvg
								svg={HeartSvg}
								width={23.5}
								height={21}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={onGoToSubscriptions}
					/>
					<MenuItem
						title="Collections"
						icon={
							<FypSvg
								svg={BookmarkSvg}
								width={16.26}
								height={20.12}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={() => onNavigate("/bookmarks")}
					/>
					{featureGates.has("2023_12-purchased-posts") && (
						<MenuItem
							title="Purchases"
							onPress={() => {
								onClose();
								router.replace({
									pathname: "profile",
									params: { screen: "Purchases" },
								});
							}}
							icon={
								<FypSvg
									svg={ShopSvg}
									width={19}
									height={24}
									color="fans-black dark:fans-white"
								/>
							}
						/>
					)}
					{featureGates.has("2023_11-referral-links") &&
						isCreator && (
							<MenuItem
								title={"Refer creators"}
								icon={
									<FypSvg
										svg={RefferalSvg}
										width={25}
										height={25}
										color="fans-black dark:fans-white"
									/>
								}
								onPress={onGoToReferCreators}
							/>
						)}
					<MenuItem
						title="Settings"
						icon={
							<FypSvg
								svg={SettingSvg}
								width={25}
								height={25}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={onGoToSettings}
					/>

					<FansDivider style={tw.style("mx-4.5 h-[1px]")} />

					<MenuItem
						title="Your cards"
						icon={
							<FypSvg
								svg={PaymentSvg}
								width={24}
								height={17.6}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={handlePressYourCards}
					/>
					<MenuItem
						title={
							user.userInfo.type === UserRoleTypes.Creator
								? "View profile page"
								: "Become a creator"
						}
						icon={
							<FypSvg
								svg={EditUserSvg}
								width={27.27}
								height={26.23}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={onClickProfileLink}
					/>

					<FansDivider style={tw.style("mx-4.5 h-[1px]")} />

					<MenuItem
						title="Support"
						icon={
							<FypSvg
								svg={SupportSvg}
								width={25}
								height={25}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={onSupport}
					/>
					<FypNullableView
						visible={featureGates.has("2023_12-language-options")}
					>
						<LanguageButton />
					</FypNullableView>

					<FansDivider style={tw.style("mx-4.5")} size={1} />

					<MenuItem
						title="Log out"
						icon={
							<FypSvg
								svg={LogoutSvg}
								width={23.33}
								height={24}
								color="fans-black dark:fans-white"
							/>
						}
						onPress={onLogout}
					/>

					<MembershipSection profiles={profiles.profiles} />
					<LightDarkSwitch toggleTheme={toggleTheme} />
				</ScrollView>

				<UserPopupMenu
					profile={profile}
					userInfo={userInfo}
					onPressLogOut={onLogout}
					onPressDisplayName={onClickDisplayName}
					onPressPrivacy={onGoToPrivacy}
					onPressTerms={() => {
						router.push("/terms");
					}}
				/>
			</FansView>
		</BottomSheetWrapper>
	);
};

export default MobileSidebar;
