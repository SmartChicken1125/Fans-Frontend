import { StarCheckSvg, ThreeDotsVerticalSvg } from "@assets/svgs/common";
import {
	FypNullableView,
	FypText,
	FypSvg,
	FypLink,
} from "@components/common/base";
import { FansDivider, FansIconButton, FansView } from "@components/controls";
import tw from "@lib/tailwind";
import { UserRoleTypes } from "@usertypes/commonEnums";
import { IProfile, IUserInfo } from "@usertypes/types";
import React, { FC, useState } from "react";
import { Pressable, View } from "react-native";
import OutsidePressHandler from "react-native-outside-press";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import AvatarWithStatus from "../AvatarWithStatus";

interface Props {
	profile: IProfile;
	userInfo: IUserInfo;
	onPressDisplayName: () => void;
	onPressPrivacy: () => void;
	onPressTerms: () => void;
	onPressLogOut: () => void;
}

const UserPopupMenu: FC<Props> = (props) => {
	const {
		profile,
		onPressDisplayName,
		onPressTerms,
		onPressPrivacy,
		onPressLogOut,
		userInfo,
	} = props;
	const [showMenu, setShowMenu] = useState(false);

	const getAvatarSize = () => {
		if (tw.prefixMatch("lg")) {
			return 46;
		} else if (tw.prefixMatch("md")) {
			return 31;
		} else {
			return 50;
		}
	};

	const handlePress = () => {
		if (userInfo.type === UserRoleTypes.Creator) {
			onPressDisplayName();
		}
	};

	return (
		<Pressable
			style={tw.style(
				"flex-row items-center relative",
				"p-[18px] border-t border-fans-grey-f0",
				"md:p-0 md:border-t-0",
			)}
			onPress={handlePress}
		>
			<AvatarWithStatus
				avatar={profile.avatar}
				size={getAvatarSize()}
				onPress={handlePress}
				style="hidden md:flex"
			/>

			<View style={tw.style("md:flex-1", "mr-3 md:ml-2 lg:ml-3")}>
				<View
					style={tw.style(
						"flex-row items-center",
						!profile.displayName && "hidden",
					)}
				>
					<FypText
						fontSize={{ xs: 19, md: 13, lg: 19 }}
						lineHeight={{ xs: 26, md: 13, lg: 26 }}
						fontWeight={700}
						numberOfLines={1}
						style={tw.style(
							"mr-3",
							"text-fans-black dark:text-fans-white",
							tw.prefixMatch("md") ? "flex-1" : "max-w-50",
						)}
					>
						{profile.displayName}
					</FypText>

					<StarCheckSvg
						style={tw.style(
							"w-4 h-4 md:w-[11.3px] md:h-[10.8px] lg:w-[15.66px] lg:h-[15px]",
						)}
					/>
				</View>
				<FypText
					fontSize={{ xs: 16, md: 11, lg: 16 }}
					lineHeight={{ xs: 21, md: 14, lg: 21 }}
					style={tw.style("text-fans-grey-70 dark:text-fans-grey-b1")}
				>
					{userInfo.type === UserRoleTypes.Fan
						? `@${userInfo.username}`
						: profile.profileLink
						? `@${profile.profileLink}`
						: ""}
				</FypText>
			</View>
			<FansIconButton
				size={18}
				backgroundColor="transparent"
				onPress={() => setShowMenu(!showMenu)}
				style={tw.style("ml-auto")}
			>
				<FypSvg
					width={18}
					height={18}
					color="fans-black dark:fans-white"
					svg={ThreeDotsVerticalSvg}
				/>
			</FansIconButton>
			<FypNullableView visible={showMenu}>
				<OutsidePressHandler
					onOutsidePress={() => setShowMenu(false)}
					style={[
						tw.style(
							"absolute",
							"w-[223px] md:w-full",
							"right-[18px] md:left-0 md:right-0",
						),
						{ top: tw.prefixMatch("lg") ? -210 : -180 },
					]}
				>
					<Animated.View
						entering={FadeIn}
						exiting={FadeOut}
						style={[
							tw.style(
								"pt-7 pb-[26px] md:py-5 lg:py-[26px] px-[18px] rounded-[15px]",
								`bg-fans-white dark:bg-fans-black-1d`,
							),
							{
								shadowColor: tw.prefixMatch("dark")
									? "rgba(255,255,255,0.16)"
									: "rgba(0,0,0,0.16)",
								shadowOffset: {
									width: 0,
									height: 3,
								},
								shadowRadius: 6,
							},
						]}
					>
						<FansView gap={{ xs: 20, lg: 28 }}>
							<FypLink
								onPress={onPressTerms}
								style={tw.style(
									"w-full justify-start text-fans-black dark:text-fans-white",
								)}
								fontSize={18}
								lineHeight={24}
							>
								Terms of use
							</FypLink>
							<FypLink
								onPress={onPressPrivacy}
								style={tw.style(
									"w-full justify-start text-fans-black dark:text-fans-white",
								)}
								fontSize={18}
								lineHeight={24}
							>
								Privacy Policy
							</FypLink>
						</FansView>
						<FansDivider style={tw.style("my-4 lg:my-5")} />
						<FypLink
							onPress={onPressLogOut}
							style={tw.style(
								"w-full justify-start text-fans-black dark:text-fans-white",
							)}
							fontSize={18}
							lineHeight={24}
						>
							Log out
						</FypLink>
					</Animated.View>
				</OutsidePressHandler>
			</FypNullableView>
		</Pressable>
	);
};

export default UserPopupMenu;
