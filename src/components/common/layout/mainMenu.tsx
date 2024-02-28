import { CloseSvg } from "@assets/svgs/common";
import { FansIconButton } from "@components/controls";
import { FansDivider } from "@components/controls/Divider";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
import { UserRoleTypes } from "@usertypes/commonEnums";
import { useBlankLink } from "@utils/useBlankLink";
import { useRouter } from "expo-router";
import React, { FC, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { FypSvg } from "../base";
import MenuItem from "./menuItem";
import { ToggleThemeButton } from "./tabMenu";

interface Props {
	onClose: () => void;
	onLogout: () => void;
	toggleTheme: () => void;
}

const MainMenu: FC<Props> = (props) => {
	const { onClose, onLogout, toggleTheme } = props;
	const router = useRouter();
	const featureGates = useFeatureGates();
	const [openLink] = useBlankLink();

	const { state, dispatch } = useAppContext();
	const { user } = state;
	const { userInfo } = state.user;
	const { type } = userInfo;
	const { video } = state.profile.settings;

	const isCreator = type === UserRoleTypes.Creator;

	const onPressYourCard = () => {
		router.push("/payments");
	};

	const onPressProfile = () => {
		if (user.userInfo.type === UserRoleTypes.Creator) {
			router.push({
				pathname: "/profile",
				params: { screen: "Profile" },
			});
		} else {
			router.push({
				pathname: "/profile",
				params: { screen: "ProfileName" },
			});
		}
	};

	const onPressSubscriptions = () => {
		router.push("/subscriptions");
	};

	const onPressSettings = () => {
		router.push(tw.prefixMatch("lg") ? "/account" : "/settings");
	};

	const onPressCollections = () => {
		router.replace({
			pathname: "bookmarks",
			params: {
				screen: "COLLECTIONS",
			},
		});
	};

	const onPressPayouts = () => {
		router.push({
			pathname: "/profile",
			params: { screen: "GetPaid" },
		});
	};

	const onPressSupport = useCallback(() => {
		onClose();
		openLink("https://support.fyp.fans/hc/en-us");
	}, []);

	const onPressPurchases = async () => {
		router.push({
			pathname: "profile",
			params: { screen: "Purchases" },
		});
	};

	const onPressVault = () => {
		router.replace("/vault");
	};

	const onPressVideoCalls = () => {
		router.push({
			pathname: "video-call-setup",
			params: {
				screen: video ? "EditVideoCallSetup" : "VideoCallSetupFaq",
			},
		});
	};

	return (
		<ScrollView
			contentContainerStyle={[
				tw.style(
					"border-r flex-1 pb-5",
					`bg-fans-white dark:bg-fans-black-1d`,
					`border-fans-grey-de dark:border-fans-grey-50`,
				),
			]}
		>
			<View
				style={tw.style("pt-8 pl-3 pr-5 lg:pt-15.5 lg:pl-5 lg:pr-7.5")}
			>
				<FansIconButton
					backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
					onPress={onClose}
					style={tw.style("w-6 h-6 lg:w-7.5 lg:h-7.5 ml-auto")}
				>
					<FypSvg
						width={{ xs: 12, lg: 15 }}
						height={{ xs: 12, lg: 15 }}
						svg={CloseSvg}
						color="fans-white dark:fans-black"
					/>
				</FansIconButton>
				<View
					style={tw.style(
						"w-[214px] lg:w-[298px] gap-y-3 mt-[38px] lg:mt-14 lg:gap-y-4",
					)}
				>
					{/* <MenuItem title="Search" /> */}
					<MenuItem
						title="Subscriptions"
						onPress={onPressSubscriptions}
					/>
					<MenuItem
						title="Collections"
						onPress={onPressCollections}
					/>
					<MenuItem title="Purchases" onPress={onPressPurchases} />
					<MenuItem title="Vault" onPress={onPressVault} />
					{featureGates.has("2023_12-fans-referral") && isCreator && (
						<MenuItem
							title={"Referral Program"}
							onPress={() =>
								router.push({
									pathname: "/referrals/program",
								})
							}
						/>
					)}
					<MenuItem title="Payouts" onPress={onPressPayouts} />
					{featureGates.has("2023_10-video-calls") ? (
						<MenuItem
							title={video ? "Video Calls" : "Setup Video Calls"}
							onPress={onPressVideoCalls}
						/>
					) : null}

					<MenuItem title="Settings" onPress={onPressSettings} />
					<FansDivider />
					<MenuItem title="Your cards" onPress={onPressYourCard} />
					<MenuItem
						title={
							user.userInfo.type === UserRoleTypes.Creator
								? "View profile page"
								: "Become a creator"
						}
						onPress={onPressProfile}
					/>

					<MenuItem title="Support" onPress={onPressSupport} />
					{/* <MenuItem title="English" /> */}
					<FansDivider />
					<MenuItem title="Log out" onPress={onLogout} />
					<ToggleThemeButton toggleTheme={toggleTheme} />
				</View>
			</View>
		</ScrollView>
	);
};

export default MainMenu;
