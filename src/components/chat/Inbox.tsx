import {
	ChevronRightSvg,
	PictureSvg,
	PinSvg,
	ReadSvg,
	TipSvg,
	VideoRecordSvg,
	WarningSvg,
} from "@assets/svgs/common";
import OnlineAvatar from "@components/avatar/OnlineAvatar";
import { FypSvg } from "@components/common/base";
import { FansGap, FansSvg, FansText, FansView } from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { UserRoleTypes } from "@usertypes/commonEnums";
import { Colors } from "@usertypes/enums";
import { IConversationMeta, MessageType } from "@usertypes/types";
import { formatRelativeDateTime } from "@utils/dateTime";
import React, { Fragment, memo } from "react";
import { View } from "react-native";

interface InboxProps {
	data: IConversationMeta;
}

const enum IconType {
	None,
	Picture,
	Read,
	Video,
	Tip,
}

const InboxIcon = memo((props: { type: IconType }) => {
	if (props.type === IconType.None) return null;
	else if (props.type === IconType.Picture)
		return (
			<>
				<FansSvg
					width={11.12}
					height={11.12}
					svg={PictureSvg}
					color1="grey-70"
				/>
				<FansGap width={7.5} />
				<FansText
					color="grey-70"
					fontFamily="inter-semibold"
					fontSize={16}
				>
					•
				</FansText>
				<FansGap width={5.8} />
			</>
		);
	else if (props.type === IconType.Read)
		return (
			<>
				<FansSvg
					width={15.23}
					height={7.84}
					svg={ReadSvg}
					color1="purple"
				/>
				<FansGap width={6.2} />
			</>
		);
	else if (props.type === IconType.Video)
		return (
			<Fragment>
				<FansSvg
					width={12.22}
					height={11.34}
					svg={VideoRecordSvg}
					color1="grey-70"
				/>
				<FansGap width={6.5} />
				<FansText
					color="grey-70"
					fontFamily="inter-semibold"
					fontSize={16}
				>
					•
				</FansText>
				<FansGap width={5.8} />
			</Fragment>
		);
	else if (props.type === IconType.Tip)
		return (
			<>
				<FansSvg
					width={15.23}
					height={7.84}
					svg={TipSvg}
					color1="purple"
				/>
				<FansGap width={6.2} />
			</>
		);
});

const Inbox = (props: InboxProps) => {
	const { data } = props;
	const {
		icon,
		isBlocked,
		isPinned,
		name,
		lastMessage,
		lastReadMessageId,
		earnings,
		unreadCount,
	} = data;

	const { state } = useAppContext();
	const { userInfo } = state.user;
	const { type } = userInfo;

	const isCreator = type === UserRoleTypes.Creator;
	const unread = lastMessage ? lastMessage?.id !== lastReadMessageId : false;

	return (
		<FansView
			style={tw.style(
				"bg-fans-white dark:bg-fans-black-1d",
				isBlocked ? "opacity-50" : "",
			)}
		>
			<View style={tw.style("flex-row gap-[10px] items-center")}>
				<View style={tw.style("relative")}>
					<OnlineAvatar
						size="46px"
						online={false}
						image={icon ?? undefined}
					/>
				</View>
				<View style={tw.style("flex", "grow")}>
					<View style={tw.style("flex-row gap-[5px] items-center")}>
						{isPinned && <PinSvg size={22} color={Colors.Purple} />}
						<FansText
							fontFamily={
								unread ? "inter-semibold" : "inter-medium"
							}
							fontSize={19}
						>
							{name}
						</FansText>
						{unread && (
							<FansView
								style={tw.style(
									"bg-fans-purple",
									"px-[7px]",
									"py-[1px]",
									"rounded-full",
								)}
							>
								<FansText
									color="white"
									fontFamily="inter-semibold"
									fontSize={14}
								>
									{unreadCount}
								</FansText>
							</FansView>
						)}
						{isBlocked && (
							<WarningSvg size={14} color={Colors.Red} />
						)}
						<View style={tw.style("grow")} />
						<View
							style={tw.style("flex-row gap-[5px] items-center")}
						>
							{lastMessage && (
								<FansText
									fontSize={14}
									style={tw.style(
										"text-fans-grey-70 dark:text-fans-grey-b1",
									)}
								>
									{formatRelativeDateTime(
										lastMessage.createdAt,
									)}
								</FansText>
							)}
							<FypSvg
								svg={ChevronRightSvg}
								width={12}
								height={12}
								color="fans-grey-70 dark:fans-grey-b1"
							/>
						</View>
					</View>
					<FansView
						alignItems="center"
						flexDirection="row"
						style={tw.style("mt-[10px]")}
					>
						<FansView width={0} grow>
							<FansText
								fontFamily={
									unread ? "inter-semibold" : "inter-regular"
								}
								fontSize={16}
								numberOfLines={1}
								style={tw.style(
									"text-fans-grey-70 dark:text-fans-grey-b1",
								)}
							>
								<InboxIcon
									type={
										lastMessage?.messageType ===
										MessageType.MEDIA
											? IconType.Picture
											: lastMessage?.messageType ===
											  MessageType.TIP
											? IconType.Tip
											: IconType.Read
									}
								/>
								{lastMessage?.content}
							</FansText>
						</FansView>
						{isCreator && earnings && earnings !== 0 && (
							<FansView
								style={tw.style(
									"bg-fans-green/10",
									"px-[7px] py-[1px]",
								)}
								borderRadius="full"
							>
								<FansText
									color="green"
									fontFamily="inter-semibold"
									fontSize={14}
								>
									${earnings}
								</FansText>
							</FansView>
						)}
					</FansView>
				</View>
			</View>
		</FansView>
	);
};

export default Inbox;
