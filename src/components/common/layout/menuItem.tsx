import {
	ChevronRightSvg,
	LargeSearch,
	HeartSvg,
	BookmarkSvg,
	RefferalSvg,
	SettingSvg,
	PaymentSvg,
	EditUserSvg,
	SupportSvg,
	LogoutSvg,
	LanguageSvg,
	UserSvg,
	CircleTipSvg,
	AnalyticsSvg,
	IntegrationSvg,
	CalendarSvg,
	PrivacySvg,
	NotificationSvg,
	ChatSvg,
	ShopSvg,
	VaultSvg,
	PayoutsSvg,
} from "@assets/svgs/common";
import { FypText, FypSvg } from "@components/common/base";
import { FansView } from "@components/controls";
import tw from "@lib/tailwind";
import React, { FC } from "react";
import { PressableProps } from "react-native";

interface Props extends PressableProps {
	title: string;
}

const MenuItem: FC<Props> = (props) => {
	const { title, ...others } = props;

	const getIcon = () => {
		switch (title) {
			case "Search":
				return (
					<FypSvg
						width={24}
						height={24}
						color="fans-black dark:fans-white"
						svg={LargeSearch}
					/>
				);
			case "Subscriptions":
				return (
					<FypSvg
						width={24}
						height={24}
						color="fans-black dark:fans-white"
						svg={HeartSvg}
					/>
				);
			case "Collections":
				return (
					<FypSvg
						width={20}
						height={22}
						color="fans-black dark:fans-white"
						svg={BookmarkSvg}
					/>
				);
			case "Refer creators":
				return (
					<FypSvg
						width={25}
						height={25}
						color="fans-black dark:fans-white"
						svg={RefferalSvg}
					/>
				);
			case "Referral Program":
				return (
					<FypSvg
						width={25}
						height={25}
						color="fans-black dark:fans-white"
						svg={RefferalSvg}
					/>
				);
			case "Settings":
				return (
					<FypSvg
						width={25}
						height={25}
						color="fans-black dark:fans-white"
						svg={SettingSvg}
					/>
				);
			case "Your cards":
				return (
					<FypSvg
						width={24}
						height={24}
						color="fans-black dark:fans-white"
						svg={PaymentSvg}
					/>
				);
			case "View profile page":
			case "Become a creator":
				return (
					<FypSvg
						width={27.3}
						height={26.23}
						color="fans-black dark:fans-white"
						svg={EditUserSvg}
					/>
				);
			case "Support":
				return (
					<FypSvg
						width={25}
						height={25}
						color="fans-black dark:fans-white"
						svg={SupportSvg}
					/>
				);
			case "Log out":
				return (
					<FypSvg
						width={23.3}
						height={24}
						color="fans-black dark:fans-white"
						svg={LogoutSvg}
					/>
				);
			case "English":
				return (
					<FypSvg
						width={24}
						height={24}
						color="fans-black dark:fans-white"
						svg={LanguageSvg}
					/>
				);
			case "Purchases":
				return (
					<FypSvg
						width={19}
						height={24}
						color="fans-black dark:fans-white"
						svg={ShopSvg}
					/>
				);
			case "Vault":
				return (
					<FypSvg
						svg={VaultSvg}
						width={25}
						height={21}
						color="fans-black dark:fans-white"
					/>
				);
			case "Payouts":
				return (
					<FypSvg
						svg={PayoutsSvg}
						width={27}
						height={23}
						color="fans-black dark:fans-white"
					/>
				);
			// settings icons
			case "Account":
				return (
					<FypSvg
						width={22.6}
						height={23}
						color="fans-purple"
						svg={UserSvg}
					/>
				);
			case "Payments":
				return (
					<FypSvg
						width={24}
						height={23}
						color="fans-purple"
						svg={CircleTipSvg}
					/>
				);
			case "Analytics":
				return (
					<FypSvg
						width={25}
						height={25}
						color="fans-purple"
						svg={AnalyticsSvg}
					/>
				);
			case "Creator Referral":
				return (
					<FypSvg
						width={25.52}
						height={22.86}
						color="fans-purple"
						svg={RefferalSvg}
					/>
				);
			case "Privacy & Safety":
				return (
					<FypSvg
						width={21.33}
						height={24}
						color="fans-purple"
						svg={PrivacySvg}
					/>
				);
			case "Notifications":
				return (
					<FypSvg
						width={22.47}
						height={25}
						color="fans-purple"
						svg={NotificationSvg}
					/>
				);
			case "Discord integration":
				return (
					<FypSvg
						width={24}
						height={24}
						color="fans-purple"
						svg={IntegrationSvg}
					/>
				);
			case "Automated chats":
				return (
					<FypSvg
						width={23.61}
						height={23.61}
						color="fans-purple"
						svg={ChatSvg}
					/>
				);
			case "Scheduled posts":
				return (
					<FypSvg
						width={21.42}
						height={24}
						color="fans-purple"
						svg={CalendarSvg}
					/>
				);
			default:
				null;
		}
	};

	return (
		<FansView
			position="relative"
			flexDirection="row"
			alignItems="center"
			style={tw.style("h-[38px] pl-[55px] lg:pl-[62px] lg:h-13")}
			pressableProps={{ ...others }}
		>
			<FansView position="absolute" left={15}>
				{getIcon()}
			</FansView>
			<FypText
				style={tw.style(
					"flex-1 text-[14px] leading-[17px] lg:text-[18px] lg:leading-6 text-fans-black dark:text-fans-white",
				)}
			>
				{title}
			</FypText>
			<FypSvg
				width={9}
				height={15}
				svg={ChevronRightSvg}
				color="fans-grey-70 dark:fans-grey-b1"
			/>
		</FansView>
	);
};

export default MenuItem;
