import {
	AccountSvg,
	AnalyticsSvg,
	CalendarSvg,
	CameoVideoSVG,
	Chat2Svg,
	ChevronLeft1Svg,
	ChevronRight2Svg,
	HeartSvg,
	IntegrationSvg,
	NotificationSvg,
	PaymentSvg,
	PrivacySvg,
	SpeakerSvg,
	VideoCallSvg,
	WarningSvg,
} from "@assets/svgs/common";
import { FypSvg } from "@components/common/base";
import { ToggleThemeButton } from "@components/common/layout/tabMenu";
import {
	FansDivider,
	FansGap,
	FansScreen3,
	FansSvg,
	FansText,
	FansView,
} from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
import { UserRoleTypes } from "@usertypes/commonEnums";
import { Colors } from "@usertypes/enums";
import { isDesktop } from "@utils/global";
import { useNavigation, useRouter, useSegments } from "expo-router";
import React, { Fragment } from "react";
import { TouchableOpacity } from "react-native";
import { SvgProps } from "react-native-svg";

interface FansSvgProps extends SvgProps {
	color?: string;
	fill?: string;
	size?: number;
}

type ItemProps = {
	icon?: React.FC<FansSvgProps>;
	iconNode?: React.ReactNode;
	isActive?: boolean;
	text: string;
	onPress?: () => void;
};

const Item = (props: ItemProps) => {
	const { isActive, iconNode } = props;

	return (
		<TouchableOpacity onPress={props.onPress}>
			<FansView
				height={{ xs: 52, lg: 68 }}
				style={tw.style(
					"lg:pl-[37.5px] lg:pr-[39.5px]",
					isActive && "lg:bg-fans-purple/10",
					"flex-row gap-[20px] items-center",
				)}
			>
				{props.icon ? (
					<props.icon size={24} color={Colors.Purple} />
				) : (
					iconNode
				)}
				<FansView style={tw.style("grow")}>
					<FansText
						style={tw.style(
							isActive && "lg:font-inter-bold",
							"text-[18px]",
						)}
					>
						{props.text}
					</FansText>
				</FansView>
				<FypSvg
					width={6.14}
					height={12.28}
					svg={ChevronRight2Svg}
					color="fans-grey-70 dark:fans-grey-b1"
				/>
			</FansView>
		</TouchableOpacity>
	);
};

export const SettingsScreenContent = () => {
	const navigation = useNavigation();
	const router = useRouter();
	const segments = useSegments();

	const { state, dispatch } = useAppContext();
	const { toggleTheme } = dispatch;
	const { userInfo } = state.user;
	const { type } = userInfo;
	const { video, cameo } = state.profile.settings;
	const isCreator = type === UserRoleTypes.Creator;
	const featureGates = useFeatureGates();

	const handleMenuItemPress = (path: string) => {
		router.push(path);
	};

	const handlePressVideoCall = () => {
		router.push({
			pathname: "video-call-setup",
			params: {
				screen: video ? "EditVideoCallSetup" : "VideoCallSetupFaq",
			},
		});
	};

	const handlePressCustomVideo = () => {
		router.push({
			pathname: "custom-video-setup",
			params: {
				screen: cameo ? "Edit" : "Faq",
			},
		});
	};

	return (
		<Fragment>
			<FansView display={{ xs: "hidden", lg: "flex" }}>
				<FansGap height={65} />
				<FansView alignItems="center" flexDirection="row">
					<FansGap width={38} />
					<FansView
						touchableOpacityProps={{
							onPress: () => {
								if (navigation.canGoBack()) {
									navigation.goBack();
									return;
								}
								router.push({
									pathname: "posts",
									params: { screen: "Home" },
								});
							},
						}}
						flex="1"
					>
						<FansSvg
							width={6.36}
							height={12.72}
							svg={ChevronLeft1Svg}
							color1="grey-70"
						/>
					</FansView>
					<FansGap width={30.6} />
					<FansText fontFamily="inter-bold" fontSize={23}>
						Settings
					</FansText>
					<FansGap width={68.6} />
					<FansView grow />
				</FansView>
			</FansView>
			<FansView
				style={tw.style("max-w-[339px]")}
				alignSelf="center"
				display={{ lg: "hidden" }}
			>
				<FansText fontSize={16} textAlign="center">
					See information about your account, download an archive of
					your data, or learn about your account deactivation options
				</FansText>
			</FansView>
			<FansGap height={{ xs: 33, sm: 47 }} />
			<Item
				text="Account"
				iconNode={
					<FansSvg
						width={22.59}
						height={23}
						svg={AccountSvg}
						color1="purple"
					/>
				}
				isActive={
					segments[0] === "(tabs)" &&
					(segments[1] === "account" || segments[1] === "settings")
				}
				onPress={() => handleMenuItemPress("/account")}
			/>
			{featureGates.has("2023_11-custom-videos") && (
				<Item
					text="Fan profile"
					iconNode={
						<FansSvg
							width={22.59}
							height={23}
							svg={AccountSvg}
							color1="purple"
						/>
					}
					isActive={
						segments[0] === "(tabs)" &&
						segments[1] === "fan-profile-setup"
					}
					onPress={() => handleMenuItemPress("/fan-profile-setup")}
				/>
			)}
			<Item
				text="Payments"
				icon={PaymentSvg}
				isActive={
					segments[0] === "(tabs)" && segments[1] === "payments"
				}
				onPress={() => handleMenuItemPress("/payments")}
			/>
			{isCreator && (
				<>
					<Item
						text="Analytics"
						icon={AnalyticsSvg}
						isActive={
							segments[0] === "(tabs)" &&
							segments[1] === "analytics"
						}
						onPress={() => handleMenuItemPress("/analytics")}
					/>
					{featureGates.has("2023_11-referral-links") &&
						isCreator && (
							<Item
								text="Creator Referral"
								icon={SpeakerSvg}
								isActive={
									segments[0] === "(tabs)" &&
									(segments[1] === "referrals" ||
										segments[1] === "refer-analytics" ||
										segments[1] === "refer-payout")
								}
								onPress={() => {
									handleMenuItemPress("/referrals");
								}}
							/>
						)}
					{featureGates.has("2023_10-random-future-stuff") && (
						<Item
							text="Privacy & Safety"
							icon={PrivacySvg}
							isActive={
								segments[0] === "(tabs)" &&
								segments[1] === "privacy-safety"
							}
							onPress={() =>
								handleMenuItemPress("/privacy-safety")
							}
						/>
					)}
				</>
			)}
			<FansDivider
				ver1
				style={tw.style(
					"h-[1px]",
					isDesktop && "ml-[37.5px] mr-[39.5px]",
				)}
			/>
			<Item
				text="Notifications"
				isActive={
					segments[0] === "(tabs)" &&
					segments[1] === "notifications-option"
				}
				iconNode={
					<FypSvg
						width={22}
						height={25}
						svg={NotificationSvg}
						color="fans-purple"
					/>
				}
				onPress={() => handleMenuItemPress("/notifications-option")}
			/>
			{featureGates.has("2023_10-video-calls") && (
				<Item
					text={video ? "Video Calls" : "Setup Video Calls"}
					isActive={
						segments[0] === "(tabs)" &&
						segments[1] === "video-call-setup"
					}
					icon={VideoCallSvg}
					onPress={handlePressVideoCall}
				/>
			)}
			{featureGates.has("2023_11-custom-videos") && (
				<Item
					text="Custom video orders"
					isActive={
						segments[0] === "(tabs)" &&
						segments[1] === "custom-video-setup"
					}
					icon={CameoVideoSVG}
					onPress={handlePressCustomVideo}
				/>
			)}

			{featureGates.has("2023_10-discord-integration") && isCreator && (
				<Item
					text="Discord integration"
					isActive={
						segments[0] === "(tabs)" &&
						segments[1] === "connections"
					}
					icon={IntegrationSvg}
					onPress={() => handleMenuItemPress("/connections")}
				/>
			)}
			<Item
				text="Subscribed"
				icon={HeartSvg}
				isActive={
					segments[0] === "(tabs)" && segments[1] === "subscriptions"
				}
				onPress={() => handleMenuItemPress("/subscriptions")}
			/>
			{featureGates.has("2023_10-random-future-stuff") && isCreator && (
				<Item
					text="Automated chats"
					iconNode={
						<FansSvg
							width={23.61}
							height={23.61}
							svg={Chat2Svg}
							color={tw.color("fans-purple")}
						/>
					}
					isActive={
						segments[0] === "(tabs)" &&
						segments[1] === "automated-chats"
					}
					onPress={() => handleMenuItemPress("/automated-chats")}
				/>
			)}
			{featureGates.has("2024_02-scheduled-post") && isCreator && (
				<Item
					text="Scheduled posts"
					icon={CalendarSvg}
					isActive={
						segments[0] === "(tabs)" &&
						segments[1] === "scheduled-posts"
					}
					onPress={() => handleMenuItemPress("/scheduled-posts")}
				/>
			)}
			<>
				<FansDivider
					ver1
					style={tw.style(
						"h-[1px]",
						isDesktop && "ml-[37.5px] mr-[39.5px]",
					)}
				/>
				<Item
					text="Report abuse"
					icon={WarningSvg}
					isActive={
						segments[0] === "(tabs)" &&
						segments[1] === "report-abuse"
					}
					onPress={() => handleMenuItemPress("/report-abuse")}
				/>
			</>
			<FansView padding={{ l: 37.5 }}>
				<ToggleThemeButton toggleTheme={toggleTheme} />
			</FansView>

			<FansGap height={20} />
		</Fragment>
	);
};

const SettingsScreen = () => {
	return (
		<FansScreen3>
			<SettingsScreenContent />
		</FansScreen3>
	);
};

export default SettingsScreen;
