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
	ChevronLeftSvg,
	ChevronUp1Svg,
} from "@assets/svgs/common";
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
import { useAppContext } from "@context/useAppContext";
import tw from "@lib/tailwind";
import { chatInboxAtom } from "@state/chat";
import { useMessageView } from "@state/messagesView";
import { IMessage, IUserInfo, ICardAction } from "@usertypes/types";
import { IUploadedFile } from "@utils/useUploadFile";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { FC, useState, useRef, Fragment } from "react";
import {
	Modal,
	Image,
	Animated as ReAnimated,
	VirtualizedList,
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
						"bg-fans-black-2e",
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

const ControlButtons = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isStopped, setIsStopped] = useState(false);
	const [isRecord, setIsRecord] = useState(false);
	const [isStopSpeaker, setIsStopSpicker] = useState(false);
	const [isStopDevice, setIsStopDevice] = useState(false);
	const [openDevicePopup, setOpenDevicePopup] = useState(false);

	const handleCancelCall = () => {};

	const handlePressMic = () => {
		if (tw.prefixMatch("md")) {
			setOpenDevicePopup(!openDevicePopup);
		} else {
			setIsStopDevice(!isStopDevice);
		}
	};

	return (
		<FansView
			position="absolute"
			height={{ xs: 68, md: 120 }}
			borderRadius={120}
			flexDirection="row"
			justifyContent="between"
			alignItems="center"
			style={[
				tw.style(
					"w-full max-w-[340px] md:w-[595px] md:max-w-[595px] bottom-12 left-1/2 bg-fans-black/50 px-3 md:px-[26px]",
				),
				{
					transform: [
						{ translateX: tw.prefixMatch("md") ? -298 : -170 },
					],
				},
			]}
		>
			<FansView
				width={{ xs: 46, md: 74 }}
				height={{ xs: 46, md: 74 }}
				alignItems="center"
				justifyContent="center"
				borderRadius={74}
				style={tw.style(
					isExpanded ? "bg-fans-white" : "bg-fans-white/50",
				)}
				pressableProps={{
					onPress: () => setIsExpanded(!isExpanded),
				}}
			>
				<FypSvg
					svg={Expand1Svg}
					width={{ xs: 18, md: 30 }}
					height={{ xs: 18, md: 30 }}
					color={isExpanded ? "fans-red" : "fans-white"}
				/>
			</FansView>
			<FansView
				width={{ xs: 46, md: 74 }}
				height={{ xs: 46, md: 74 }}
				alignItems="center"
				justifyContent="center"
				borderRadius={74}
				style={tw.style(
					isStopped ? "bg-fans-white" : "bg-fans-white/50",
				)}
				pressableProps={{
					onPress: () => setIsStopped(!isStopped),
				}}
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
			</FansView>
			<FansView
				width={{ xs: 46, md: 74 }}
				height={{ xs: 46, md: 74 }}
				alignItems="center"
				justifyContent="center"
				borderRadius={74}
				style={tw.style(
					isRecord ? "bg-fans-white" : "bg-fans-white/50",
				)}
				pressableProps={{
					onPress: () => setIsRecord(!isRecord),
				}}
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
			</FansView>
			<FansView
				width={{ xs: 46, md: 74 }}
				height={{ xs: 46, md: 74 }}
				alignItems="center"
				justifyContent="center"
				borderRadius={74}
				style={tw.style(
					isStopSpeaker ? "bg-fans-white" : "bg-fans-white/50",
				)}
				pressableProps={{
					onPress: () => setIsStopSpicker(!isStopSpeaker),
				}}
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
			</FansView>
			<FansView
				width={{ xs: 46, md: 74 }}
				height={{ xs: 46, md: 74 }}
				alignItems="center"
				position="relative"
				justifyContent="center"
				borderRadius={74}
				style={tw.style(
					isStopDevice ? "bg-fans-white" : "bg-fans-white/50",
				)}
				pressableProps={{
					onPress: handlePressMic,
				}}
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
						"border-[3px] border-fans-black-1f bg-fans-grey-52 hidden md:flex",
					)}
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
			</FansView>
			<FansView
				width={{ xs: 46, md: 74 }}
				height={{ xs: 46, md: 74 }}
				alignItems="center"
				justifyContent="center"
				borderRadius={74}
				style={tw.style("bg-fans-red")}
				pressableProps={{
					onPress: handleCancelCall,
				}}
			>
				<FypSvg
					svg={PhoneSvg}
					width={{ xs: 22, md: 35 }}
					height={{ xs: 23, md: 38 }}
					color="fans-white"
				/>
			</FansView>
		</FansView>
	);
};

interface SelectAnUserScreenProps {
	handlePressBack: () => void;
}

const SelectAnUserScreen: FC<SelectAnUserScreenProps> = (props) => {
	const { handlePressBack } = props;
	return (
		<FansView width="full" height="full" position="relative">
			<Image
				source={require("@assets/images/posts/post-img-2.png")}
				style={tw.style("w-full h-full")}
			/>
			<FansView
				position="absolute"
				width={{ xs: 82, md: 337 }}
				height={{ xs: 150, md: 184 }}
				style={tw.style(
					"right-4 md:right-[142px]",
					tw.prefixMatch("md") ? "bottom-12" : "top-2",
				)}
			>
				<Image
					source={require("@assets/images/posts/post-img-2.png")}
					style={tw.style(
						"w-full h-full rounded-[7px] md:rounded-[15px]",
					)}
				/>
			</FansView>
			<FansIconButton
				size={tw.prefixMatch("md") ? 74 : 46}
				backgroundColor="bg-fans-black/50"
				style={tw.style(
					"absolute top-2 md:top-[58px] left-4 md:left-[140px]",
				)}
				onPress={handlePressBack}
			>
				<FypSvg
					svg={ChevronLeftSvg}
					width={tw.prefixMatch("md") ? 15 : 12}
					height={tw.prefixMatch("md") ? 29 : 20}
					color="fans-white"
				/>
			</FansIconButton>
		</FansView>
	);
};

interface ChatSectionProps {
	userInfo: IUserInfo;
}

const ChatSection: FC<ChatSectionProps> = (props) => {
	const { userInfo } = props;
	const { id: paramId } = useLocalSearchParams();
	const id = paramId as string;

	const listMessages = useRef<VirtualizedList<IMessage> | null>(null);
	const [imageViewModalData, setImageViewModalData] = useState<
		{ data: IMessage; index: number } | undefined
	>();
	const messagesView = useMessageView(id);
	const animatedValue = useRef(new ReAnimated.Value(0)).current;
	const inbox = useRecoilValue(chatInboxAtom);
	const conversation = inbox.data.get(id);

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
							isSelf={item.user.id === userInfo.id}
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
	userInfo: IUserInfo;
}

const MobileChatModal: FC<MobileChatModalProps> = (props) => {
	const { open, handleClose, userInfo } = props;

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
					style={tw.style("h-9/10 bg-fans-black-1d rounded-t-[7px]")}
				>
					<FansView height={40}>
						<GestureDetector gesture={panGesture}>
							<FansView padding={{ t: 16, b: 20 }}>
								<FansView
									width={38}
									height={4}
									borderRadius={4}
									style={tw.style("bg-fans-white/40 mx-auto")}
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
							<ChatSection userInfo={userInfo} />
						</FansView>
					</FansView>
				</FansView>
			</FansView>
		</Modal>
	);
};

interface MobileScreenProps {
	handleClose: () => void;
	handleSelectUser: () => void;
	handleBuyMoreTime: () => void;
	handleTipUser: () => void;
	handlePressChat: () => void;
	handleSendOffer: () => void;
	handleWaitCallback: () => void;
	handlePressThreeDots: () => void;
}

const MobileScreen: FC<MobileScreenProps> = (props) => {
	const {
		handleClose,
		handleBuyMoreTime,
		handleTipUser,
		handlePressChat,
		handleSelectUser,
		handleSendOffer,
		handleWaitCallback,
		handlePressThreeDots,
	} = props;
	const [displayNameMaxWidth, setDisplayNameMaxWidth] = useState(100);

	return (
		<FansView
			width="screen"
			height="screen"
			position="relative"
			style={tw.style("bg-fans-black")}
		>
			<FansView
				height={48}
				flexDirection="row"
				alignItems="center"
				justifyContent="between"
				padding={{ x: 18 }}
				onLayout={(e) =>
					setDisplayNameMaxWidth(e.nativeEvent.layout.width * 0.45)
				}
			>
				<FansView flexDirection="row" alignItems="center">
					<AvatarWithStatus avatar="" size={34} />
					<FypText
						fontSize={16}
						lineHeight={21}
						fontWeight={600}
						numberOfLines={1}
						margin={{ l: 13, r: 14 }}
						style={[
							tw.style("text-fans-white"),
							{ maxWidth: displayNameMaxWidth },
						]}
					>
						Jane Love
					</FypText>
					<FypSvg svg={StarCheckSvg} width={14} height={13} />
				</FansView>

				<FansView flexDirection="row" alignItems="center" gap={4}>
					<FansIconButton
						size={25}
						backgroundColor="bg-transparent"
						onPress={handlePressChat}
					>
						<FypSvg
							svg={ChatSvg}
							width={19}
							height={19}
							color="fans-white"
						/>
					</FansIconButton>
					<FansIconButton
						size={25}
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
					<FansIconButton
						size={25}
						backgroundColor="bg-fans-white/30"
						onPress={handleClose}
					>
						<FypSvg
							svg={CloseSvg}
							width={10}
							height={10}
							color="fans-white"
						/>
					</FansIconButton>
				</FansView>
			</FansView>
			<FansView flex="1" position="relative">
				<FansView
					width="full"
					height="full"
					pressableProps={{ onPress: handleSelectUser }}
				>
					<Image
						source={require("@assets/images/posts/post-img-2.png")}
						style={tw.style("w-full h-full")}
					/>
				</FansView>
				<FansView
					position="absolute"
					top={20}
					left={0}
					padding={{ x: 18 }}
					width="full"
				>
					<FansView
						flexDirection="row"
						justifyContent="center"
						gap={14}
					>
						<FansView
							width={172}
							height={42}
							borderRadius={42}
							alignItems="center"
							justifyContent="center"
							style={tw.style("bg-fans-black/50")}
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
							width={172}
							height={42}
							borderRadius={42}
							alignItems="center"
							justifyContent="center"
							style={tw.style("bg-fans-black/50")}
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
							width={172}
							height={42}
							borderRadius={42}
							alignItems="center"
							justifyContent="center"
							style={tw.style("bg-fans-black/50")}
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
						margin={{ t: 17 }}
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
			<ControlButtons />
		</FansView>
	);
};

interface Props {
	visible: boolean;
	handleClose: () => void;
}

const VideoCallModal: FC<Props> = (props) => {
	const { visible, handleClose } = props;
	const { id: paramId } = useLocalSearchParams();
	const router = useRouter();
	const { state } = useAppContext();
	const [isSelectedUser, setIsSelectedUser] = useState(false);
	const [displayNameMaxWidth, setDisplayNameMaxWidth] = useState(100);
	const [openThreeDots, setOpenThreeDots] = useState(false);
	const [openEmergencyModal, setOpenEmergencyModal] = useState(false);
	const [openChatWindow, setOpenChatWindow] = useState(false);
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

	const id = paramId as string;
	const inbox = useRecoilValue(chatInboxAtom);
	const conversation = inbox.data.get(id);

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

	return (
		<Modal transparent visible={visible}>
			{isSelectedUser ? (
				<SelectAnUserScreen
					handlePressBack={() => setIsSelectedUser(false)}
				/>
			) : (
				<Fragment>
					{tw.prefixMatch("md") ? (
						<FypLinearGradientView
							colors={["#000", "#363535"]}
							start={[0, 1]}
							end={[0, 0]}
							width="screen"
							height="screen"
							position="relative"
							padding={{ b: 62 }}
						>
							<FansView
								height={162}
								margin={{ b: 10 }}
								padding={{ x: 140 }}
								flexDirection="row"
								alignItems="center"
								justifyContent="between"
								onLayout={(e) =>
									setDisplayNameMaxWidth(
										e.nativeEvent.layout.width * 0.35,
									)
								}
							>
								<FansView
									flexDirection="row"
									alignItems="center"
								>
									<AvatarWithStatus avatar="" size={46} />
									<FypText
										fontSize={19}
										lineHeight={26}
										fontWeight={700}
										numberOfLines={1}
										margin={{ l: 17, r: 11 }}
										style={[
											tw.style("text-fans-white"),
											{ maxWidth: displayNameMaxWidth },
										]}
									>
										Jane Love
									</FypText>
									<FypSvg
										svg={StarCheckSvg}
										width={16}
										height={15}
									/>
								</FansView>

								<FansView
									flexDirection="row"
									alignItems="center"
									gap={4}
								>
									<FansIconButton
										size={30}
										backgroundColor="bg-transparent"
										onPress={() => setOpenThreeDots(true)}
									>
										<FypSvg
											svg={ThreeDotsVerticalSvg}
											width={18}
											height={18}
											color="fans-white"
										/>
									</FansIconButton>
									<FansIconButton
										size={30}
										backgroundColor="bg-fans-white"
										onPress={handleClose}
									>
										<FypSvg
											svg={CloseSvg}
											width={13}
											height={13}
											color="fans-black"
										/>
									</FansIconButton>
								</FansView>
								<FansView
									flexDirection="row"
									position="absolute"
									gap={14}
									style={[
										tw.style("top-15 left-1/2"),
										{
											transform: [{ translateX: -180 }],
										},
									]}
								>
									<FansView
										width={172}
										height={42}
										borderRadius={42}
										alignItems="center"
										justifyContent="center"
										style={tw.style(
											"border border-fans-white",
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
										width={172}
										height={42}
										borderRadius={42}
										alignItems="center"
										justifyContent="center"
										style={tw.style(
											"border border-fans-white",
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
										width={172}
										height={42}
										borderRadius={42}
										alignItems="center"
										justifyContent="center"
										style={tw.style(
											"border border-fans-white",
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
							</FansView>

							<FansView
								flex="1"
								flexDirection="row"
								gap={24}
								padding={{ x: 28 }}
							>
								<FansView
									height="full"
									style={tw.style(
										"flex-1 max-h-[502px]",
										openChatWindow && "max-h-[734px]",
									)}
									pressableProps={{
										onPress: () => setIsSelectedUser(true),
									}}
								>
									<Image
										source={require("@assets/images/posts/post-img-2.png")}
										style={tw.style(
											"w-full h-full rounded-[15px]",
										)}
									/>
								</FansView>
								<FypNullableView visible={!openChatWindow}>
									<FansView
										height="full"
										style={tw.style("flex-1 max-h-[502px]")}
										pressableProps={{
											onPress: () =>
												setIsSelectedUser(true),
										}}
									>
										<Image
											source={require("@assets/images/posts/post-img-2.png")}
											style={tw.style(
												"w-full h-full rounded-[15px]",
											)}
										/>
									</FansView>
								</FypNullableView>
								<FypNullableView
									visible={openChatWindow && !!conversation}
								>
									<FansView
										width={478}
										position="relative"
										padding={{ x: 18, b: 20, t: 42 }}
										borderRadius={15}
										style={tw.style("bg-fans-black-1d")}
									>
										<FansIconButton
											size={30}
											backgroundColor="bg-transparent"
											style={tw.style(
												"absolute top-3 right-3",
											)}
											onPress={() =>
												setOpenChatWindow(false)
											}
										>
											<FypSvg
												svg={CloseSvg}
												width={12}
												height={12}
												color="fans-white"
											/>
										</FansIconButton>
										<ChatSection
											userInfo={state.user.userInfo}
										/>
									</FansView>
								</FypNullableView>
							</FansView>

							<ControlButtons />

							<FypNullableView visible={!openChatWindow}>
								<FansView
									width={74}
									height={74}
									alignItems="center"
									justifyContent="center"
									borderRadius={74}
									position="absolute"
									style={tw.style(
										"bg-fans-white/20 bottom-[70px] right-[145px]",
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
					) : (
						<MobileScreen
							handleClose={handleClose}
							handlePressThreeDots={() => setOpenThreeDots(true)}
							handleSelectUser={() => setIsSelectedUser(true)}
							handleBuyMoreTime={handleBuyMoreTime}
							handleTipUser={handleTipUser}
							handlePressChat={() => setOpenChatModal(true)}
							handleSendOffer={handleSendOffer}
							handleWaitCallback={() =>
								setOpenJoinErrorModal(true)
							}
						/>
					)}
				</Fragment>
			)}
			<MobileChatModal
				open={openChatModal}
				userInfo={state.user.userInfo}
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
