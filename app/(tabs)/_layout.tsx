import {
	ChatSvg,
	FilledChatSvg,
	FilledHomeSvg,
	FilledNotificationSvg,
	HomeSvg,
	NotificationSvg,
	OutlinedPlusSvg,
} from "@assets/svgs/common";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { FypSvg } from "@components/common/base";
import { CommonActionType, useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { AuthState, authStateAtom } from "@state/auth";
import { chatUnreadCountSelector } from "@state/chat";
import { useFeatureGates } from "@state/featureGates";
import { notificationCountSelector } from "@state/notifications";
import { StorageKeyTypes, UserRoleTypes } from "@usertypes/commonEnums";
import { setVolatileStorage } from "@utils/storage";
import {
	Tabs,
	useGlobalSearchParams,
	useRouter,
	useSegments,
} from "expo-router";
import React, { Fragment, useEffect } from "react";
import { Platform } from "react-native";
import { useRecoilValue } from "recoil";

const publicLinks = [
	"(tabs)/[username]",
	"(tabs)/terms",
	"(tabs)/support",
	"auth/login",
	"auth/register",
	"auth/checkYourEmail",
	"auth/verifyAccount",
	"auth/createNewPassword",
	"auth/resetPassword",
	"auth/welcome",
	"",
];

const NewLayout = () => {
	// const [, , setColorScheme] = useAppColorScheme(tw);
	const router = useRouter();
	const segments = useSegments();
	const { screen } = useGlobalSearchParams();
	const { state, dispatch } = useAppContext();
	const { userInfo } = state.user;
	const authState = useRecoilValue(authStateAtom);

	const notificationCount = useRecoilValue(notificationCountSelector);
	const chatUnreadCount = useRecoilValue(chatUnreadCountSelector);
	const featureGates = useFeatureGates();

	const chatEnabled = featureGates.has("2023_10-chat");

	const themeColor = tw.prefixMatch("dark") ? "#1d1d1d" : "#fff";

	const onClickNewPost = () => {
		if (userInfo.type === UserRoleTypes.Creator) {
			dispatch.setCommon({
				type: CommonActionType.toggleNewPostTypesModal,
				data: true,
			});
		} else {
			router.push({
				pathname: "profile",
				params: {
					screen: "ProfileName",
				},
			});
		}
	};
	const needShowTabBar = () => {
		return (
			segments[0] === "(tabs)" &&
			[
				"",
				"posts",
				"notifications",
				"create",
				"chat",
				"profile",
			].includes(segments[1])
		);
	};

	useEffect(() => {
		// the app is still loading.
		if (segments.length === 1 && segments[0] === "(tabs)") return;

		const route = segments.join("/");
		if (!publicLinks.includes(route)) {
			if (authState === AuthState.Unauthenticated) {
				// console.log(
				// 	"route",
				// 	route,
				// 	"is not in publicLinks, redirecting to login",
				// );
				if (Platform.OS === "web") {
					setVolatileStorage(
						StorageKeyTypes.RedirectAfterLogin,
						window.location.pathname,
					);
				}
				router.push("/auth/login");
			} else if (authState === AuthState.Loading) {
				// console.log("authState is loading, waiting for it to finish");
			}
		}
	}, [segments, authState]);

	useEffect(() => {
		if (userInfo.id === "0") {
			(async () => {
				const resp = await dispatch.fetchUserInfo();
				if (!resp.ok) return;
				dispatch.fetchProfile();
				dispatch.fetchSuggestedCreators();
			})();
		}
	}, [userInfo.id]);
	// console.log(screen);
	return (
		<Fragment>
			<Tabs
				backBehavior="history"
				screenOptions={{
					headerShown: false,
					tabBarShowLabel: false,
					tabBarStyle: {
						display:
							!tw.prefixMatch("lg") && needShowTabBar()
								? "flex"
								: "none",
					},
				}}
				id="RootNavigator"
			>
				<Tabs.Screen
					name="posts"
					initialParams={{ screen: "Home" }}
					options={{
						tabBarIcon: ({ focused }) => (
							<>
								{focused ? (
									<FypSvg
										svg={FilledHomeSvg}
										width={25}
										height={25}
										color="fans-black dark:fans-white"
									/>
								) : (
									<FypSvg
										svg={HomeSvg}
										width={25}
										height={25}
										color="fans-black dark:fans-white"
									/>
								)}
							</>
						),
						tabBarStyle: {
							backgroundColor: themeColor,
							borderTopColor: tw.color("fans-purple"),
							display: !tw.prefixMatch("md")
								? screen === "Home"
									? "flex"
									: "none"
								: "none",
						},
					}}
					listeners={() => ({
						tabPress: (e) => {
							e.preventDefault();
							router.replace({
								pathname: "posts",
								params: { screen: "Home" },
							});
						},
					})}
				/>
				<Tabs.Screen
					name="search"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="notifications"
					options={{
						tabBarBadge: notificationCount,
						tabBarBadgeStyle: tw.style(
							"min-w-[20px] min-h-[16px]",
							"bg-fans-purple",
							"text-[11px]",
						),
						tabBarIcon: ({ focused }) =>
							focused ? (
								<FypSvg
									width={25}
									height={25}
									color="fans-black dark:fans-white"
									svg={FilledNotificationSvg}
								/>
							) : (
								<FypSvg
									width={25}
									height={25}
									color="fans-black dark:fans-white"
									svg={NotificationSvg}
								/>
							),
						tabBarStyle: {
							display: !tw.prefixMatch("md") ? "flex" : "none",
							backgroundColor: themeColor,
							borderTopColor: tw.color("fans-purple"),
						},
					}}
				/>
				<Tabs.Screen
					name="create"
					options={{
						tabBarIcon: () => (
							<FypSvg
								width={25}
								height={25}
								color="fans-black dark:fans-white"
								svg={OutlinedPlusSvg}
							/>
						),
						tabBarStyle: {
							display: !tw.prefixMatch("md") ? "flex" : "none",
							backgroundColor: themeColor,
							borderTopColor: tw.color("fans-purple"),
						},
					}}
					listeners={() => ({
						tabPress: (e) => {
							e.preventDefault();
							onClickNewPost();
						},
					})}
				/>
				<Tabs.Screen
					name="chat"
					options={{
						tabBarBadge: chatUnreadCount,
						tabBarBadgeStyle: tw.style(
							"min-w-[20px] min-h-[16px]",
							"bg-fans-purple",
							"text-[11px]",
						),
						tabBarItemStyle: chatEnabled
							? undefined
							: { display: "none" },
						tabBarIcon: ({ focused }) =>
							focused ? (
								<FypSvg
									width={25}
									height={25}
									color="fans-black dark:fans-white"
									svg={FilledChatSvg}
								/>
							) : (
								<FypSvg
									width={25}
									height={25}
									color="fans-black dark:fans-white"
									svg={ChatSvg}
								/>
							),
						tabBarStyle: {
							display: !tw.prefixMatch("md") ? "flex" : "none",
							backgroundColor: themeColor,
							borderTopColor: tw.color("fans-purple"),
						},
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						tabBarIcon: () => (
							<AvatarWithStatus
								isOnline={true}
								avatar={userInfo.avatar}
								size={30}
								hasOnlineStatus
							/>
						),
						tabBarItemStyle: {
							display:
								userInfo.type === UserRoleTypes.Creator
									? "flex"
									: "none",
						},
						tabBarStyle: {
							display: !tw.prefixMatch("md") ? "flex" : "none",
							backgroundColor: themeColor,
							borderTopColor: tw.color("fans-purple"),
						},
					}}
				/>

				<Tabs.Screen
					name="settings"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="terms"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="privacy"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="[username]"
					options={{
						href: null,
						tabBarItemStyle: { display: "none" },
						tabBarStyle: {
							display: tw.prefixMatch("md")
								? "none"
								: userInfo.id === "0"
								? "none"
								: "flex",
							backgroundColor: themeColor,
							borderTopColor: tw.color("fans-purple"),
						},
					}}
				/>
				<Tabs.Screen
					name="get-gems"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="stories"
					options={{
						href: null,
						tabBarItemStyle: { display: "none" },
						tabBarStyle: {
							display: "none",
						},
					}}
				/>
				<Tabs.Screen
					name="playlist"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="vault"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="referrals"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="refer-analytics"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="index"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="refer-payout"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="bookmarks"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="p/[id]"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="home"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="logo"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="create-post"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="referrals/payout"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="referrals/creator"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="referrals/analytics"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="referrals/dashboard"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="referrals/earn"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="referrals/find"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="referrals/program"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="referrals/index"
					options={{
						href: null,
					}}
				/>

				<Tabs.Screen
					name="account"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="payments"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="analytics"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="custom-video-setup"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="connections"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="report-abuse"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="subscriptions"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="automated-chats"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="scheduled-posts"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="fan-profile-setup"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="notifications-option"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="video-call-setup"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="videocall"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="custom-video"
					options={{
						href: null,
					}}
				/>
				<Tabs.Screen
					name="privacy-safety"
					options={{
						href: null,
					}}
				/>
			</Tabs>
		</Fragment>
	);
};

export default NewLayout;
