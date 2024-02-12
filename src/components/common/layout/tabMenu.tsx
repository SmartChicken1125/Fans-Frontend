import {
	ChatSvg,
	ChevronDownSvg,
	Diamond1Png,
	FilledChatSvg,
	FilledHomeSvg,
	FilledNotificationSvg,
	FilledPlusSvg,
	FilledSearchSvg,
	InstallSvg,
	LargeSearch,
	MoonSvg,
	NotificationSvg,
	OutlinedHomeSvg,
	OutlinedPlusSvg,
	SunSvg,
	ThreeDotsSvg,
} from "@assets/svgs/common";
import {
	FypButton,
	FypCollapsible,
	FypLinearGradientView,
	FypNullableView,
	FypSvg,
	FypText,
} from "@components/common/base";
import { FansDivider, FansSvg, FansView } from "@components/controls";
import {
	CommonActionType,
	PostsActionType,
	useAppContext,
} from "@context/useAppContext";
import { getSubscribedProfiles } from "@helper/endpoints/userlist/apis";
import { SubscribedProfilesRespBody } from "@helper/endpoints/userlist/schemas";
import tw from "@lib/tailwind";
import { AuthState, authStateAtom } from "@state/auth";
import { chatUnreadCountSelector } from "@state/chat";
import { useFeatureGates } from "@state/featureGates";
import { notificationCountSelector } from "@state/notifications";
import {
	PostStepTypes,
	StorageKeyTypes,
	UserRoleTypes,
} from "@usertypes/commonEnums";
import { IProfile } from "@usertypes/types";
import { setVolatileStorage } from "@utils/storage";
import { useBlankLink } from "@utils/useBlankLink";
import { usePathname, useRouter } from "expo-router";
import React, { FC, useEffect, useState } from "react";
import {
	Image,
	NativeScrollEvent,
	Platform,
	Pressable,
	PressableProps,
	ScrollView,
} from "react-native";
import Animated, {
	Easing,
	FadeIn,
	FadeOut,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { useRecoilValue } from "recoil";
import AvatarWithStatus from "../AvatarWithStatus";
import UserPopupMenu from "./userPopupMenu";

interface MembershipSectionProps {
	profiles: IProfile[];
	onPressCallback?: () => void;
}

export const MembershipSection: FC<MembershipSectionProps> = (props) => {
	const { profiles, onPressCallback } = props;
	const router = useRouter();
	const [showMemberships, setShowMemberships] = useState(true);

	const onPressUser = (profileLink: string) => {
		if (onPressCallback) {
			onPressCallback();
		}
		router.push(`/${profileLink}`);
	};

	return (
		<FansView style={tw.style("pl-4.5 pr-3 lg:pl-[26px] lg:pr-4")}>
			<FansDivider />
			<FansView
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
				padding={{ y: 30 }}
				pressableProps={{
					onPress: () => setShowMemberships(!showMemberships),
				}}
			>
				<FypText
					fontSize={{ xs: 19, md: 14, lg: 20 }}
					lineHeight={{ xs: 26, md: 17, lg: 27 }}
					fontWeight={600}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					Memberships
				</FypText>
				<FansView
					alignItems="center"
					justifyContent="center"
					width={13}
					height={13}
					style={{
						transform: [
							{
								rotate: showMemberships ? "180deg" : "0deg",
							},
						],
					}}
				>
					<FypSvg
						width={13}
						height={13}
						color="fans-grey-70 dark:fans-grey-b1"
						svg={ChevronDownSvg}
					/>
				</FansView>
			</FansView>
			<FypCollapsible collapsed={!showMemberships}>
				<FansView gap={{ xs: 20, md: 12 }}>
					{profiles.map((subscribedProfile) => (
						<FansView
							key={subscribedProfile.id}
							pressableProps={{
								onPress: () =>
									onPressUser(subscribedProfile.profileLink),
							}}
							flexDirection="row"
							alignItems="center"
							style={tw.style("gap-4 md:gap-5")}
						>
							<AvatarWithStatus
								size={30}
								avatar={subscribedProfile.avatar}
							/>
							<FypText
								fontSize={{
									xs: 18,
									md: 14,
									lg: 20,
								}}
								lineHeight={{
									xs: 26,
									md: 17,
									lg: 27,
								}}
								fontWeight={500}
								numberOfLines={1}
								style={tw.style(
									"flex-1 text-fans-black dark:text-fans-white",
								)}
							>
								{subscribedProfile.displayName}
							</FypText>
						</FansView>
					))}
				</FansView>
			</FypCollapsible>
		</FansView>
	);
};

interface LinkItemProps extends PressableProps {
	title: string;
	children: React.ReactNode;
	isSelected: boolean;
	collapsed: boolean;
}

export const LinkItem: FC<LinkItemProps> = (props) => {
	const { title, children, isSelected, collapsed, ...others } = props;

	return (
		<FansView
			style={tw.style(
				"relative h-[38px] pl-[55px] lg:h-13 lg:pl-19 flex justify-center",
				collapsed ? "w-10.5 pl-0" : "w-[190px] lg:w-[262px]",
			)}
			pressableProps={{
				...others,
			}}
		>
			<FansView position="absolute" style={tw.style("left-5 lg:left-7")}>
				{children}
			</FansView>
			<FypNullableView visible={!collapsed}>
				<FypText
					fontSize={{ xs: 14, lg: 20 }}
					lineHeight={{ xs: 17, lg: 27 }}
					fontWeight={isSelected ? 700 : 500}
					style={tw.style("text-fans-black dark:text-fans-white")}
				>
					{title}
				</FypText>
			</FypNullableView>
		</FansView>
	);
};

interface ToggleThemeButtonProps {
	toggleTheme: () => void;
}

export const ToggleThemeButton: FC<ToggleThemeButtonProps> = (props) => {
	const { toggleTheme } = props;
	const isDarkMode = tw.prefixMatch("dark");
	const offset = useSharedValue(isDarkMode ? 0 : 1);

	const thumbStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withTiming(
						offset.value * (tw.prefixMatch("lg") ? 151 : 125) + 4.5,
						{
							duration: 500,
							easing: Easing.bezier(0.5, 0.01, 0, 1),
						},
					),
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

	const handleToggleTheme = () => {
		toggleTheme();
		offset.value = isDarkMode ? 1 : 0;
	};

	return (
		<Pressable onPress={handleToggleTheme}>
			<Animated.View
				style={[
					tw.style(
						"w-40 lg:w-[192px] h-[34px] lg:h-[42px] rounded-[25px] relative md:mt-5 lg:mt-[30px]",
					),
					buttonStyles,
				]}
			>
				<FypText
					fontSize={{ xs: 15, lg: 18 }}
					lineHeight={{ xs: 20, lg: 24 }}
					color="white"
					style={tw.style(
						"top-[7px] lg:top-[9px] absolute",
						tw.prefixMatch("dark") ? "right-[46px]" : "left-[46px]",
					)}
				>
					{tw.prefixMatch("dark") ? "Dark mode" : "Light mode"}
				</FypText>
				<Animated.View
					style={[
						tw.style(
							"w-[26px] h-[26px] lg:w-[34px] lg:h-[34px] rounded-full absolute top-1",
							"items-center justify-center bg-fans-white",
						),
						thumbStyles,
					]}
				>
					{isDarkMode ? (
						<Animated.View
							entering={FadeIn.delay(500)}
							exiting={FadeOut}
						>
							<FypSvg
								svg={MoonSvg}
								width={tw.prefixMatch("lg") ? 20 : 16}
								height={tw.prefixMatch("lg") ? 20 : 16}
								color="fans-black-1d"
							/>
						</Animated.View>
					) : (
						<Animated.View
							entering={FadeIn.delay(500)}
							exiting={FadeOut}
						>
							<FypSvg
								svg={SunSvg}
								width={tw.prefixMatch("lg") ? 20 : 16}
								height={tw.prefixMatch("lg") ? 20 : 16}
								color="fans-black"
							/>
						</Animated.View>
					)}
				</Animated.View>
			</Animated.View>
		</Pressable>
	);
};

interface Props {
	onToggleMore: () => void;
	collapsed: boolean;
	onLogout: () => void;
}

const TabMenu: FC<Props> = (props) => {
	const { onToggleMore, collapsed, onLogout } = props;

	const router = useRouter();
	const pathname = usePathname();
	const [openLink] = useBlankLink();

	const { state, dispatch } = useAppContext();
	const { userInfo } = state.user;
	const { profile } = state;
	const { step: postFormStep, visible: openedPostFormModal } =
		state.posts.modal;
	const { openNewPostTypesModal } = state.common;
	const loggedIn = userInfo.id !== "0";

	const notificationCount = useRecoilValue(notificationCountSelector);
	const chatUnreadCount = useRecoilValue(chatUnreadCountSelector);
	const authState = useRecoilValue(authStateAtom);

	const featureGates = useFeatureGates();

	const chatEnabled = featureGates.has("2023_10-chat");
	const searchEnabled = featureGates.has("2023_10-search");

	const isLg = tw.prefixMatch("lg");
	const offset = useSharedValue(isLg ? 287 : 210);

	const [profiles, setProfiles] = useState<SubscribedProfilesRespBody>({
		profiles: [],
		page: 1,
		size: 10,
		total: 0,
	});
	const [isLoading, setIsLoading] = useState(false);

	const animationStyle = useAnimatedStyle(() => {
		return {
			width: withTiming(offset.value, {
				duration: 100,
				easing: Easing.linear,
			}),
			minWidth: withTiming(offset.value, {
				duration: 100,
				easing: Easing.linear,
			}),
		};
	});

	const onChangeRouter = (pathname: string) => {
		if (Platform.OS === "web") {
			setVolatileStorage(
				StorageKeyTypes.RedirectAfterLogin,
				window.location.pathname,
			);
		}
		router.replace(pathname);
	};

	const onGoToProfile = () => {
		if (userInfo.type === UserRoleTypes.Creator) {
			router.replace({
				pathname: "profile",
				params: { screen: "Profile" },
			});
		} else {
			router.replace({
				pathname: "profile",
				params: { screen: "ProfileName" },
			});
		}
	};

	const onCreate = () => {
		if (userInfo.type === UserRoleTypes.Creator) {
			if (postFormStep === PostStepTypes.Empty) {
				dispatch.setCommon({
					type: CommonActionType.toggleNewPostTypesModal,
					data: true,
				});
			} else {
				dispatch.setPosts({
					type: PostsActionType.updatePostModal,
					data: {
						visible: true,
					},
				});
			}
		} else {
			router.replace({
				pathname: "profile",
				params: { screen: "ProfileName" },
			});
		}
	};

	const onGoToHomePage = () => {
		router.replace({
			pathname: "posts",
			params: { screen: "Home" },
		});
	};

	const onClickDisplayName = () => {
		router.replace({
			pathname: "profile",
			params: { screen: "Profile" },
		});
	};

	const onGoToPrivacy = () => {
		openLink(
			"https://app.termly.io/document/privacy-policy/8234c269-74cc-48b6-9adb-be080aaaee11",
		);
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
		if (collapsed) {
			offset.value = isLg ? 88 : 55;
		} else {
			offset.value = isLg ? 287 : 210;
		}
	}, [collapsed, isLg]);

	useEffect(() => {
		fetchSubscribedProfiles();
	}, []);

	useEffect(() => {
		fetchSubscribedProfiles();
	}, [profiles.page]);

	return (
		<Animated.View style={[animationStyle, tw.style("flex-1 relative")]}>
			<ScrollView
				onScroll={({ nativeEvent }) => onScrollView(nativeEvent)}
				scrollEventThrottle={30}
				contentContainerStyle={[
					tw.style(
						"border-r flex-1",
						`border-fans-grey-de dark:border-fans-grey-50`,
					),
				]}
			>
				<FansView>
					<FansView
						style={[
							tw.style(
								"pb-10 pt-8 lg:pt-[55px] lg:pb-12 relative",
								collapsed ? "pr-3" : "pr-4.5 lg:pr-6",
							),
							{
								paddingBottom: 180,
							},
						]}
					>
						<FansView
							style={tw.style(
								"mb-9.5 lg:mb-13 pl-4.5",
								collapsed
									? "mx-auto lg:mx-0 lg:ml-0"
									: "lg:pl-7",
							)}
							pressableProps={{
								onPress: onGoToHomePage,
							}}
						>
							{collapsed ? (
								<FansSvg
									style={tw.style(
										"w-[28.5px] h-[28.5px] lg:w-10 lg:h-10",
									)}
									svg={Diamond1Png}
								/>
							) : (
								// <LogoSvg
								// 	style={tw.style(
								// 		"w-[142px] h-[28.5px] lg:w-[196px] lg:h-10",
								// 	)}
								// />
								<Image
									source={require("@assets/images/fypfanswebsitelogo.png")}
									style={tw.style(
										"w-[142px] h-[26px] lg:w-[196px] lg:h-9",
									)}
								/>
							)}
						</FansView>

						<FansView style={tw.style("gap-y-3 lg:gap-y-4 mb-10")}>
							<FypNullableView visible={loggedIn}>
								<LinkItem
									title="Home"
									isSelected={pathname.startsWith("/posts")}
									collapsed={collapsed}
									onPress={() => onChangeRouter("/posts")}
								>
									{pathname === "/posts" ? (
										<FypSvg
											svg={FilledHomeSvg}
											color="fans-black dark:fans-white"
											width={{ xs: 18, lg: 25 }}
											height={{ xs: 18, lg: 25 }}
										/>
									) : (
										<FypSvg
											svg={OutlinedHomeSvg}
											color="fans-black dark:fans-white"
											width={{ xs: 18, lg: 25 }}
											height={{ xs: 18, lg: 25 }}
										/>
									)}
								</LinkItem>
							</FypNullableView>

							{searchEnabled && (
								<LinkItem
									onPress={() => onChangeRouter("/search")}
									title="Search"
									isSelected={pathname === "/search"}
									collapsed={collapsed}
								>
									{pathname === "/search" ? (
										<FypSvg
											color="fans-black dark:fans-white"
											svg={FilledSearchSvg}
											width={{ xs: 22, lg: 25 }}
											height={{ xs: 22, lg: 25 }}
										/>
									) : (
										<FypSvg
											color="fans-black dark:fans-white"
											svg={LargeSearch}
											width={{ xs: 22, lg: 25 }}
											height={{ xs: 22, lg: 25 }}
										/>
									)}
								</LinkItem>
							)}
							<FypNullableView visible={loggedIn}>
								<LinkItem
									onPress={() =>
										onChangeRouter("/notifications")
									}
									title="Notifications"
									isSelected={pathname.startsWith(
										"/notifications",
									)}
									collapsed={collapsed}
								>
									<FansView position="relative">
										{pathname === "/notifications" ? (
											<FypSvg
												color="fans-black dark:fans-white"
												svg={FilledNotificationSvg}
												width={{ xs: 18, lg: 25 }}
												height={{ xs: 20, lg: 28 }}
											/>
										) : (
											<FypSvg
												color="fans-black dark:fans-white"
												svg={NotificationSvg}
												width={{ xs: 18, lg: 25 }}
												height={{ xs: 20, lg: 28 }}
											/>
										)}

										{notificationCount > 0 && (
											<FansView
												background="fans-purple"
												position="absolute"
												style={tw.style(
													"px-1 rounded-[20px] pt-[3px] right-[-9px] top-[-5px] lg:pt-[1px] lg:top-[-6px] lg:right-[-12px]",
												)}
											>
												<FypText
													color="white"
													fontWeight={700}
													fontSize={{ xs: 8, lg: 11 }}
													lineHeight={{
														xs: 9,
														lg: 15,
													}}
												>
													{notificationCount}
												</FypText>
											</FansView>
										)}
									</FansView>
								</LinkItem>
								<LinkItem
									onPress={onCreate}
									title={
										userInfo.type === UserRoleTypes.Creator
											? "Create"
											: "Become Creator"
									}
									isSelected={false}
									collapsed={collapsed}
								>
									{openedPostFormModal ||
									openNewPostTypesModal ? (
										<FypSvg
											color="fans-black dark:fans-white"
											svg={FilledPlusSvg}
											width={{ xs: 20, lg: 28 }}
											height={{ xs: 20, lg: 28 }}
										/>
									) : (
										<FypSvg
											color="fans-black dark:fans-white"
											svg={OutlinedPlusSvg}
											width={{ xs: 20, lg: 28 }}
											height={{ xs: 20, lg: 28 }}
										/>
									)}

									{/* {userInfo.type === UserRoleTypes.Creator ? (
								<OutlinedPlusSvg
									style={tw.style("w-5 h-5 lg:w-7 lg:h-7")}
									color="#000"
								/>
							) : (
								<ShortSvg
									style={tw.style("w-5 h-5 lg:w-7 lg:h-7")}
									color="#000"
								/>
							)} */}
								</LinkItem>
								{chatEnabled && (
									<LinkItem
										onPress={() => onChangeRouter("/chat")}
										title="Messages"
										isSelected={pathname.startsWith(
											"/chat",
										)}
										collapsed={collapsed}
									>
										<FansView position="relative">
											{pathname === "/chat" ? (
												<FypSvg
													svg={FilledChatSvg}
													color="fans-black dark:fans-white"
													width={{ xs: 20, lg: 28 }}
													height={{ xs: 20, lg: 28 }}
												/>
											) : (
												<FypSvg
													svg={ChatSvg}
													color="fans-black dark:fans-white"
													width={{ xs: 20, lg: 28 }}
													height={{ xs: 20, lg: 28 }}
												/>
											)}

											{notificationCount > 0 && (
												<FansView
													background="fans-purple"
													position="absolute"
													style={tw.style(
														"px-1 rounded-[20px] pt-[3px] right-[-9px] top-[-5px] lg:pt-[1px] lg:top-[-6px] lg:right-[-12px]",
													)}
												>
													<FypText
														color="white"
														fontWeight={700}
														fontSize={{
															xs: 8,
															lg: 11,
														}}
														lineHeight={{
															xs: 9,
															lg: 15,
														}}
													>
														{chatUnreadCount}
													</FypText>
												</FansView>
											)}
										</FansView>
									</LinkItem>
								)}
								{userInfo.type === UserRoleTypes.Creator ? (
									<LinkItem
										onPress={onGoToProfile}
										title="Profile"
										isSelected={pathname.startsWith(
											"/profile",
										)}
										collapsed={collapsed}
									>
										<AvatarWithStatus
											avatar={profile.avatar}
											size={isLg ? 31 : 22}
											onPress={onGoToProfile}
										/>
									</LinkItem>
								) : null}

								<FypNullableView visible={!collapsed}>
									<LinkItem
										title="More"
										isSelected={false}
										collapsed={collapsed}
										onPress={onToggleMore}
									>
										<FypSvg
											color="fans-black dark:fans-white"
											width={{ xs: 20, lg: 24 }}
											height={{ xs: 20, lg: 24 }}
											svg={ThreeDotsSvg}
										/>
									</LinkItem>
								</FypNullableView>

								<FypNullableView visible={!collapsed}>
									<MembershipSection
										profiles={profiles.profiles}
									/>
								</FypNullableView>
							</FypNullableView>
						</FansView>

						<FypNullableView
							visible={authState === AuthState.Unauthenticated}
						>
							<FypButton
								textStyle={tw.style(
									"text-[19px] font-bold leading-[26px] text-fans-purple",
								)}
								style={tw.style(
									"border border-fans-grey-de rounded-[28px] h-[42px] max-w-[220px] mb-3",
								)}
								onPress={() => onChangeRouter("/auth/login")}
							>
								Log in
							</FypButton>

							<FypLinearGradientView
								style={tw.style("max-w-[220px]")}
								height={42}
								borderRadius={28}
								colors={["#1d21e5", "#a854f5", "#d885ff"]}
							>
								<FansView
									width="full"
									height="full"
									alignItems="center"
									justifyContent="center"
									pressableProps={{
										onPress: () =>
											onChangeRouter("/auth/register"),
									}}
								>
									<FypText
										fontSize={19}
										lineHeight={26}
										fontWeight={700}
										color="white"
									>
										Sign up
									</FypText>
								</FansView>
							</FypLinearGradientView>
						</FypNullableView>
					</FansView>
				</FansView>
			</ScrollView>
			<FypNullableView visible={!collapsed && loggedIn}>
				<FansView
					style={[
						tw.style(
							"pl-4.5 pr-3 mt-auto lg:pl-[26px] lg:pr-4 pb-12",
							"absolute bottom-0 w-full max-w-[192px] lg:max-w-[264px]",
							"bg-fans-white dark:bg-fans-black-1d",
						),
					]}
				>
					<FansDivider />
					<FypNullableView
						visible={featureGates.has("2023_12-get-app-button")}
					>
						<FansView
							borderRadius={34}
							height={34}
							gap={5}
							margin={{ b: 30, t: 12 }}
							flexDirection="row"
							alignItems="center"
							justifyContent="center"
							style={tw.style("border border-fans-purple")}
						>
							<FypSvg
								width={13}
								height={13}
								color="fans-purple"
								svg={InstallSvg}
							/>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								style={tw.style("text-fans-purple")}
							>
								Get app
							</FypText>
						</FansView>
					</FypNullableView>
					<FansView margin={{ t: 30 }}>
						<UserPopupMenu
							profile={profile}
							userInfo={userInfo}
							onPressLogOut={onLogout}
							onPressDisplayName={onClickDisplayName}
							onPressPrivacy={onGoToPrivacy}
							onPressTerms={() => onChangeRouter("/terms")}
						/>
					</FansView>
				</FansView>
			</FypNullableView>
		</Animated.View>
	);
};

export default TabMenu;
