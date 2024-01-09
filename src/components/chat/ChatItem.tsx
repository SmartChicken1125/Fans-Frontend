import {
	BlockSvg,
	ChevronDown2Svg,
	Close4Svg,
	CopySvg,
	ImageSvg,
	OutlinedPinSvg,
	ReplySvg,
	RobotSvg,
	Search1Svg,
	SearchSvg,
	ThreeDotsMenuSvg,
	WarningSvg,
	LockSvg,
} from "@assets/svgs/common";
import OnlineAvatar from "@components/avatar/OnlineAvatar";
import UserAvatar from "@components/avatar/UserAvatar";
import { MessageInput } from "@components/chat";
import ActionDialog from "@components/chat/common/dialogs/ActionDialog";
import ProfileSheet from "@components/chat/common/dialogs/ChatUserDlg";
import { FypSvg } from "@components/common/base";
import {
	FansButton3,
	FansEmoji,
	FansGap,
	FansImage,
	FansScreen2,
	FansSvg,
	FansText,
	FansTextInput3,
	FansView,
} from "@components/controls";
import { ImageTimestampModal } from "@components/modals";
import { SelectToneSheet } from "@components/sheet/chat";
import { useAppContext } from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { chatInboxAtom } from "@state/chat";
import { useMessageView } from "@state/messagesView";
import { Colors } from "@usertypes/enums";
import { ChatNativeStackParams } from "@usertypes/navigations";
import { IMessage, MessageType } from "@usertypes/types";
import { IUploadedFile } from "@utils/useUploadFile";
import { Stack, useRouter } from "expo-router";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
	Animated,
	Image,
	ScrollView,
	TouchableOpacity,
	View,
	VirtualizedList,
} from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
import { Menu } from "react-native-paper";
import { useRecoilValue } from "recoil";

const SelfMessage = ({ message }: { message: IMessage }) => (
	<View
		style={tw`bg-fans-purple self-end px-[15px] py-[8px] rounded-l-2xl rounded-tr-2xl max-w-full`}
	>
		<FansText color="white" fontSize={18}>
			{message.content}
		</FansText>
	</View>
);

const layoutForOneImage = [
	[tw`overflow-hidden w-full h-full bg-black rounded-2xl`],
];

const layoutForTwoImages = [
	[
		tw`overflow-hidden absolute w-[148px] h-full left-0 top-0 bg-black rounded-l-2xl`,
	],
	[
		tw`overflow-hidden absolute w-[148px] h-full right-0 top-0 bg-black rounded-r-2xl`,
	],
];

const layoutForThreeImages = [
	[
		tw`overflow-hidden absolute w-[148px] h-full left-0 top-0 bg-black rounded-l-2xl`,
	],
	[
		tw`overflow-hidden absolute w-[148px] h-[98px] right-0 top-0 bg-black rounded-r-2xl`,
	],
	[
		tw`overflow-hidden absolute w-[148px] h-[98px] right-0 bottom-0 bg-black rounded-r-2xl`,
	],
];

const layoutForFourImages = [
	[
		tw`overflow-hidden absolute w-[148px] h-[98px] left-0 top-0 bg-black rounded-tl-2xl`,
	],
	[
		tw`overflow-hidden absolute w-[148px] h-[98px] left-0 bottom-0 bg-black rounded-bl-2xl`,
	],
	[
		tw`overflow-hidden absolute w-[148px] h-[98px] right-0 top-0 bg-black rounded-tr-2xl`,
	],
	[
		tw`overflow-hidden absolute w-[148px] h-[98px] right-0 bottom-0 bg-black rounded-br-2xl`,
	],
];

function layoutFunction(length: number, index: number) {
	if (length === 1) return layoutForOneImage[index] ?? [];
	else if (length === 2) return layoutForTwoImages[index] ?? [];
	else if (length === 3) return layoutForThreeImages[index] ?? [];
	else if (length === 4) return layoutForFourImages[index] ?? [];
	return [];
}

const FromMessage = ({
	message,
	handleActivatedDoubleTapMessage,
	handleActivatedTapMessage,
}: {
	message: IMessage;
	handleActivatedDoubleTapMessage: () => void;
	handleActivatedTapMessage: () => void;
}) => {
	const doubleTapRef = useRef();
	const singleTapRef = useRef();

	return (
		<View style={tw`flex-row gap-2.5 self-start max-w-full`}>
			<UserAvatar size="34px" image={message.user.avatar ?? undefined} />
			<View style={tw`flex shrink`}>
				<TapGestureHandler
					ref={doubleTapRef}
					numberOfTaps={2}
					onActivated={handleActivatedDoubleTapMessage}
				>
					<TapGestureHandler
						ref={singleTapRef}
						waitFor={doubleTapRef}
						numberOfTaps={1}
						onActivated={handleActivatedTapMessage}
					>
						<View
							style={tw.style(
								"relative",
								message.emoji ? "mb-5" : undefined,
							)}
						>
							<View
								style={tw`bg-fans-grey px-[15px] py-[8px] rounded-r-2xl rounded-tl-2xl dark:bg-fans-grey-43`}
							>
								<FansText fontSize={18}>
									{message.content}
								</FansText>
							</View>
							{message.emoji && (
								<View
									style={tw.style(
										"absolute bottom-[-20px] left-[15px]",
										"bg-fans-grey dark:bg-fans-grey-43",
										"border-2 border-white rounded-full dark:border-fans-black-1d",
										"p-[6px]",
									)}
								>
									<FansEmoji
										size={14}
										emoji={message.emoji}
										style={tw.style("leading-[14px]")}
									/>
								</View>
							)}
						</View>
					</TapGestureHandler>
				</TapGestureHandler>
			</View>
		</View>
	);
};

const TipMessage = ({ message }: { message: IMessage }) => (
	<View
		style={tw.style(
			"bg-fans-purple",
			"self-end",
			"px-[50px] py-5",
			"rounded-[20px]",
			"justify-center",
			"items-center",
		)}
	>
		<UserAvatar image={message.user?.avatar ?? ""} size="34px" />
		<FansText
			color="white"
			fontSize={22}
			fontFamily="inter-bold"
			style={tw.style("mt-2.5")}
		>
			{message.user?.displayName} sent you a{" "}
			<Image
				source={require("@assets/images/gem.png")}
				style={tw.style("w-4 h-4 lg:w-5.5 lg:h-5.5 mr-2.5")}
			/>
			{message.value} tip!
		</FansText>
		<FansText color="white" fontSize={18} style={tw.style("mt-2.5")}>
			{message.content}
		</FansText>
	</View>
);

const SelfPaidPostMessage = ({
	message,
	onPressImage,
}: {
	message: IMessage;
	onPressImage: (data: IMessage, index: number) => void;
}) => {
	return (
		<View style={tw`flex-row gap-2.5 self-end`}>
			<View style={tw.style("flex")}>
				<View
					style={tw.style(
						"relative",
						message.emoji ? "mb-5" : undefined,
					)}
				>
					<View style={tw`bg-fans-grey rounded-2xl w-[400px]`}>
						<View style={tw.style("relative")}>
							<TouchableOpacity
								onPress={() => onPressImage(message, 0)}
							>
								<FansImage
									source={{
										uri:
											message.status === "Successful"
												? message.images![0]
												: message.previewImages![0],
									}}
									style={tw.style("h-[400px] rounded-t-2xl")}
									resizeMode="cover"
									blurRadius={3}
								/>
							</TouchableOpacity>

							<View
								style={tw.style(
									"absolute bottom-2.5 w-[100%] p-[15px]",
								)}
							>
								<View
									style={tw.style(
										"border border-fans-white rounded-[5px] p-[15px]",
									)}
								>
									<View
										style={tw.style(
											"flex flex-row items-center",
										)}
									>
										<BlockSvg size={16} color="white" />
										<FansText
											fontSize={16}
											color="white"
											style={tw.style("text-center ml-1")}
											fontFamily="inter-bold"
										>
											12
										</FansText>
										<FansText
											fontFamily="inter-bold"
											fontSize={16}
											color="white"
											style={tw.style(
												"text-center mr-2 ml-2",
											)}
										>
											·
										</FansText>
										<BlockSvg size={16} color="white" />
										<FansText
											fontSize={16}
											color="white"
											style={tw.style("text-center ml-1")}
											fontFamily="inter-bold"
										>
											9
										</FansText>
										<View style={tw.style("flex-grow")} />
										<BlockSvg size={16} color="white" />
										<FansText
											fontSize={16}
											color="white"
											style={tw.style("text-center ml-1")}
											fontFamily="inter-bold"
										>
											9
										</FansText>
									</View>
									<FansButton3
										height={40}
										onPress={() => {}}
										style={tw.style(
											"bg-fans-purple",
											"px-2.5",
											"mt-[15px]",
										)}
										title={
											message.status === "Successful"
												? "PURCHASED"
												: `NOT PURCHASED`
										}
										textStyle1={{
											fontFamily: "inter-bold",
											fontSize: 16,
										}}
									/>
								</View>
							</View>
						</View>
						<View>
							<FansText style={tw`p-[15px]`} fontSize={18}>
								{message.content}
							</FansText>
						</View>
					</View>
					{message.emoji && (
						<View
							style={tw.style(
								"absolute bottom-[-20px] left-[15px]",
								"bg-fans-grey",
								"border-2 border-white rounded-full",
								"p-[6px]",
							)}
						>
							<FansEmoji
								size={14}
								emoji={message.emoji}
								style={tw.style("leading-[14px]")}
							/>
						</View>
					)}
				</View>
			</View>
		</View>
	);
};

const FromPaidPostMessage = ({
	message,
	onPressImage,
}: {
	message: IMessage;
	onPressImage: (data: IMessage, index: number) => void;
}) => {
	return (
		<View style={tw.style("flex-row gap-2.5", "self-start")}>
			<UserAvatar size="34px" image={message.user.avatar ?? undefined} />
			<View style={tw.style("flex")}>
				<View
					style={tw.style(
						"relative",
						message.emoji ? "mb-5" : undefined,
					)}
				>
					<View style={tw`bg-fans-grey rounded-2xl w-[400px]`}>
						<View style={tw.style("relative")}>
							<TouchableOpacity
								onPress={() => onPressImage(message, 0)}
							>
								<FansImage
									source={{
										uri:
											message.status === "Successful"
												? message.images![0]
												: message.previewImages![0],
									}}
									style={tw.style("h-[400px] rounded-t-2xl")}
									resizeMode="cover"
								/>
							</TouchableOpacity>

							<View
								style={tw.style(
									"absolute bottom-2.5 w-[100%] flex justify-center items-center",
								)}
							>
								<View
									style={tw.style(
										"bg-[rgba(0,0,0,0.5)] rounded-[20px] px-2.5 py-[5px] flex flex-row items-center",
									)}
								>
									<BlockSvg size={12} color="white" />
									<FansText
										fontSize={12}
										color="white"
										style={tw.style("text-center ml-1")}
									>
										12
									</FansText>
									<FansText
										fontFamily="inter-bold"
										fontSize={12}
										color="white"
										style={tw.style(
											"text-center mr-2 ml-2",
										)}
									>
										·
									</FansText>
									<BlockSvg size={12} color="white" />
									<FansText
										fontSize={12}
										color="white"
										style={tw.style("text-center ml-1")}
									>
										9
									</FansText>
								</View>
							</View>
						</View>
						<View>
							<FansText
								style={tw.style("p-[15px]")}
								fontSize={18}
							>
								{message.content}
							</FansText>
						</View>
					</View>
					{message.emoji && (
						<View
							style={tw.style(
								"absolute bottom-[-20px] left-[15px]",
								"bg-fans-grey",
								"border-2 border-white rounded-full",
								"p-[6px]",
							)}
						>
							<FansEmoji
								size={14}
								emoji={message.emoji}
								style={tw.style("leading-[14px]")}
							/>
						</View>
					)}
				</View>
			</View>
		</View>
	);
};

const ImageMessage = ({
	message,
	isSelf,
	onPressImage,
}: {
	message: IMessage;
	isSelf: boolean;
	onPressImage: (data: IMessage, index: number) => void;
}) => {
	return (
		<View style={tw.style(isSelf ? "self-end" : "", "flex-row gap-2.5")}>
			{!isSelf && (
				<UserAvatar
					size="34px"
					image={message.user.avatar ?? undefined}
				/>
			)}
			<View style={tw`relative w-[300px] h-[200px]`}>
				{message.images?.map((image: string, index: number) => (
					<TouchableOpacity
						key={index}
						activeOpacity={1}
						onPress={() => onPressImage(message, index)}
						style={layoutFunction(message.images!.length, index)}
					>
						<FansImage
							source={{ uri: cdnURL(image) }}
							resizeMode="cover"
						/>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
};

const FromNotPaidPostMessage = ({
	message,
	onPressImage,
}: {
	message: IMessage;
	onPressImage: (data: IMessage, index: number) => void;
}) => {
	return (
		<View style={tw.style("flex-row gap-2.5", "self-start")}>
			<UserAvatar size="34px" image={message.user.avatar ?? undefined} />
			<View style={tw.style("flex")}>
				<View
					style={tw.style(
						"relative",
						message.emoji ? "mb-5" : undefined,
					)}
				>
					<View
						style={tw`bg-fans-grey rounded-2xl w-[400px] dark:bg-fans-grey-43`}
					>
						<View style={tw.style("relative")}>
							<TouchableOpacity
								onPress={() => onPressImage(message, 0)}
							>
								<FansImage
									source={{
										uri:
											message.status === "Successful"
												? message.images![0]
												: message.previewImages![0],
									}}
									style={tw.style("h-[400px] rounded-t-2xl")}
									resizeMode="cover"
									blurRadius={3}
								/>
							</TouchableOpacity>
							<View
								style={tw.style(
									"absolute top-1/3 left-1/2 w-[60px] h-[60px] justify-center items-center",
									{
										transform: [
											{ translateX: -30 },
											{ translateY: -30 },
										],
										borderRadius: 30,
									},
								)}
							>
								<LockSvg
									color="white"
									width={64}
									height={64}
									style={tw.style("opacity-50")}
								/>
							</View>

							<View
								style={tw.style(
									"absolute top-1/3 left-1/2 w-[60px] h-[60px] justify-center items-center",
									{
										transform: [
											{ translateX: -30 },
											{ translateY: -30 },
										],
										borderRadius: 30,
									},
								)}
							>
								<FansText
									color="white"
									fontSize={18}
									fontFamily="inter-bold"
									style={tw.style("mt-5")}
								>
									${message.value}
								</FansText>
							</View>

							<View
								style={tw.style(
									"absolute bottom-2.5 w-[100%] p-[15px]",
								)}
							>
								<View
									style={tw.style(
										"border border-fans-white rounded-[5px] p-[15px]",
									)}
								>
									<View
										style={tw.style(
											"flex flex-row items-center",
										)}
									>
										<BlockSvg size={16} color="white" />
										<FansText
											fontSize={16}
											color="white"
											style={tw.style("text-center ml-1")}
											fontFamily="inter-bold"
										>
											12
										</FansText>
										<FansText
											fontFamily="inter-bold"
											fontSize={16}
											color="white"
											style={tw.style(
												"text-center mr-2 ml-2",
											)}
										>
											·
										</FansText>
										<BlockSvg size={16} color="white" />
										<FansText
											fontSize={16}
											color="white"
											style={tw.style("text-center ml-1")}
											fontFamily="inter-bold"
										>
											9
										</FansText>
										<View style={tw.style("flex-grow")} />
										<BlockSvg size={16} color="white" />
										<FansText
											fontSize={16}
											color="white"
											style={tw.style("text-center ml-1")}
											fontFamily="inter-bold"
										>
											9
										</FansText>
									</View>
									<FansButton3
										height={40}
										onPress={() => {}}
										style={tw.style(
											"bg-fans-purple",
											"px-2.5",
											"mt-[15px]",
										)}
										title={`UNLOCK FOR $${message.value}`}
										textStyle1={{
											fontFamily: "inter-bold",
											fontSize: 16,
										}}
									/>
								</View>
							</View>
						</View>
						<View>
							<FansText
								style={tw.style("p-[15px]")}
								fontSize={18}
							>
								{message.content}
							</FansText>
						</View>
					</View>
					{message.emoji && (
						<View
							style={tw.style(
								"absolute bottom-[-20px] left-[15px]",
								"bg-fans-grey",
								"border-2 border-white rounded-full",
								"p-[6px]",
							)}
						>
							<FansEmoji
								size={14}
								emoji={message.emoji}
								style={tw.style("leading-[14px]")}
							/>
						</View>
					)}
				</View>
			</View>
		</View>
	);
};

const ChatItem = ({
	message,
	isSelf,
	animatedValue,
	handleActivatedDoubleTapMessage,
	handleActivatedTapMessage,
	onPressImage,
}: {
	message: IMessage;
	isSelf: boolean;
	animatedValue: Animated.Value;
	handleActivatedDoubleTapMessage: () => void;
	handleActivatedTapMessage: () => void;
	onPressImage: (data: IMessage, index: number) => void;
}) => {
	return (
		<Animated.View style={[tw.style("my-[4px]")]}>
			{message.messageType === MessageType.TEXT &&
				(isSelf ? (
					<SelfMessage message={message} />
				) : (
					<FromMessage
						message={message}
						handleActivatedDoubleTapMessage={
							handleActivatedDoubleTapMessage
						}
						handleActivatedTapMessage={handleActivatedTapMessage}
					/>
				))}
			{message.messageType === MessageType.IMAGE && (
				<ImageMessage
					message={message}
					isSelf={isSelf}
					onPressImage={onPressImage}
				/>
			)}
			{message.messageType === MessageType.TIP && (
				<TipMessage message={message} />
			)}
			{message.messageType === MessageType.PAID_POST &&
				(isSelf ? (
					<SelfPaidPostMessage
						message={message}
						onPressImage={onPressImage}
					/>
				) : message.status === "Successful" ? (
					<FromPaidPostMessage
						message={message}
						onPressImage={onPressImage}
					/>
				) : (
					<FromNotPaidPostMessage
						message={message}
						onPressImage={onPressImage}
					/>
				))}
		</Animated.View>
	);
};

export default ChatItem;
