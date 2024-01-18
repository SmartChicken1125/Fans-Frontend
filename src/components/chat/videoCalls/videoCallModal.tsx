import {
	StarCheckSvg,
	CloseSvg,
	ThreeDotsVerticalSvg,
	RoundedTip1Svg,
	Expand1Svg,
	Play1Svg,
	Record2Svg,
	Record1Svg,
	VolumnSvg,
	Volumn1Svg,
	Mic1Svg,
	MicSvg,
	PhoneSvg,
	ChatSvg,
	ChevronUp1Svg,
} from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import ChatItem from "@components/chat/ChatItem";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import {
	FypSvg,
	FypLinearGradientView,
	FypText,
	FypRadio,
	FypNullableView,
} from "@components/common/base";
import { FansView, FansIconButton, FansDivider } from "@components/controls";
import { emptyProfileData } from "@constants/common";
import { useAppContext } from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import { getCreatorProfileByLink } from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { chatInboxAtom } from "@state/chat";
import { useMessageView } from "@state/messagesView";
import { IMessage, IProfile } from "@usertypes/types";
import { IUploadedFile } from "@utils/useUploadFile";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { FC, useState, useRef, useEffect } from "react";
import {
	Modal,
	Image,
	Animated as ReAnimated,
	VirtualizedList,
	Dimensions,
	ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import OutsidePressHandler from "react-native-outside-press";
import Animated, {
	FadeIn,
	FadeOut,
	useSharedValue,
} from "react-native-reanimated";
import { useRecoilValue } from "recoil";
import BuyMoreTimeModal from "./buyMoreTimeModal";
import ChatInput from "./chatInput";
import EmergencyModal from "./emergencyModal";
import JoinErrorModal from "./joinErrorModal";
import PurchaseRequestModal from "./purchaseRequestModal";
import SendOfferModal from "./sendOfferModal";
import SubmitSuccessModal from "./submitSuccessModal";
import ThreeDotsModal from "./threeDotsModal";

const { width: windowWidth } = Dimensions.get("window");

interface ControlButtonProps {
	isActive?: boolean;
	onPress: () => void;
	children: React.ReactNode;
	style?: ViewStyle;
}

const ControlButton: FC<ControlButtonProps> = (props) => {
	const { isActive, onPress, children, style } = props;
	return (
		<FansView
			width={{ xs: 42, md: 74 }}
			height={{ xs: 42, md: 74 }}
			alignItems="center"
			justifyContent="center"
			borderRadius={74}
			style={[
				tw.style(isActive ? "bg-fans-white" : "bg-fans-black/40"),
				style,
			]}
			pressableProps={{
				onPress: onPress,
			}}
		>
			{children}
		</FansView>
	);
};

interface DevicePopupProps {
	onOutsidePress: () => void;
}

const DevicePopup: FC<DevicePopupProps> = (props) => {
	const { onOutsidePress } = props;
	const [output, setOutput] = useState("default");
	return (
		<OutsidePressHandler
			onOutsidePress={onOutsidePress}
			style={[
				tw.style("absolute", "w-[394px] left-1/2 bottom-25"),
				{
					transform: [{ translateX: -194 }],
				},
			]}
		>
			<Animated.View
				entering={FadeIn}
				exiting={FadeOut}
				style={[
					tw.style(
						"pt-6 pb-3 px-[18px] rounded-[15px]",
						"bg-fans-black/50",
					),
				]}
			>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					textAlign="center"
					margin={{ b: 30 }}
					style={tw.style("text-fans-white")}
				>
					Devices
				</FypText>
				<FansView margin={{ b: 28 }}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 10 }}
						style={tw.style("text-fans-white")}
					>
						Input device
					</FypText>
					<FansView height={52} justifyContent="center">
						<FypRadio
							checked={true}
							label="Default"
							labelStyles="text-fans-white text-[16px] leading-[21px]"
							onPress={() => {}}
						/>
					</FansView>
				</FansView>
				<FansView>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 10 }}
						style={tw.style("text-fans-white")}
					>
						Output device
					</FypText>
					<FansView height={52} justifyContent="center">
						<FypRadio
							checked={output === "default"}
							label="Default"
							labelStyles="text-fans-white text-[16px] leading-[21px]"
							onPress={() => setOutput("default")}
						/>
					</FansView>
					<FansDivider style={tw.style("bg-fans-black-2f")} />
					<FansView height={52} justifyContent="center">
						<FypRadio
							checked={output === "headphones"}
							label="Headphones"
							labelStyles="text-fans-white text-[16px] leading-[21px]"
							onPress={() => setOutput("headphones")}
						/>
					</FansView>
					<FansDivider style={tw.style("bg-fans-black-2f")} />
					<FansView height={52} justifyContent="center">
						<FypRadio
							checked={output === "headphones2"}
							label="Headphones2"
							labelStyles="text-fans-white text-[16px] leading-[21px]"
							onPress={() => setOutput("headphones2")}
						/>
					</FansView>
				</FansView>
			</Animated.View>
		</OutsidePressHandler>
	);
};

interface HeaderProps {
	profile: IProfile;
	handleClose: () => void;
	handleBuyMoreTime: () => void;
	handleTipUser: () => void;
	handleSendOffer: () => void;
	handlePressThreeDots: () => void;
	handleWaitCallback: () => void;
}

const Header: FC<HeaderProps> = (props) => {
	const {
		profile,
		handleClose,
		handleBuyMoreTime,
		handleTipUser,
		handleSendOffer,
		handlePressThreeDots,
		handleWaitCallback,
	} = props;
	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			justifyContent="between"
			position="absolute"
			width="full"
			flexWrap="wrap"
			style={tw.style("px-4 top-3 md:pl-9 md:pr-8 md:top-6 z-10")}
		>
			<FansView
				flexDirection="row"
				alignItems="center"
				position="relative"
				borderRadius={60}
				style={tw.style("md:py-[7px] md:pl-[10px] md:bg-fans-black/40")}
			>
				<AvatarWithStatus
					avatar={profile.avatar}
					size={tw.prefixMatch("md") ? 46 : 34}
				/>
				<FansView style={tw.style("ml-3 md:ml-4")}>
					<FansView flexDirection="row" alignItems="center" gap={11}>
						<FypText
							fontSize={{ xs: 16, md: 19 }}
							lineHeight={26}
							fontWeight={tw.prefixMatch("md") ? 700 : 600}
							numberOfLines={1}
							style={[
								tw.style("text-fans-white"),
								{ maxWidth: windowWidth * 0.3 },
							]}
						>
							{profile.displayName}
						</FypText>
						<FypSvg svg={StarCheckSvg} width={16} height={15} />
					</FansView>
					<FypText
						fontSize={{ xs: 14, md: 16 }}
						lineHeight={{ xs: 19, md: 21 }}
						style={tw.style("text-fans-white")}
					>
						00:15
					</FypText>
				</FansView>
				<FansIconButton
					size={tw.prefixMatch("md") ? 32 : 22}
					backgroundColor="bg-transparent"
					onPress={handlePressThreeDots}
				>
					<FypSvg
						svg={ThreeDotsVerticalSvg}
						width={18}
						height={18}
						color="fans-white"
					/>
				</FansIconButton>
			</FansView>

			{tw.prefixMatch("md") ? (
				<FansView
					width={182}
					height={42}
					borderRadius={42}
					alignItems="center"
					justifyContent="center"
					style={tw.style("bg-fans-black/40")}
					pressableProps={{
						onPress: handleClose,
					}}
				>
					<FypText
						fontSize={19}
						fontWeight={700}
						lineHeight={26}
						style={tw.style("text-fans-white")}
					>
						Exit video call
					</FypText>
				</FansView>
			) : (
				<FypText
					fontSize={17}
					fontWeight={600}
					lineHeight={22}
					style={tw.style("text-fans-white")}
					onPress={handleClose}
				>
					End
				</FypText>
			)}

			<FansView
				flexDirection="row"
				gap={14}
				style={[
					tw.style(
						tw.prefixMatch("md")
							? "absolute top-2 left-1/2"
							: "w-full mt-8",
					),
					{
						transform: tw.prefixMatch("md")
							? [{ translateX: -180 }]
							: [],
					},
				]}
			>
				<FansView
					height={42}
					borderRadius={42}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"bg-fans-black/40",
						tw.prefixMatch("md") ? "w-[172px]" : "flex-1",
					)}
					pressableProps={{
						onPress: handleBuyMoreTime,
					}}
				>
					<FypText
						fontSize={19}
						lineHeight={26}
						fontWeight={700}
						style={tw.style("text-fans-white")}
					>
						Buy more time
					</FypText>
				</FansView>
				<FansView
					height={42}
					borderRadius={42}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"bg-fans-black/40",
						tw.prefixMatch("md") ? "w-[172px]" : "flex-1",
					)}
					gap={9}
					flexDirection="row"
					pressableProps={{
						onPress: handleTipUser,
					}}
				>
					<FypSvg
						svg={RoundedTip1Svg}
						width={15}
						height={15}
						color="fans-white"
					/>
					<FypText
						fontSize={19}
						lineHeight={26}
						fontWeight={700}
						style={tw.style("text-fans-white")}
					>
						Tip Jane
					</FypText>
				</FansView>
				<FansView
					height={42}
					borderRadius={42}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"bg-fans-black/40",
						tw.prefixMatch("md") ? "w-[172px]" : "flex-1",
					)}
					gap={9}
					flexDirection="row"
					pressableProps={{
						onPress: handleSendOffer,
					}}
				>
					<FypSvg
						svg={RoundedTip1Svg}
						width={15}
						height={15}
						color="fans-white"
					/>
					<FypText
						fontSize={19}
						lineHeight={26}
						fontWeight={700}
						style={tw.style("text-fans-white")}
					>
						Send offer
					</FypText>
				</FansView>
			</FansView>

			<FansView
				width="full"
				margin={{ t: 17 }}
				style={tw.style("md:hidden")}
			>
				<FansView
					position="relative"
					height={9}
					borderRadius={9}
					style={tw.style("bg-fans-white")}
				>
					<FypLinearGradientView
						colors={["#1d21e5", "#d885ff"]}
						height="full"
						borderRadius={9}
						style={tw.style("w-1/2")}
					></FypLinearGradientView>
				</FansView>
				<FansView margin={{ t: 12 }}>
					<FypText
						fontSize={19}
						lineHeight={26}
						fontWeight={700}
						textAlign="center"
						style={tw.style("text-fans-white")}
					>
						Time left
					</FypText>
					<FypText
						fontSize={42}
						lineHeight={56}
						textAlign="center"
						fontWeight={700}
						margin={{ t: -7 }}
						style={tw.style("text-fans-white")}
						onPress={handleWaitCallback}
					>
						00:30
					</FypText>
				</FansView>
			</FansView>
		</FansView>
	);
};

interface ControlButtonsProps {
	handleExpand: () => void;
	handlePressChat: () => void;
}

const ControlButtons: FC<ControlButtonsProps> = (props) => {
	const { handleExpand, handlePressChat } = props;
	const [isExpanded, setIsExpanded] = useState(false);
	const [isStopped, setIsStopped] = useState(false);
	const [isRecord, setIsRecord] = useState(false);
	const [isStopSpeaker, setIsStopSpicker] = useState(false);
	const [isStopDevice, setIsStopDevice] = useState(false);
	const [openDevicePopup, setOpenDevicePopup] = useState(false);

	const handleCancelCall = () => {};

	return (
		<FansView
			position="absolute"
			flexDirection="row"
			justifyContent="center"
			alignItems="center"
			gap={{ xs: 11, md: 20 }}
			style={[
				tw.style(
					"w-full md:w-auto bottom-2 md:bottom-[70px] left-0 md:left-1/2 z-1",
				),
				{
					transform: [
						{ translateX: tw.prefixMatch("md") ? -272 : 0 },
					],
				},
			]}
		>
			<FansIconButton
				size={42}
				backgroundColor="bg-fans-black/40"
				onPress={handlePressChat}
				style={tw.style("md:hidden")}
			>
				<FypSvg
					svg={ChatSvg}
					width={19}
					height={19}
					color="fans-white"
				/>
			</FansIconButton>
			<ControlButton isActive={isExpanded} onPress={handleExpand}>
				<FypSvg
					svg={Expand1Svg}
					width={{ xs: 18, md: 30 }}
					height={{ xs: 18, md: 30 }}
					color={isExpanded ? "fans-red" : "fans-white"}
				/>
			</ControlButton>
			<ControlButton
				isActive={isStopped}
				onPress={() => setIsStopped(!isStopped)}
			>
				{isStopped ? (
					<FansView
						width={{ xs: 18, md: 30 }}
						height={{ xs: 18, md: 30 }}
						borderRadius={30}
						style={tw.style("bg-fans-red")}
					></FansView>
				) : (
					<FypSvg
						svg={Play1Svg}
						width={{ xs: 20, md: 34 }}
						height={{ xs: 20, md: 34 }}
						color="fans-white"
					/>
				)}
			</ControlButton>
			<ControlButton
				isActive={isRecord}
				onPress={() => setIsRecord(!isRecord)}
			>
				{isRecord ? (
					<FypSvg
						svg={Record2Svg}
						width={{ xs: 23, md: 37 }}
						height={{ xs: 16, md: 25 }}
						color="fans-red"
					/>
				) : (
					<FypSvg
						svg={Record1Svg}
						width={{ xs: 23, md: 37 }}
						height={{ xs: 16, md: 25 }}
						color="fans-white"
					/>
				)}
			</ControlButton>
			<ControlButton
				isActive={isStopSpeaker}
				onPress={() => setIsStopSpicker(!isStopSpeaker)}
			>
				{isStopSpeaker ? (
					<FypSvg
						svg={Volumn1Svg}
						width={{ xs: 25, md: 40 }}
						height={{ xs: 18, md: 29 }}
						color="fans-red"
					/>
				) : (
					<FypSvg
						svg={VolumnSvg}
						width={{ xs: 25, md: 40 }}
						height={{ xs: 18, md: 29 }}
						color="fans-white"
					/>
				)}
			</ControlButton>
			<ControlButton
				isActive={isStopDevice}
				onPress={() => setIsStopDevice(!isStopDevice)}
			>
				{isStopDevice ? (
					<FypSvg
						svg={Mic1Svg}
						width={{ xs: 19, md: 30 }}
						height={{ xs: 23, md: 38 }}
						color="fans-red"
					/>
				) : (
					<FypSvg
						svg={MicSvg}
						width={{ xs: 19, md: 30 }}
						height={{ xs: 23, md: 38 }}
						color="fans-white"
					/>
				)}
				<FansView
					width={46}
					height={46}
					borderRadius={46}
					position="absolute"
					bottom={-14}
					right={-20}
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"border-[3px] bg-fans-green-1f border-fans-green-37 hidden md:flex",
					)}
					pressableProps={{
						onPress: () => setOpenDevicePopup(!openDevicePopup),
					}}
				>
					<FypSvg
						svg={ChevronUp1Svg}
						width={17}
						height={9}
						color="fans-white"
					/>
				</FansView>
				{openDevicePopup ? (
					<DevicePopup
						onOutsidePress={() => setOpenDevicePopup(false)}
					/>
				) : null}
			</ControlButton>
			<ControlButton
				onPress={handleCancelCall}
				style={tw.style("bg-fans-red")}
			>
				<FypSvg
					svg={PhoneSvg}
					width={{ xs: 22, md: 35 }}
					height={{ xs: 23, md: 38 }}
					color="fans-white"
				/>
			</ControlButton>
		</FansView>
	);
};

interface ChatSectionProps {
	profile: IProfile;
}

const ChatSection: FC<ChatSectionProps> = (props) => {
	const { profile } = props;
	const { id } = useLocalSearchParams();
	const chatId = (id as string) ?? "0";

	const listMessages = useRef<VirtualizedList<IMessage> | null>(null);
	const [imageViewModalData, setImageViewModalData] = useState<
		{ data: IMessage; index: number } | undefined
	>();
	const messagesView = useMessageView(chatId);
	const animatedValue = useRef(new ReAnimated.Value(0)).current;
	const inbox = useRecoilValue(chatInboxAtom);
	const conversation = inbox.data.get(chatId);

	const handlePressImage = (data: IMessage, index: number) => {
		console.log("handlePressImage", data, index);
		setImageViewModalData({ data, index });
	};

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
		ReAnimated.timing(animatedValue, {
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

	return (
		<FansView flex="1">
			<FansView height={0} grow>
				<VirtualizedList
					ref={listMessages}
					keyExtractor={(item) => item.id}
					renderItem={({ item }: { item: IMessage }) => (
						<ChatItem
							isSelf={item.user.id === profile.userId}
							message={item}
							animatedValue={animatedValue}
							handleActivatedDoubleTapMessage={() => {}}
							handleActivatedTapMessage={() => {}}
							onPressImage={handlePressImage}
						/>
					)}
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
			{conversation ? (
				<ChatInput
					onSend={handleSend}
					creator={conversation.otherParticipant}
				/>
			) : null}
		</FansView>
	);
};

interface MobileChatModalProps {
	open: boolean;
	handleClose: () => void;
	profile: IProfile;
}

const MobileChatModal: FC<MobileChatModalProps> = (props) => {
	const { open, handleClose, profile } = props;

	const positionY = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onBegin((e) => {
			positionY.value = e.translationY;
		})
		.onEnd((e) => {
			if (positionY.value < e.translationY) {
				handleClose();
			}
		});

	return (
		<Modal
			transparent
			visible={open}
			style={tw.style("bg-fans-transparent")}
		>
			<FansView
				width="full"
				height="full"
				position="relative"
				style={tw.style("bg-fans-black/30")}
				touchableOpacityProps={{
					activeOpacity: 1,
					onPress: handleClose,
				}}
			>
				<FansView
					position="absolute"
					width="full"
					left={0}
					bottom={0}
					touchableOpacityProps={{ activeOpacity: 1 }}
					style={tw.style("h-9/10 bg-fans-black/50 rounded-t-[7px]")}
				>
					<FansView height={40}>
						<GestureDetector gesture={panGesture}>
							<FansView padding={{ t: 16, b: 20 }}>
								<FansView
									width={38}
									height={4}
									borderRadius={4}
									style={tw.style("bg-fans-white/20 mx-auto")}
								></FansView>
							</FansView>
						</GestureDetector>
					</FansView>
					<FansView flex="1">
						<FypText
							fontSize={19}
							lineHeight={26}
							fontWeight={700}
							textAlign="center"
							style={tw.style("text-fans-white")}
						>
							Chat
						</FypText>
						<FansView flex="1" padding={{ x: 18, b: 40 }}>
							<ChatSection profile={profile} />
						</FansView>
					</FansView>
				</FansView>
			</FansView>
		</Modal>
	);
};

interface Props {
	visible: boolean;
	handleClose: () => void;
}

const VideoCallModal: FC<Props> = (props) => {
	const { visible, handleClose } = props;
	const { id: paramId } = useLocalSearchParams();
	const chatId = (paramId as string) ?? "0";
	const router = useRouter();
	const { state } = useAppContext();
	const { profile } = state;
	const [receiver, setReceiver] = useState<IProfile>(emptyProfileData);

	const [openThreeDots, setOpenThreeDots] = useState(false);
	const [openEmergencyModal, setOpenEmergencyModal] = useState(false);
	const [openChatModal, setOpenChatModal] = useState(false);
	const [openBuyTimeModal, setOpenBuyTimeModal] = useState(false);
	const [openPurchaseRequestModal, setOenPurchaseRequestModal] = useState<{
		open: boolean;
		amount: number;
		paymentProfileId: string;
		type: "time" | "tributeFee";
	}>({
		open: false,
		amount: 0,
		paymentProfileId: "",
		type: "time",
	});

	const [openSendOfferModal, setOpenSendOfferModal] = useState(false);
	const [openSuccessModal, setOpenSuccessModal] = useState(false);
	const [openJoinErrorModal, setOpenJoinErrorModal] = useState(false);
	const [openChatWindow, setOpenChatWindow] = useState(false);
	const [openExpandView, setOpenExpandView] = useState(false);
	const [showNavs, setShowNavs] = useState(false);

	const inbox = useRecoilValue(chatInboxAtom);
	const conversation = inbox.data.get(chatId);

	const handlePointerMove = () => {
		if (!showNavs) {
			setShowNavs(true);
			setTimeout(() => setShowNavs(false), 5000);
		}
	};

	const handleOpenChatForm = () => {
		if (tw.prefixMatch("md")) {
			setOpenChatWindow(true);
		} else {
			setOpenChatModal(true);
		}
	};

	const handleBuyMoreTime = () => {
		setOpenBuyTimeModal(true);
	};

	const handleTipUser = () => {};

	const handleSendOffer = () => {
		setOpenSendOfferModal(true);
	};

	const handleReturnToHome = () => {
		handleClose();
		router.replace("/posts");
	};

	const fetchReceiverData = async () => {
		const resp = await getCreatorProfileByLink({
			profileLink: conversation?.name ?? "",
		});
		if (resp.ok) {
			setReceiver(resp.data);
		} else {
			setReceiver(emptyProfileData);
		}
	};

	useEffect(() => {
		if (chatId !== "0" && conversation?.name) {
			fetchReceiverData();
		}
	}, [chatId]);

	return (
		<Modal transparent visible={visible}>
			<FypLinearGradientView
				colors={["#000", "#363535"]}
				start={[0, 1]}
				end={[0, 0]}
				width="screen"
				height="screen"
				position="relative"
			>
				{!openExpandView || showNavs ? (
					<Header
						profile={profile}
						handleClose={handleClose}
						handlePressThreeDots={() => setOpenThreeDots(true)}
						handleBuyMoreTime={handleBuyMoreTime}
						handleTipUser={handleTipUser}
						handleSendOffer={handleSendOffer}
						handleWaitCallback={() => setOpenJoinErrorModal(true)}
					/>
				) : null}

				<FansView
					flex="1"
					flexDirection="row"
					onPointerMove={handlePointerMove}
				>
					<FansView height="full" flex="1">
						{profile.avatar ? (
							<Image
								source={{ uri: cdnURL(profile.avatar) }}
								style={tw.style("w-full h-full")}
								resizeMode="contain"
							/>
						) : (
							<FansView style={tw.style("mx-auto my-auto")}>
								<UserAvatar
									size={
										tw.prefixMatch("md") ? "200px" : "100px"
									}
								/>
							</FansView>
						)}
					</FansView>
					{openExpandView ? (
						<FansView
							position="absolute"
							width={{ xs: 95, md: 337 }}
							height={{ xs: 174, md: 184 }}
							style={tw.style(
								tw.prefixMatch("md")
									? "bottom-18 left-9"
									: "bottom-16 right-4",
							)}
						>
							{receiver.avatar ? (
								<Image
									source={{ uri: cdnURL(receiver.avatar) }}
									style={tw.style(
										"w-full h-full rounded-[15px]",
									)}
									resizeMode="cover"
								/>
							) : (
								<FansView
									style={tw.style(
										"w-full h-full bg-fans-black/40 rounded-[15px]",
									)}
									alignItems="center"
									justifyContent="center"
								>
									<UserAvatar
										size={
											tw.prefixMatch("md")
												? "100px"
												: "50px"
										}
									/>
								</FansView>
							)}
						</FansView>
					) : (
						<FypNullableView
							visible={!openChatWindow && tw.prefixMatch("md")}
						>
							<FansView height="full" flex="1">
								{receiver.avatar ? (
									<Image
										source={{
											uri: cdnURL(receiver.avatar),
										}}
										style={tw.style("w-full h-full")}
										resizeMode="cover"
									/>
								) : (
									<FansView
										style={tw.style("w-full h-full")}
										alignItems="center"
										justifyContent="center"
									>
										<UserAvatar size="200px" />
									</FansView>
								)}
							</FansView>
						</FypNullableView>
					)}

					<FypNullableView visible={openChatWindow && !!conversation}>
						<FansView
							width={510}
							position="relative"
							padding={{ x: 32, b: 80, t: 105 }}
							style={tw.style("bg-fans-black-1d hidden md:flex")}
						>
							<FansDivider style={tw.style("bg-fans-white/20")} />
							<FansView
								flexDirection="row"
								alignItems="center"
								justifyContent="between"
								padding={{ y: 16 }}
							>
								<FypText
									fontSize={23}
									fontWeight={700}
									lineHeight={31}
									style={tw.style("text-fans-white")}
								>
									Chat
								</FypText>
								<FansIconButton
									size={30}
									backgroundColor="bg-fans-black-33"
									onPress={() => setOpenChatWindow(false)}
								>
									<FypSvg
										svg={CloseSvg}
										width={13}
										height={13}
										color="fans-white"
									/>
								</FansIconButton>
							</FansView>

							<ChatSection profile={profile} />
						</FansView>
					</FypNullableView>
				</FansView>
				{!openExpandView || showNavs ? (
					<ControlButtons
						handleExpand={() => setOpenExpandView(!openExpandView)}
						handlePressChat={handleOpenChatForm}
					/>
				) : null}

				<FypNullableView visible={!openChatWindow}>
					<FansView
						width={74}
						height={74}
						alignItems="center"
						justifyContent="center"
						borderRadius={74}
						position="absolute"
						style={tw.style(
							"bg-fans-black/40 bottom-[70px] right-[66px] z-11 hidden md:flex",
						)}
						pressableProps={{
							onPress: () => setOpenChatWindow(true),
						}}
					>
						<FypSvg
							svg={ChatSvg}
							width={31}
							height={31}
							color="fans-white"
						/>
					</FansView>
				</FypNullableView>
			</FypLinearGradientView>

			<MobileChatModal
				open={openChatModal}
				profile={profile}
				handleClose={() => setOpenChatModal(false)}
			/>
			<BuyMoreTimeModal
				open={openBuyTimeModal}
				handleClose={() => setOpenBuyTimeModal(false)}
				handleSubmit={(time, paymentProfileId) => {
					setOenPurchaseRequestModal({
						open: true,
						amount: time,
						paymentProfileId,
						type: "time",
					});
					setOpenBuyTimeModal(false);
				}}
			/>
			<PurchaseRequestModal
				open={openPurchaseRequestModal.open}
				data={openPurchaseRequestModal}
				handleClose={() => {
					setOenPurchaseRequestModal({
						...openPurchaseRequestModal,
						open: false,
					});
				}}
				handleSubmit={() => {
					setOenPurchaseRequestModal({
						...openPurchaseRequestModal,
						open: false,
					});
					setOpenSuccessModal(true);
				}}
			/>
			<SendOfferModal
				open={openSendOfferModal}
				handleClose={() => setOpenSendOfferModal(false)}
				handleRequestTime={(time) => {
					setOpenSendOfferModal(false);
					setOenPurchaseRequestModal({
						amount: time,
						paymentProfileId: "",
						type: "time",
						open: true,
					});
				}}
				handleSendTributeFee={(amount) => {
					setOpenSendOfferModal(false);
					setOenPurchaseRequestModal({
						amount: amount,
						paymentProfileId: "",
						type: "tributeFee",
						open: true,
					});
				}}
			/>
			<SubmitSuccessModal
				open={openSuccessModal}
				handleClose={() => setOpenSuccessModal(false)}
				handleSubmit={handleReturnToHome}
			/>
			<JoinErrorModal
				open={openJoinErrorModal}
				handleClose={() => {
					setOpenJoinErrorModal(false);
				}}
				handleSubmit={handleReturnToHome}
			/>
			<ThreeDotsModal
				open={openThreeDots}
				handleClose={() => {
					setOpenThreeDots(false);
				}}
				handlePressEmergency={() => {
					setOpenThreeDots(false);
					setOpenEmergencyModal(true);
				}}
			/>
			<EmergencyModal
				open={openEmergencyModal}
				handleClose={() => setOpenEmergencyModal(false)}
				handleSubmit={() => setOpenEmergencyModal(false)}
			/>
		</Modal>
	);
};

export default VideoCallModal;
