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
	Record1Svg,
} from "@assets/svgs/common";
import OnlineAvatar from "@components/avatar/OnlineAvatar";
import UserAvatar from "@components/avatar/UserAvatar";
import { MessageInput } from "@components/chat";
import ActionDialog from "@components/chat/common/dialogs/ActionDialog";
import ProfileSheet from "@components/chat/common/dialogs/ChatUserDlg";
import {
	JoinVideoCallModal,
	VideoCallModal,
} from "@components/chat/videoCalls";
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
import { useFeatureGates } from "@state/featureGates";
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
	Pressable,
	ScrollView,
	TouchableOpacity,
	View,
	VirtualizedList,
} from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
import { Menu } from "react-native-paper";
import { useRecoilValue } from "recoil";

const MessageMenu = () => {
	const [open, setOpen] = useState(false);

	return (
		<Menu
			visible={open}
			anchor={
				<View style={tw.style("h-[1px]")}>
					<FansText> </FansText>
				</View>
			}
			anchorPosition="bottom"
			contentStyle={tw.style(
				"bg-white",
				"flex gap-5",
				"px-5 py-[12px]",
				"rounded-[21px]",
			)}
			onDismiss={() => setOpen(false)}
		>
			<>
				<View style={tw.style("flex-row gap-[15px] items-center")}>
					<ReplySvg size={25} />
					<FansText>Reply</FansText>
				</View>
				<View style={tw.style("flex-row gap-[15px] items-center")}>
					<CopySvg size={25} />
					<FansText>Copy</FansText>
				</View>
				<View style={tw.style("flex-row gap-[15px] items-center")}>
					<View style={tw.style("p-[2px]")}>
						<OutlinedPinSvg size={21} />
					</View>
					<FansText>Pin</FansText>
				</View>
				<View style={tw.style("flex-row gap-[15px] items-center")}>
					<View style={tw.style("p-[1px]")}>
						<BlockSvg size={23} />
					</View>
					<FansText>Unsend 300s</FansText>
				</View>
				<View style={tw.style("flex-row gap-[15px] items-center")}>
					<View style={tw.style("p-[1px]")}>
						<WarningSvg size={23} color={Colors.Red} />
					</View>
					<FansText>Report</FansText>
				</View>
			</>
		</Menu>
	);
};

const ReactionMenu = () => {
	const [open, setOpen] = useState(false);

	return (
		<Menu
			visible={open}
			anchor={
				<View style={tw.style("h-[1px]")}>
					<FansText></FansText>
				</View>
			}
			anchorPosition="top"
			contentStyle={[
				tw.style(
					"bg-white",
					"flex-row gap-[5px]",
					"px-5 py-[12px]",
					"rounded-full",
					"top-[-60px]",
				),
			]}
			onDismiss={() => setOpen(false)}
		>
			<>
				{Array.from(Array(6)).map((_, index) => (
					<TouchableOpacity
						key={index}
						// onPress={() => handlePressEmoji(index + 1)}
					>
						<FansEmoji
							size={24}
							emoji={index + 1}
							style={tw.style("leading-[24px]")}
						/>
					</TouchableOpacity>
				))}
			</>
		</Menu>
	);
};

const SelfMessage = ({ message }: { message: IMessage }) => (
	<View
		style={tw`bg-fans-purple self-end px-[15px] py-[8px] rounded-l-2xl rounded-tr-2xl max-w-full md:max-w-[80%]`}
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
		<View style={tw`flex-row gap-2.5 self-start max-w-full md:max-w-[80%]`}>
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

const ChatGPTBar = (props: {
	isCustomMode: boolean;
	handlePressSayYes: () => void;
	handlePressSayNo: () => void;
	handlePressCustom: () => void;
	handlePressTone: () => void;
	handlePressCloseCustom: () => void;
	handlePressWrite: (text: string) => void;
}) => {
	const {
		isCustomMode,
		handlePressSayYes,
		handlePressSayNo,
		handlePressCustom,
		handlePressTone,
		handlePressCloseCustom,
		handlePressWrite,
	} = props;
	const [customPrompt, setCustomPrompt] = useState("");

	return (
		<FansView width="full" bottom={8} position="absolute">
			{!isCustomMode ? (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={tw.style("items-center")}
				>
					<FansSvg width={22.85} height={14.28} svg={RobotSvg} />
					<FansGap width={8.2} />
					<FansView
						height={34}
						style={tw.style("p-[17px]")}
						alignItems="center"
						backgroundColor="purple"
						borderRadius="full"
						justifyContent="center"
					>
						<FansText color="white" fontSize={17}>
							GPT respond
						</FansText>
					</FansView>
					<FansGap width={7} />
					<TouchableOpacity onPress={handlePressSayYes}>
						<FansView
							height={34}
							style={tw.style("p-[17px]")}
							alignItems="center"
							backgroundColor="grey"
							borderRadius="full"
							justifyContent="center"
						>
							<FansText fontSize={17}>Say Yes</FansText>
						</FansView>
					</TouchableOpacity>
					<FansGap width={7} />
					<TouchableOpacity onPress={handlePressSayNo}>
						<FansView
							height={34}
							style={tw.style("p-[17px]")}
							alignItems="center"
							backgroundColor="grey"
							borderRadius="full"
							justifyContent="center"
						>
							<FansText fontSize={17}>Say No</FansText>
						</FansView>
					</TouchableOpacity>
					<FansGap width={7} />
					<TouchableOpacity onPress={handlePressCustom}>
						<FansView
							height={34}
							style={tw.style("p-[17px]")}
							alignItems="center"
							backgroundColor="grey"
							borderRadius="full"
							justifyContent="center"
						>
							<FansText fontSize={17}>Custom</FansText>
						</FansView>
					</TouchableOpacity>
					<FansGap width={7} />
					<TouchableOpacity onPress={handlePressTone}>
						<FansView
							height={34}
							style={tw.style("px-2.5")}
							alignItems="center"
							backgroundColor="grey"
							borderRadius="full"
							flexDirection="row"
							justifyContent="center"
						>
							<FansText fontSize={24}>😍</FansText>
							<FansSvg
								width={9.31}
								height={4.66}
								svg={ChevronDown2Svg}
								color1="grey-70"
							/>
						</FansView>
					</TouchableOpacity>
				</ScrollView>
			) : (
				<FansView flexDirection="row" gap={7}>
					<FansView
						alignItems="center"
						flexDirection="row"
						grow
						position="relative"
					>
						<FansTextInput3
							height={34}
							value={customPrompt}
							grow
							placeholder="Enter instructions for AI"
							onChangeText={setCustomPrompt}
						/>
						<FansView
							position="absolute"
							style={tw.style("right-[14.2px]")}
						>
							<TouchableOpacity onPress={handlePressCloseCustom}>
								<FansSvg
									width={9.33}
									height={9.33}
									svg={Close4Svg}
									color1="grey-70"
								/>
							</TouchableOpacity>
						</FansView>
					</FansView>
					<FansButton3
						height={34}
						title="Write"
						onPress={() => handlePressWrite(customPrompt)}
						textStyle1={{ fontSize: 17 }}
					/>
				</FansView>
			)}
		</FansView>
	);
};

const ChatScreen = (
	props: NativeStackScreenProps<ChatNativeStackParams, "Chat">,
) => {
	const { navigation } = props;

	const handleSubmitChatUserSheet = (value: string) => {
		switch (value) {
			case "Media":
				navigation.navigate("Gallery");
				break;
			case "Pinned":
				navigation.navigate("PinnedMessages");
				break;
			case "Notes":
				navigation.navigate("Notes");
				break;
		}
	};

	const { state } = useAppContext();
	const featureGates = useFeatureGates();
	const animatedValue = useRef(new Animated.Value(0)).current;
	const listMessages = useRef<VirtualizedList<IMessage> | null>(null);

	const [isCustomMode, setCustomMode] = useState(false);
	const [isSearch, setSearch] = useState(false);
	const [isSelectToneSheetVisible, setSelectToneSheetVisible] =
		useState(false);
	const [imageViewModalData, setImageViewModalData] = useState<
		{ data: IMessage; index: number } | undefined
	>();

	const inbox = useRecoilValue(chatInboxAtom);
	const id = props.route.params?.id ?? "0";
	const conversation = inbox.data.get(id);
	const messagesView = useMessageView(id);

	const [openActionDialog, setOpenActionDialog] = useState(false);
	const [isProfileSheetVisible, setProfileSheetVisible] = useState(false);
	const [searchKey, setSearchKey] = useState("");
	const [selectedGPT, setSelectedGPT] = useState(0);
	const [length, setLength] = useState(1000);
	const router = useRouter();

	const [openVideoCallJoinModal, setOpenVideoCallJobinModal] =
		useState(false);
	const [openVideoCallModal, setOpenVideoCallModal] = useState(false);

	useEffect(() => {
		messagesView.initIfNeeded();
	}, [messagesView]);

	const handleCloseActionDialog = () => {
		setOpenActionDialog(false);
	};

	const handleCloseImageTimestampModal = () => {
		setImageViewModalData(undefined);
	};

	const handleCloseSelectToneSheet = () => setSelectToneSheetVisible(false);

	const handleSend = async (
		message: string,
		uploadedFiles: IUploadedFile[],
	) => {
		if (uploadedFiles.length > 0) {
			await messagesView?.sendImageMessage(uploadedFiles);
		}
		if (message.length !== 0) {
			await messagesView?.sendTextMessage(message);
		}

		animatedValue.setValue(37);
		Animated.timing(animatedValue, {
			toValue: 0,
			duration: 400,
			useNativeDriver: true,
		}).start();
	};

	const handleStartReached = () => {
		messagesView?.scrolledToBottom();
	};

	const handleEndReached = () => {
		messagesView?.scrolledToTop();
	};

	const handlePressCloseCustom = () => setCustomMode(false);

	const handlePressCustom = () => setCustomMode(true);

	const handlePressImage = (data: IMessage, index: number) => {
		console.log("handlePressImage", data, index);
		setImageViewModalData({ data, index });
	};

	const handlePressSayNo = () => {}; //handleSend("No");

	const handlePressSayYes = () => {}; //handleSend("Yes");

	const handlePressTone = () => setSelectToneSheetVisible(true);

	const handlePressWrite = () => {}; //handleSend(strCustom);

	const handleSubmitSelectToneSheet = () => {}; //(value: string) => handleSend(value);

	if (!conversation) {
		return <FansScreen2 contentStyle={tw.style("pt-[0px]")}></FansScreen2>;
	}

	const isSameDay = (date1: Date, date2: Date) => {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	};

	const getDateLabel = (dateString: string) => {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		const date = new Date(dateString);

		if (isSameDay(date, today)) {
			return "TODAY";
		} else if (isSameDay(date, yesterday)) {
			return "YESTERDAY";
		} else {
			return date.toLocaleDateString(undefined, {
				month: "long",
				day: "numeric",
				year: "numeric",
			});
		}
	};

	const renderItem = ({ item, index }: { item: IMessage; index: number }) => {
		const messages = messagesView?.messages ?? [];
		const reversedMessages = [...messages].reverse();

		let isEndOfCurrentDay = false;
		if (index === reversedMessages.length - 1) {
			isEndOfCurrentDay = true;
		} else {
			const currentMessageDate = new Date(item.createdAt);
			const nextMessageDate = new Date(
				reversedMessages[index + 1].createdAt,
			);
			isEndOfCurrentDay = !isSameDay(currentMessageDate, nextMessageDate);
		}

		return (
			<>
				<ChatItem
					isSelf={item.user.id === state.user.userInfo.id}
					message={item}
					animatedValue={animatedValue}
					handleActivatedDoubleTapMessage={() => {}}
					handleActivatedTapMessage={() => {}}
					onPressImage={handlePressImage}
				/>
				{isEndOfCurrentDay && (
					<View style={tw.style("flex-row", "items-center", "my-2")}>
						<View
							style={tw.style(
								"flex-1",
								"border-b",
								"border-gray-300",
							)}
						/>
						<FansText
							style={tw.style(
								"mx-2",
								"text-center",
								"text-gray-500",
							)}
						>
							{getDateLabel(item.createdAt)}
						</FansText>
						<View
							style={tw.style(
								"flex-1",
								"border-b",
								"border-gray-300",
							)}
						/>
					</View>
				)}
			</>
		);
	};

	return (
		<FansScreen2 contentStyle={tw.style("pt-[0px]")}>
			<Stack.Screen
				options={{
					headerShown: !isSearch,
					headerTitleAlign: "left",
					headerTitle: (props) => (
						<Pressable
							onPress={() => {
								const profileLink =
									state.profile.profileLink ||
									conversation.otherParticipant?.profileLink;
								if (profileLink) {
									router.push(`/${profileLink}`);
								}
							}}
						>
							<View
								{...props}
								style={tw.style(
									"flex-row gap-2.5 items-center",
								)}
							>
								<View style={tw.style("relative")}>
									<OnlineAvatar
										size="34px"
										image={conversation.icon || undefined}
									/>
									<View
										style={tw.style(
											"w-[11px] h-[11px]",
											"absolute right-0 bottom-0",
											"bg-fans-green",
											"border-[2px] border-white rounded-full dark:border-fans-black-1d",
										)}
									/>
								</View>
								<FansText
									fontFamily="inter-semibold"
									fontSize={16}
								>
									{conversation.name}
								</FansText>
							</View>
						</Pressable>
					),
					headerRight: () => (
						<View style={tw.style("flex-row gap-1 justify-end")}>
							{featureGates.has("2023_12-video-call") && (
								<TouchableOpacity
									style={tw.style(
										"flex justify-center items-center w-8 h-8",
									)}
									onPress={() =>
										setOpenVideoCallJobinModal(true)
									}
								>
									<FypSvg
										svg={Record1Svg}
										width={23}
										height={16}
										color="fans-black dark:fans-white"
									/>
								</TouchableOpacity>
							)}

							<TouchableOpacity
								style={tw.style(
									"flex justify-center items-center w-8 h-8",
								)}
								onPress={() => navigation.navigate("Gallery")}
							>
								<FypSvg
									svg={ImageSvg}
									width={17}
									height={17}
									color="fans-black dark:fans-white"
								/>
							</TouchableOpacity>
							{/* <TouchableOpacity
								style={tw.style(
									"flex justify-center items-center w-8 h-8",
								)}
								onPress={() =>
									navigation.navigate("FanAnalysis")
								}
							>
								<FansView style={tw.style("w-[17px] h-[17px]")}>
									<Note1Svg />
								</FansView>
							</TouchableOpacity> */}
							<TouchableOpacity
								style={tw.style(
									"flex justify-center items-center w-8 h-8",
								)}
								onPress={() => setSearch(true)}
							>
								<FypSvg
									svg={SearchSvg}
									width={17}
									height={17}
									color="fans-black dark:fans-white"
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={tw.style(
									"flex justify-center items-center w-8 h-8",
								)}
								onPress={() => setProfileSheetVisible(true)}
							>
								<FypSvg
									svg={ThreeDotsMenuSvg}
									width={17}
									height={17}
									color="fans-black dark:fans-white"
								/>
							</TouchableOpacity>
						</View>
					),
				}}
			/>
			{isSearch && (
				<Fragment>
					<FansView
						alignItems="center"
						flexDirection="row"
						gap={10}
						padding={{ t: 10 }}
					>
						<FansTextInput3
							grow
							iconNode={
								<FypSvg
									width={13.14}
									height={13.26}
									svg={Search1Svg}
									color="fans-black dark:fans-white"
								/>
							}
							placeholder="Search in chat"
							value={searchKey}
							onChangeText={setSearchKey}
						/>
						<TouchableOpacity onPress={() => setSearch(false)}>
							<FansText fontSize={19}>Cancel</FansText>
						</TouchableOpacity>
					</FansView>
					<FansGap height={20} />
				</Fragment>
			)}
			<FansView height={0} grow>
				<VirtualizedList
					ref={listMessages}
					keyExtractor={(item) => item.id}
					renderItem={renderItem}
					style={tw.style("pt-5")}
					data={[...(messagesView?.messages ?? [])].reverse()}
					getItem={(data, index) => data[index]}
					getItemCount={(data) => data.length}
					inverted
					showsVerticalScrollIndicator={false}
					onStartReached={handleStartReached}
					onStartReachedThreshold={0.1}
					onEndReached={handleEndReached}
					onEndReachedThreshold={0.1}
				/>
			</FansView>
			{/*<ReactNativeReanimated.default.ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "flex-end",
				}}
				ref={aref}
			>
				<View style={tw.style("flex gap-2.5")}>
					{[...Array(countMessages)].map((_, index) => {
						if (index % 5 === 0)
							return (
								<View>
									<Text
										style={tw.style(
											"text-fans-grey-dark text-center",
										)}
									>
										TODAY
									</Text>
								</View>
							);
						if (index % 5 === 1)
							return (
							);
						if (index % 5 === 2)
							return (
								<View
									style={tw.style(
										"flex-row gap-[5px] items-center",
										"self-end",
									)}
								>
									<Text
										style={tw.style("text-fans-grey-dark")}
									>
										Seen
									</Text>
									<DoubleCheckSvg
										color={"#A854F5"}
										size={16}
									/>
								</View>
							);
					})}
				</View>
				</ReactNativeReanimated.default.ScrollView>*/}
			<MessageInput
				onSend={handleSend}
				creator={conversation.otherParticipant}
			/>
			<FansGap height={{ lg: 47 }} />
			<ProfileSheet
				data={conversation}
				visible={isProfileSheetVisible}
				onClose={() => setProfileSheetVisible(false)}
				onSubmit={handleSubmitChatUserSheet}
			/>
			<ActionDialog
				open={openActionDialog}
				onClose={handleCloseActionDialog}
				onSubmit={() => {}}
			/>
			<ImageTimestampModal
				visible={imageViewModalData !== undefined}
				data={imageViewModalData?.data}
				selectedImageIndex={imageViewModalData?.index ?? 0}
				onClose={handleCloseImageTimestampModal}
				onSubmit={() => {}}
			/>
			<SelectToneSheet
				visible={isSelectToneSheetVisible}
				onClose={handleCloseSelectToneSheet}
				onSubmit={handleSubmitSelectToneSheet}
			/>

			<JoinVideoCallModal
				visible={openVideoCallJoinModal}
				handleClose={() => setOpenVideoCallJobinModal(false)}
				handleJoinVideoCall={() => {
					setOpenVideoCallJobinModal(false);
					setOpenVideoCallModal(true);
				}}
			/>
			<VideoCallModal
				visible={openVideoCallModal}
				handleClose={() => setOpenVideoCallModal(false)}
			/>
		</FansScreen2>
	);
};

export default ChatScreen;
