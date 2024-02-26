import {
	ChevronDown2Svg,
	Close4Svg,
	ImageSvg,
	Record1Svg,
	RobotSvg,
	Search1Svg,
	SearchSvg,
	ShopSvg,
	ThreeDotsMenuSvg,
} from "@assets/svgs/common";
import OnlineAvatar from "@components/avatar/OnlineAvatar";
import { MessageInput } from "@components/chat";
import ChatItem from "@components/chat/ChatItem";
import ActionDialog from "@components/chat/common/dialogs/ActionDialog";
import ProfileSheet from "@components/chat/common/dialogs/ChatUserDlg";
import { FypSvg } from "@components/common/base";
import {
	FansButton3,
	FansGap,
	FansScreen2,
	FansSvg,
	FansText,
	FansTextInput3,
	FansView,
} from "@components/controls";
import MediaTimestampModal from "@components/modals/chat/MediaTimestamp";
import { SelectToneSheet } from "@components/sheet/chat";
import { MESSAGE_REPORT_DIALOG_ID } from "@constants/modal";
import {
	CommonActionType,
	ModalActionType,
	useAppContext,
} from "@context/useAppContext";
import {
	acceptMeetingById,
	cancelMeetingById,
	declineMeetingById,
} from "@helper/endpoints/videoCalls/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { chatInboxAtom } from "@state/chat";
import { useFeatureGates } from "@state/featureGates";
import { ISendOptions, useMessageView } from "@state/messagesView";
import { SubscribeActionType } from "@usertypes/commonEnums";
import { ChatNativeStackParams } from "@usertypes/navigations";
import { IMessage } from "@usertypes/types";
import { Stack, useRouter } from "expo-router";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
	Animated,
	Pressable,
	ScrollView,
	TouchableOpacity,
	View,
	VirtualizedList,
} from "react-native";
import Toast from "react-native-toast-message";
import { useRecoilValue } from "recoil";

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

	const { dispatch, state } = useAppContext();
	const featureGates = useFeatureGates();
	const animatedValue = useRef(new Animated.Value(0)).current;
	const listMessages = useRef<VirtualizedList<IMessage> | null>(null);

	const [isCustomMode, setCustomMode] = useState(false);
	const [isSearch, setSearch] = useState(false);
	const [isSelectToneSheetVisible, setSelectToneSheetVisible] =
		useState(false);
	const [mediaViewModalData, setMediaViewModalData] = useState<
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

	const handleSubmitChatUserSheet = (value: string) => {
		switch (value) {
			case "Media":
				navigation.navigate("Gallery", { id: id });
				break;
			case "Pinned":
				navigation.navigate("PinnedMessages");
				break;
			case "Notes":
				navigation.navigate("Notes");
				break;
		}
	};

	useEffect(() => {
		messagesView.initIfNeeded();
	}, [messagesView]);

	const handleCloseActionDialog = () => {
		setOpenActionDialog(false);
	};

	const handleCloseMediaTimestampModal = () => {
		setMediaViewModalData(undefined);
	};

	const handleCloseSelectToneSheet = () => setSelectToneSheetVisible(false);

	const handleSend = async (options: ISendOptions) => {
		await messagesView.sendMessage(options);

		animatedValue.setValue(37);
		Animated.timing(animatedValue, {
			toValue: 0,
			duration: 400,
			useNativeDriver: true,
		}).start();
	};

	const handleDeleteMessage = (message: IMessage) => {
		messagesView?.deleteMessageById(message.id);
	};

	const handleReplyMessage = (message: IMessage) => {
		messagesView?.setReplyToMessage(message);
	};

	const handleReportMessage = (message: IMessage) => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: {
				id: MESSAGE_REPORT_DIALOG_ID,
				show: true,
				payload: { messageId: message.id },
			},
		});
	};

	const handlePurchasePost = (message: IMessage) => {
		dispatch.setCommon({
			type: CommonActionType.toggleSubscribeModal,
			data: {
				visible: true,
				subscribeActionType: SubscribeActionType.ChatPost,
				message: message,
				defaultTab: "form",
				onSuccess: () => messagesView.initIfNeeded(),
			},
		});
	};

	const handleBookAgain = () => {
		router.push(
			`/videocall?username=${conversation?.otherParticipant?.user?.username}&screen=Order`,
		);
	};

	const handleAcceptCall = async (message: IMessage) => {
		if (!message.videoCallNotification) {
			return;
		}
		const resp = await acceptMeetingById(null, {
			id: message.videoCallNotification?.meetingId,
		});
		if (resp.ok) {
			Toast.show({
				type: "success",
				text1: "Meeting accepted",
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleRejectCall = async (message: IMessage) => {
		if (!message.videoCallNotification) {
			return;
		}
		const resp = await declineMeetingById(null, {
			id: message.videoCallNotification?.meetingId,
		});
		if (resp.ok) {
			Toast.show({
				type: "success",
				text1: "Meeting cancelled",
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleCancelCall = async (message: IMessage) => {
		if (!message.videoCallNotification) {
			return;
		}
		const resp = await cancelMeetingById(null, {
			id: message.videoCallNotification?.meetingId,
		});
		if (resp.ok) {
			Toast.show({
				type: "success",
				text1: "Meeting cancelled",
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleStartReached = () => {
		messagesView?.scrolledToBottom();
	};

	const handleEndReached = () => {
		messagesView?.scrolledToTop();
	};

	const handlePressCloseCustom = () => setCustomMode(false);

	const handlePressCustom = () => setCustomMode(true);

	const handlePressMedia = (data: IMessage, index: number) => {
		console.log("handlePressImage", data, index);
		setMediaViewModalData({ data, index });
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
					onPressMedia={handlePressMedia}
					onDeleteMessage={handleDeleteMessage}
					onReplyMessage={handleReplyMessage}
					onReportMessage={handleReportMessage}
					onPurchasePost={handlePurchasePost}
					onBookAgain={handleBookAgain}
					onCancelVideoCall={handleCancelCall}
					onAcceptVideoCall={handleAcceptCall}
					onRejectVideoCall={handleRejectCall}
					onAddToCalendar={() => {}}
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
							<TouchableOpacity
								style={tw.style(
									"flex justify-center items-center w-8 h-8",
								)}
								onPress={() =>
									navigation.navigate("Purchases", { id })
								}
							>
								<FypSvg
									svg={ShopSvg}
									width={17}
									height={17}
									color="fans-black dark:fans-white"
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={tw.style(
									"flex justify-center items-center w-8 h-8",
								)}
								onPress={() =>
									navigation.navigate("Gallery", { id })
								}
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
			{messagesView.replyToMessage && (
				<View
					style={tw`flex-row items-center bg-gray-200 p-2 rounded-lg mb-2`}
				>
					<View style={tw`flex-grow`}>
						<FansText style={tw`text-sm font-bold text-gray-700`}>
							Reply to:{" "}
							{messagesView.replyToMessage?.user.username}
						</FansText>
						<FansText style={tw`text-xs text-gray-500`}>
							{messagesView.replyToMessage.content.length > 50
								? `${messagesView.replyToMessage.content.substring(
										0,
										50,
								  )}...`
								: messagesView.replyToMessage?.content}
						</FansText>
					</View>
					<TouchableOpacity
						onPress={() =>
							messagesView.setReplyToMessage(undefined)
						}
					>
						<Close4Svg style={tw`text-gray-500`} />
					</TouchableOpacity>
				</View>
			)}
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
			<MediaTimestampModal
				visible={mediaViewModalData !== undefined}
				data={mediaViewModalData?.data}
				selectedImageIndex={mediaViewModalData?.index ?? 0}
				onClose={handleCloseMediaTimestampModal}
				onSubmit={() => {}}
			/>
			<SelectToneSheet
				visible={isSelectToneSheetVisible}
				onClose={handleCloseSelectToneSheet}
				onSubmit={handleSubmitSelectToneSheet}
			/>
		</FansScreen2>
	);
};

export default ChatScreen;
