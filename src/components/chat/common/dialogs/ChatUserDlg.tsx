import {
	AttachmentSvg,
	BlockSvg,
	EyeHideSvg,
	ImageSvg,
	ListSvg,
	Note2Svg,
	OutlinedPinSvg,
	UnNotificationSvg,
	WarningSvg,
} from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import { FypSvg } from "@components/common/base";
import {
	FansDivider,
	FansGap,
	FansSheet,
	FansText,
	FansView,
} from "@components/controls";
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { UserRoleTypes } from "@usertypes/commonEnums";
import { IFansSheet } from "@usertypes/components";
import { IConversationMeta } from "@usertypes/types";
import useClipboard from "@utils/useClipboard";
import { createURL } from "expo-linking";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ProfileSheet: IFansSheet<IConversationMeta> = (props) => {
	const { visible, data, onClose: trigClose, onSubmit: trigSubmit } = props;

	const { state } = useAppContext();
	const { userInfo } = state.user;
	const { type } = userInfo;

	const isCreator = type === UserRoleTypes.Creator;

	const { copyString } = useClipboard();

	const handlePressMedia = () => {
		trigClose();
		trigSubmit("Media");
	};

	const handlePressNotes = () => {
		trigClose();
		trigSubmit("Notes");
	};

	const handlePressPinned = () => {
		trigClose();
		trigSubmit("Pinned");
	};

	const handlePressBlock = () => {
		trigClose();
		trigSubmit("Block");
	};

	return (
		<FansSheet visible={visible} onClose={trigClose} onSubmit={trigSubmit}>
			<FansGap height={46} />
			<FansView
				style={tw.style("lg:w-[433px]", "px-[17px] lg:px-[37px]")}
			>
				<View style={tw.style("flex items-center")}>
					<UserAvatar size="95px" image={data?.icon ?? undefined} />
					<FansGap height={8} />
					<View style={tw.style("flex-row gap-[6px] items-center")}>
						<Text
							style={tw.style(
								"font-inter-bold",
								"text-[19px] text-fans-black dark:text-fans-white",
							)}
						>
							{data?.name}
						</Text>
						{/* <View style={tw.style("w-[15.66px] h-[15px]")}>
							<StarCheckSvg />
						</View> */}
					</View>
					<FansGap height={1} />
					<Text
						style={tw.style(
							"text-[16px] text-fans-grey-dark dark:text-fans-grey-b1",
						)}
					>
						@{data?.name}
					</Text>
					<FansGap height={8} />
					{isCreator && (
						<View
							style={tw.style("flex-row gap-[5px] items-center")}
						>
							<FansText
								color="grey-70"
								fontFamily="inter-semibold"
								fontSize={16}
							>
								Level {data?.xpLevel}
							</FansText>
							<FansGap width={6.5} />
							<FansText
								color="grey-70"
								fontFamily="inter-semibold"
								fontSize={16}
							>
								•
							</FansText>
							<FansGap width={5.8} />
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
									${data?.earnings}
								</FansText>
							</FansView>
						</View>
					)}
					<FansGap height={24} />
					<View style={tw.style("flex-row gap-[40px] items-center")}>
						{[
							{
								icon: (
									<FansView
										style={tw.style(
											"w-[21.69px] h-[21.69px]",
										)}
									>
										<ImageSvg color="white" />
									</FansView>
								),
								text: "Media",
								onPress: handlePressMedia,
							},
							{
								icon: (
									<FansView
										style={tw.style(
											"w-[20.88px] h-[20.88px]",
										)}
									>
										<OutlinedPinSvg
											color={tw.color("fans-white")}
										/>
									</FansView>
								),
								text: "Pinned",
								onPress: handlePressPinned,
							},
							{
								icon: (
									<FansView
										style={tw.style(
											"w-[20.46px] h-[20.46px]",
										)}
									>
										<Note2Svg
											color={tw.color("fans-white")}
										/>
									</FansView>
								),
								text: "Notes",
								onPress: handlePressNotes,
							},
						].map((item, index) => {
							const { icon, text, onPress } = item;
							return (
								<View
									key={text}
									style={tw.style("flex items-center")}
								>
									<FansView
										width={46}
										height={46}
										alignItems="center"
										backgroundColor="purple-a8"
										borderRadius="full"
										justifyContent="center"
									>
										<TouchableOpacity onPress={onPress}>
											{icon}
										</TouchableOpacity>
									</FansView>
									<FansGap height={8} />
									<FansText
										fontFamily="inter-medium"
										fontSize={16}
									>
										{text}
									</FansText>
								</View>
							);
						})}
					</View>
				</View>
				<FansGap height={19.5} />
				<FansDivider ver1 />
				<FansGap height={7.5} />
				{[
					{
						icon: (
							<FypSvg
								svg={AttachmentSvg}
								width={24.4}
								height={24.4}
								color="fans-black dark:fans-white"
							/>
						),
						text: "Copy profile link",
						onPress: async () => {
							if (data?.otherParticipant?.profileLink) {
								const url = createURL(
									`${data.otherParticipant.profileLink}`,
								);
								await copyString(url);
							}
						},
					},
					{
						icon: (
							<FypSvg
								svg={ListSvg}
								width={24.3}
								height={23}
								color="fans-black dark:fans-white"
							/>
						),
						text: "Add/remove from lists",
					},
					{
						icon: (
							<FypSvg
								svg={EyeHideSvg}
								width={25}
								height={21.45}
								color="fans-black dark:fans-white"
							/>
						),
						text: "Hide chat",
					},
					{
						icon: (
							<FypSvg
								svg={UnNotificationSvg}
								width={23.16}
								height={23.17}
								color="fans-black dark:fans-white"
							/>
						),
						text: "Mute notifications",
					},
					{
						icon: (
							<FansView
								style={tw.style("w-[24.29px] h-[24.29px]")}
							>
								<BlockSvg color="red" />
							</FansView>
						),
						text: "Block",
						textColor: "text-fans-red",
						onPress: handlePressBlock,
					},
					{
						icon: (
							<FansView style={tw.style("w-[25px] h-[22.57px]")}>
								<WarningSvg color="red" />
							</FansView>
						),
						text: "Report profile",
						textColor: "text-fans-red",
					},
				].map((item, index) => {
					const { icon, text, textColor, onPress } = item;
					return (
						<TouchableOpacity key={text} onPress={onPress}>
							<FansView
								key={text}
								style={tw.style(
									"h-[52px]",
									"flex-row gap-[20px] items-center",
								)}
							>
								{icon}
								<FansText
									style={tw.style("text-[18px]", textColor)}
								>
									{text}
								</FansText>
							</FansView>
						</TouchableOpacity>
					);
				})}
			</FansView>
		</FansSheet>
	);
};

export default ProfileSheet;
