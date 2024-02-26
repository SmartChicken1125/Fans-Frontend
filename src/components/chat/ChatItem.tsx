import {
	BlockSvg,
	Calendar1Svg,
	Check1Svg,
	Clock1Svg,
	Dollar1Svg,
	LockSvg,
	PlaySvg,
	ReplyArrowSvg,
} from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import { FypSvg } from "@components/common/base/svg";
import {
	FansButton3,
	FansEmoji,
	FansImage,
	FansText,
} from "@components/controls";
import { cdnURL, urlOrBlurHash } from "@helper/Utils";
import tw from "@lib/tailwind";
import { MediaType } from "@usertypes/commonEnums";
import { IMedia, IMessage, MessageType } from "@usertypes/types";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import { Animated, Image, TouchableOpacity, View } from "react-native";
import { TapGestureHandler } from "react-native-gesture-handler";
import { MessageOptionsMenu } from "./MessageOptionsMenu";

const SelfMessage = ({
	message,
	onDeleteMessage,
	onReplyMessage,
	onReportMessage,
}: {
	message: IMessage;
	onDeleteMessage: (message: IMessage) => void;
	onReplyMessage: (message: IMessage) => void;
	onReportMessage: (message: IMessage) => void;
}) => (
	<View
		style={tw`flex-row items-center self-end max-w-full md:max-w-[80%] ${
			message.parentMessage ? "mt-[40px]" : ""
		}`}
	>
		<View style={tw`flex-1 min-w-0`}>
			<View style={tw`flex-row justify-end items-center gap-2.5`}>
				<MessageOptionsMenu
					message={message}
					onDeleteMessage={onDeleteMessage}
					onReplyMessage={onReplyMessage}
					onReportMessage={onReportMessage}
					isSelf
				/>
				{message.parentMessage && (
					<View
						style={tw.style(
							"flex-row items-center gap-2.5 max-w-full md:max-w-[80%] absolute top-[-40px] right-0 justify-end",
						)}
					>
						<UserAvatar
							size="24px"
							image={message.user.avatar ?? undefined}
						/>
						<View style={tw.style("relative")}>
							<View style={tw`px-[5px] py-[8px]`}>
								<FansText fontSize={16}>
									{message.parentMessage.content}
								</FansText>
							</View>
						</View>
						<FypSvg
							svg={ReplyArrowSvg}
							width={17}
							height={17}
							color="fans-black dark:fans-white"
							style={{ transform: "rotate(180deg) scaleY(-1)" }}
						/>
					</View>
				)}
				<View
					style={tw`bg-fans-purple px-[15px] py-[8px] rounded-l-2xl rounded-tr-2xl max-w-full overflow-hidden`}
				>
					<FansText color="white" fontSize={18} style={tw`truncate`}>
						{message.content}
					</FansText>
				</View>
			</View>
		</View>
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
	onDeleteMessage,
	onReplyMessage,
	onReportMessage,
}: {
	message: IMessage;
	handleActivatedDoubleTapMessage: () => void;
	handleActivatedTapMessage: () => void;
	onDeleteMessage: (message: IMessage) => void;
	onReplyMessage: (message: IMessage) => void;
	onReportMessage: (message: IMessage) => void;
}) => {
	const doubleTapRef = useRef();
	const singleTapRef = useRef();

	return (
		<View
			style={tw`flex-row items-center gap-2.5 self-start max-w-full md:max-w-[80%] ${
				message.parentMessage ? "mt-[40px]" : ""
			}`}
		>
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
							{message.parentMessage && (
								<View
									style={tw.style(
										"flex-row items-center gap-2.5 max-w-full md:max-w-[80%] absolute top-[-40px]",
									)}
								>
									<FypSvg
										svg={ReplyArrowSvg}
										width={17}
										height={17}
										color="fans-black dark:fans-white"
									/>
									<View style={tw.style("relative")}>
										<View style={tw`px-[5px] py-[8px]`}>
											<FansText fontSize={16}>
												{message.parentMessage.content}
											</FansText>
										</View>
									</View>
								</View>
							)}
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
			<MessageOptionsMenu
				message={message}
				onDeleteMessage={onDeleteMessage}
				onReplyMessage={onReplyMessage}
				onReportMessage={onReportMessage}
			/>
		</View>
	);
};

const FromNotPaidPostMessage = ({
	message,
	onPressImage,
	onPurchasePost,
}: {
	message: IMessage;
	onPressImage: (data: IMessage, index: number) => void;
	onPurchasePost: (message: IMessage) => void;
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
												? urlOrBlurHash(
														message.media?.[0]?.url,
														message.media?.[0]
															?.blurhash,
												  )
												: urlOrBlurHash(
														message
															.previewMedia?.[0]
															?.url,
														message
															.previewMedia?.[0]
															?.blurhash,
												  ),
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
											{
												message.media?.filter(
													(m) =>
														m.type ===
														MediaType.Image,
												).length
											}
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
											{
												message.media?.filter(
													(m) =>
														m.type ===
														MediaType.Video,
												).length
											}
										</FansText>
										<View style={tw.style("flex-grow")} />
										<BlockSvg size={16} color="white" />
										<FansText
											fontSize={16}
											color="white"
											style={tw.style("text-center ml-1")}
											fontFamily="inter-bold"
										>
											{message.media?.length}
										</FansText>
									</View>
									<FansButton3
										height={40}
										onPress={() => onPurchasePost(message)}
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
												? urlOrBlurHash(
														message.media?.[0]?.url,
														message.media?.[0]
															?.blurhash,
												  )
												: urlOrBlurHash(
														message
															.previewMedia?.[0]
															?.url,
														message
															.previewMedia?.[0]
															?.blurhash,
												  ),
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
										{
											message.media?.filter(
												(m) =>
													m.type === MediaType.Image,
											).length
										}
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
										{
											message.media?.filter(
												(m) =>
													m.type === MediaType.Video,
											).length
										}
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
												? urlOrBlurHash(
														message.media?.[0]?.url,
														message.media?.[0]
															?.blurhash,
												  )
												: urlOrBlurHash(
														message
															.previewMedia?.[0]
															?.url,
														message
															.previewMedia?.[0]
															?.blurhash,
												  ),
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
											{
												message.media?.filter(
													(m) =>
														m.type ===
														MediaType.Image,
												).length
											}
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
											{
												message.media?.filter(
													(m) =>
														m.type ===
														MediaType.Video,
												).length
											}
										</FansText>
										<View style={tw.style("flex-grow")} />
										<BlockSvg size={16} color="white" />
										<FansText
											fontSize={16}
											color="white"
											style={tw.style("text-center ml-1")}
											fontFamily="inter-bold"
										>
											{message.media?.length}
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
						{message.content && (
							<View>
								<FansText style={tw`p-[15px]`} fontSize={18}>
									{message.content}
								</FansText>
							</View>
						)}
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

const MediaMessage = ({
	message,
	isSelf,
	onPressMedia,
}: {
	message: IMessage;
	isSelf: boolean;
	onPressMedia: (data: IMessage, index: number) => void;
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
				{message.media?.map((media: IMedia, index: number) => (
					<TouchableOpacity
						key={index}
						activeOpacity={1}
						onPress={() => onPressMedia(message, index)}
						style={layoutFunction(message.media!.length, index)}
					>
						<FansImage
							source={{
								uri: urlOrBlurHash(
									cdnURL(
										media.type === MediaType.Video
											? media.thumbnail
											: media.url,
									),
									media.blurhash,
								),
							}}
							resizeMode="cover"
						/>
						{media.type === MediaType.Video && (
							<View
								style={{
									filter: "drop-shadow(0 5px 7px rgba(0,0,0,0.5))",
									position: "absolute",
									left: 0,
									right: 0,
									top: 0,
									bottom: 0,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<FypSvg
									width={27}
									height={27}
									color="fans-white"
									svg={PlaySvg}
								/>
							</View>
						)}
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

const SelfVideoCallNotificationMessage = ({
	message,
	onBookAgain,
	onCancelVideoCall,
}: {
	message: IMessage;
	onBookAgain: () => void;
	onCancelVideoCall: (message: IMessage) => void;
}) => {
	const status = message.videoCallNotification?.status ?? "Pending";

	const gradientColors = {
		Pending: ["#d885ff", "#a854f5", "#1d21e5"],
		Accepted: ["#24a2ff", "#23c9b1", "#89f276"],
		Cancelled: ["#eb2121", "#e53ec6", "#f98c28"],
		Declined: ["#eb2121", "#e53ec6", "#f98c28"],
	};

	const titles = {
		Pending: "AWAITING ACCEPTANCE",
		Accepted: "ACCEPTED",
		Cancelled: "CANCELLED",
		Delined: "DECLINED",
	};

	const subtitle = {
		Pending: `You've booked \n a video call`,
		Accepted: `You've booked \n a video call`,
		Cancelled: `Video call \n was cancelled`,
		Declined: `Video call \n was declined`,
	};

	return (
		<View style={tw`flex-row gap-2.5 self-end`}>
			<View style={tw`justify-center items-center`}>
				<LinearGradient
					colors={gradientColors[status]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					style={tw`rounded-2xl p-1`}
				>
					<View style={tw`w-[300px]`}>
						<View
							style={tw`py-1 px-1 mb-1 rounded-t-2xl bg-transparent items-center justify-center flex-row`}
						>
							<FypSvg
								svg={Check1Svg}
								width={20}
								height={20}
								color="white"
							/>
							<FansText
								style={tw`ml-2 font-bold`}
								fontFamily="inter-bold"
								fontSize={16}
								color="white"
							>
								{titles[status]}
							</FansText>
						</View>
					</View>
					<View
						style={tw`p-5 bg-white rounded-2xl justify-center items-center w-[300px]`}
					>
						<UserAvatar
							size="76px"
							image={message.user.avatar ?? undefined}
						/>
						<FansText
							style={tw`text-center mt-4 mb-4 font-bold`}
							fontSize={18}
							fontFamily="inter-bold"
						>
							{subtitle[status]}
						</FansText>
						<View style={tw`mt-5 w-full`}>
							<View style={tw`mb-2.5 flex-row items-center`}>
								<FypSvg
									svg={Calendar1Svg}
									width={16}
									height={16}
									color="fans-purple"
								/>
								<FansText
									style={tw`ml-3.375 font-semibold`}
									fontFamily="inter-semibold"
									fontSize={16}
									color="black"
								>
									Date:
								</FansText>
								<FansText
									style={tw`ml-2`}
									fontFamily="inter-regular"
									fontSize={16}
									color="grey-48"
								>
									{message.videoCallNotification?.date}
								</FansText>
							</View>
							<View style={tw`mt-2 mb-2 w-full`}>
								<View
									style={tw`h-[1px] bg-fans-grey w-full`}
								></View>
							</View>
							<View style={tw`mb-2.5 flex-row items-center`}>
								<FypSvg
									svg={Clock1Svg}
									width={16}
									height={16}
									color="fans-purple"
								/>
								<FansText
									style={tw`ml-3.375 font-semibold`}
									fontFamily="inter-semibold"
									fontSize={16}
									color="black"
								>
									Time:
								</FansText>
								<FansText
									style={tw`ml-2`}
									fontFamily="inter-regular"
									fontSize={16}
									color="grey-48"
								>
									{message.videoCallNotification?.time}
								</FansText>
							</View>
							<View style={tw`mt-2 mb-2 w-full`}>
								<View
									style={tw`h-[1px] bg-fans-grey w-full`}
								></View>
							</View>
							<View style={tw`mb-2.5 flex-row items-center`}>
								<FypSvg
									svg={Dollar1Svg}
									width={16}
									height={16}
									color="fans-purple"
								/>
								<FansText
									style={tw`ml-3.375 font-semibold`}
									fontFamily="inter-semibold"
									fontSize={16}
									color="black"
								>
									Amount:
								</FansText>
								<FansText
									style={tw`ml-2`}
									fontFamily="inter-regular"
									fontSize={16}
									color="grey-48"
								>
									{message.videoCallNotification?.amount}
								</FansText>
							</View>
						</View>
						{status === "Accepted" && (
							<TouchableOpacity
								style={tw`bg-black rounded-full p-2 mt-4 w-full items-center`}
								onPress={() => {}}
							>
								<FansText
									style={tw`text-white font-bold`}
									fontFamily="inter-bold"
									fontSize={16}
								>
									Add To Calendar
								</FansText>
							</TouchableOpacity>
						)}
						{(status === "Pending" || status === "Accepted") && (
							<TouchableOpacity
								style={tw`border border-black rounded-full p-1.5 mt-2 w-full items-center bg-white`}
								onPress={() => onCancelVideoCall(message)}
							>
								<FansText
									style={tw`text-black font-bold`}
									fontFamily="inter-bold"
									fontSize={16}
								>
									Cancel
								</FansText>
							</TouchableOpacity>
						)}
						{status === "Cancelled" && (
							<TouchableOpacity
								style={tw`bg-black rounded-full p-2 mt-4 w-full items-center`}
								onPress={onBookAgain}
							>
								<FansText
									style={tw`text-white font-bold`}
									fontFamily="inter-bold"
									fontSize={16}
								>
									Book again
								</FansText>
							</TouchableOpacity>
						)}
					</View>
				</LinearGradient>
			</View>
		</View>
	);
};

const FromVideoCallNotificationMessage = ({
	message,
	onAcceptVideoCall,
	onRejectVideoCall,
	onAddToCalendar,
}: {
	message: IMessage;
	onAcceptVideoCall: (message: IMessage) => void;
	onRejectVideoCall: (message: IMessage) => void;
	onAddToCalendar: (message: IMessage) => void;
}) => {
	const status = message.videoCallNotification?.status ?? "Pending";

	const gradientColors = {
		Pending: ["#d885ff", "#a854f5", "#1d21e5"],
		Accepted: ["#24a2ff", "#23c9b1", "#89f276"],
		Cancelled: ["#eb2121", "#e53ec6", "#f98c28"],
		Declined: ["#eb2121", "#e53ec6", "#f98c28"],
	};

	const titles = {
		Pending: "AWAITING ACCEPTANCE",
		Accepted: "ACCEPTED",
		Cancelled: "CANCELLED",
		Declined: "DECLINED",
	};

	const subtitle = {
		Pending: `${message.user.username} booked \n a video call`,
		Accepted: `${message.user.username} booked \n a video call`,
		Cancelled: `${message.user.username} video call \n was cancelled`,
		Declined: `${message.user.username} video call \n was declined`,
	};

	return (
		<View style={tw`flex-row gap-2.5 self-start`}>
			<View style={tw`justify-center items-center`}>
				<LinearGradient
					colors={gradientColors[status]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					style={tw`rounded-2xl p-1`}
				>
					<View style={tw`w-[300px]`}>
						<View
							style={tw`py-1 px-1 mb-1 rounded-t-2xl bg-transparent items-center justify-center flex-row`}
						>
							<FypSvg
								svg={Check1Svg}
								width={20}
								height={20}
								color="white"
							/>
							<FansText
								style={tw`ml-2 font-bold`}
								fontFamily="inter-bold"
								fontSize={16}
								color="white"
							>
								{titles[status]}
							</FansText>
						</View>
					</View>
					<View
						style={tw`p-5 bg-white rounded-2xl justify-center items-center w-[300px]`}
					>
						<UserAvatar
							size="76px"
							image={message.user.avatar ?? undefined}
						/>
						<FansText
							style={tw`text-center mt-4 mb-4 font-bold`}
							fontSize={18}
							fontFamily="inter-bold"
						>
							{subtitle[status]}
						</FansText>
						<View style={tw`mt-5 w-full`}>
							<View style={tw`mb-2.5 flex-row items-center`}>
								<FypSvg
									svg={Calendar1Svg}
									width={16}
									height={16}
									color="fans-purple"
								/>
								<FansText
									style={tw`ml-3.375 font-semibold`}
									fontFamily="inter-semibold"
									fontSize={16}
									color="black"
								>
									Date:
								</FansText>
								<FansText
									style={tw`ml-2`}
									fontFamily="inter-regular"
									fontSize={16}
									color="grey-48"
								>
									{message.videoCallNotification?.date}
								</FansText>
							</View>
							<View style={tw`mt-2 mb-2 w-full`}>
								<View
									style={tw`h-[1px] bg-fans-grey w-full`}
								></View>
							</View>
							<View style={tw`mb-2.5 flex-row items-center`}>
								<FypSvg
									svg={Clock1Svg}
									width={16}
									height={16}
									color="fans-purple"
								/>
								<FansText
									style={tw`ml-3.375 font-semibold`}
									fontFamily="inter-semibold"
									fontSize={16}
									color="black"
								>
									Time:
								</FansText>
								<FansText
									style={tw`ml-2`}
									fontFamily="inter-regular"
									fontSize={16}
									color="grey-48"
								>
									{message.videoCallNotification?.time}
								</FansText>
							</View>
							<View style={tw`mt-2 mb-2 w-full`}>
								<View
									style={tw`h-[1px] bg-fans-grey w-full`}
								></View>
							</View>
							<View style={tw`mb-2.5 flex-row items-center`}>
								<FypSvg
									svg={Dollar1Svg}
									width={16}
									height={16}
									color="fans-purple"
								/>
								<FansText
									style={tw`ml-3.375 font-semibold`}
									fontFamily="inter-semibold"
									fontSize={16}
									color="black"
								>
									Amount:
								</FansText>
								<FansText
									style={tw`ml-2`}
									fontFamily="inter-regular"
									fontSize={16}
									color="grey-48"
								>
									{message.videoCallNotification?.amount}
								</FansText>
							</View>
						</View>
						<View style={tw`mt-4 w-full flex justify-start`}>
							<FansText
								style={tw`text-left font-normal`}
								fontSize={16}
								fontFamily="inter-regular"
							>
								{message.content}
							</FansText>
						</View>
						<TouchableOpacity
							style={tw`w-full flex justify-start mt-2`}
							onPress={() => {}}
						>
							<FansText
								style={tw`text-left text-fans-purple font-semibold`}
								fontSize={15}
								fontFamily="inter-semibold"
							>
								View details
							</FansText>
						</TouchableOpacity>
						{status === "Pending" && (
							<>
								<TouchableOpacity
									style={tw`bg-black rounded-full p-2 mt-4 w-full items-center`}
									onPress={() => onAcceptVideoCall(message)}
								>
									<FansText
										style={tw`text-white font-bold`}
										fontFamily="inter-bold"
										fontSize={16}
									>
										Accept
									</FansText>
								</TouchableOpacity>
								<TouchableOpacity
									style={tw`border border-black rounded-full p-1.5 mt-2 w-full items-center bg-white`}
									onPress={() => onRejectVideoCall(message)}
								>
									<FansText
										style={tw`text-black font-bold`}
										fontFamily="inter-bold"
										fontSize={16}
									>
										Reject
									</FansText>
								</TouchableOpacity>
							</>
						)}
						{status === "Accepted" && (
							<>
								<TouchableOpacity
									style={tw`bg-black rounded-full p-2 mt-4 w-full items-center`}
									onPress={() => onAddToCalendar(message)}
								>
									<FansText
										style={tw`text-white font-bold`}
										fontFamily="inter-bold"
										fontSize={16}
									>
										Add to calendar
									</FansText>
								</TouchableOpacity>
								<TouchableOpacity
									style={tw`border border-black rounded-full p-1.5 mt-2 w-full items-center bg-white`}
									onPress={() => onRejectVideoCall(message)}
								>
									<FansText
										style={tw`text-black font-bold`}
										fontFamily="inter-bold"
										fontSize={16}
									>
										Cancel video call
									</FansText>
								</TouchableOpacity>
							</>
						)}
					</View>
				</LinearGradient>
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
	onPressMedia,
	onDeleteMessage,
	onReplyMessage,
	onReportMessage,
	onPurchasePost,
	onBookAgain,
	onCancelVideoCall,
	onAcceptVideoCall,
	onRejectVideoCall,
	onAddToCalendar,
}: {
	message: IMessage;
	isSelf: boolean;
	animatedValue: Animated.Value;
	handleActivatedDoubleTapMessage: () => void;
	handleActivatedTapMessage: () => void;
	onPressMedia: (data: IMessage, index: number) => void;
	onDeleteMessage: (message: IMessage) => void;
	onReplyMessage: (message: IMessage) => void;
	onReportMessage: (message: IMessage) => void;
	onPurchasePost: (message: IMessage) => void;
	onBookAgain: () => void;
	onCancelVideoCall: (message: IMessage) => void;
	onAcceptVideoCall: (message: IMessage) => void;
	onRejectVideoCall: (message: IMessage) => void;
	onAddToCalendar: (message: IMessage) => void;
}) => {
	return (
		<Animated.View style={[tw.style("my-[4px]")]}>
			{message.messageType === MessageType.TEXT &&
				(isSelf ? (
					<SelfMessage
						message={message}
						onDeleteMessage={onDeleteMessage}
						onReplyMessage={onReplyMessage}
						onReportMessage={onReportMessage}
					/>
				) : (
					<FromMessage
						message={message}
						handleActivatedDoubleTapMessage={
							handleActivatedDoubleTapMessage
						}
						handleActivatedTapMessage={handleActivatedTapMessage}
						onDeleteMessage={onDeleteMessage}
						onReplyMessage={onReplyMessage}
						onReportMessage={onReportMessage}
					/>
				))}
			{message.messageType === MessageType.MEDIA && (
				<MediaMessage
					message={message}
					isSelf={isSelf}
					onPressMedia={onPressMedia}
				/>
			)}
			{message.messageType === MessageType.TIP && (
				<TipMessage message={message} />
			)}
			{message.messageType === MessageType.PAID_POST &&
				(isSelf ? (
					<SelfPaidPostMessage
						message={message}
						onPressImage={onPressMedia}
					/>
				) : message.status === "Successful" ? (
					<FromPaidPostMessage
						message={message}
						onPressImage={onPressMedia}
					/>
				) : (
					<FromNotPaidPostMessage
						message={message}
						onPressImage={onPressMedia}
						onPurchasePost={onPurchasePost}
					/>
				))}
			{message.messageType === MessageType.VIDEO_CALL_NOTIFICATION &&
				(isSelf ? (
					<SelfVideoCallNotificationMessage
						message={message}
						onBookAgain={onBookAgain}
						onCancelVideoCall={onCancelVideoCall}
					/>
				) : (
					<FromVideoCallNotificationMessage
						message={message}
						onAcceptVideoCall={onAcceptVideoCall}
						onRejectVideoCall={onRejectVideoCall}
						onAddToCalendar={onAddToCalendar}
					/>
				))}
		</Animated.View>
	);
};

export default ChatItem;
