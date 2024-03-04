import {
	BlockSvg,
	CalendarSvg,
	ClockSvg,
	CloseSvg,
	RoundedTipSvg,
	ShopSvg,
	VideoRecordSvg,
} from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypButton2,
	FypLinearGradientView,
	FypModal,
	FypSvg,
	FypText,
} from "@components/common/base";
import { FansDivider, FansIconButton, FansView } from "@components/controls";
import { VideoCallOrderCard } from "@components/videoCall";
import { PENDING_ORDERS_DIALOG_ID } from "@constants/modal";
import { ModalState } from "@context/state/modalState";
import { ModalActionType, useAppContext } from "@context/useAppContext";
import { formatPrice } from "@helper/Utils";
import {
	acceptMeetingById,
	cancelMeetingById,
	declineMeetingById,
	getVideoCallMeetings,
	updateVideoCallSettings,
} from "@helper/endpoints/videoCalls/apis";
import { VideoCallMeetingsRespBody } from "@helper/endpoints/videoCalls/schemas";
import tw from "@lib/tailwind";
import {
	MeetingStatusType,
	VideoCallOrderCardType,
} from "@usertypes/commonEnums";
import { IProfile } from "@usertypes/types";
import React, { FC, useEffect, useRef, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
} from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

const { width: windowWidth } = Dimensions.get("window");

type IVideoType = "video" | "customVideo";

interface OrderCardGroupProps {
	videoType: IVideoType;
	profile: IProfile;
	data: VideoCallMeetingsRespBody;
	handleDisableAll: () => void;
	handleAccept: (orderId: string) => void;
	handleDecline: (orderId: string) => void;
}

const OrderCardGroup: FC<OrderCardGroupProps> = (props) => {
	const {
		handleDisableAll,
		handleAccept,
		handleDecline,
		videoType,
		data,
		profile,
	} = props;
	const isDesktop = tw.prefixMatch("lg");
	const modalWidth = tw.prefixMatch("md") ? 740 : windowWidth - 36;
	const cardWidth = modalWidth - 36;

	const [selectedIndex, setSelectedIndex] = useState(0);
	const carouselRef = useRef<FlatList>(null);
	const offset = useSharedValue(0);

	const carouselStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: withSpring(
						offset.value * (cardWidth + 8) * -1,
						{
							damping: 90,
							stiffness: 90,
						},
					),
				},
			],
		};
	});

	const handleGoToIndex = (index: number) => {
		if (isDesktop) {
			setSelectedIndex(index);
			offset.value = index;
		}
	};

	const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
		const scrollPosition = e.nativeEvent.contentOffset.x;
		const index = scrollPosition / (cardWidth + 8);
		if (index % 1 === 0) setSelectedIndex(index);
	};

	const getItemLayout = (index: number) => {
		return {
			length: cardWidth + 8,
			offset: (cardWidth + 8) * index,
			index: index,
		};
	};

	return (
		<FansView>
			<FansView
				flexDirection="row"
				alignItems="center"
				margin={{ b: 15 }}
				padding={{ x: 18 }}
			>
				<FypText fontSize={17} fontWeight={600} lineHeight={22}>
					{`${data.total} ${
						videoType === "video" ? "Video calls" : "Custom videos"
					}`}
				</FypText>
				<FansView
					width={4}
					height={4}
					borderRadius={4}
					margin={{ l: 19, r: 8 }}
					style={tw.style("bg-fans-grey-48 dark:bg-fans-grey-b1")}
				></FansView>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					{`Total revenue: ${formatPrice(data.totalPrice ?? 0)}`}
				</FypText>
			</FansView>
			{isDesktop ? (
				<FansView style={{ overflow: "hidden" }}>
					<Animated.View
						style={[tw.style("px-[14px] flex-row"), carouselStyles]}
					>
						{data.meetings.map((meeting) => (
							<FansView
								width={cardWidth + 8}
								key={meeting.id}
								padding={{ x: 4 }}
							>
								<VideoCallOrderCard
									data={meeting}
									profile={profile}
									title="AWAITING ACCEPTANCE"
									cardType={VideoCallOrderCardType.Pending}
									onPressSubmit={() =>
										handleAccept(meeting.id)
									}
									onPressCancel={() =>
										handleDecline(meeting.id)
									}
									cancelLabel="Decline"
									submitLabel="Accept"
								/>
							</FansView>
						))}
					</Animated.View>
				</FansView>
			) : (
				<FansView padding={{ x: 14 }}>
					<FlatList
						id="video-call-order"
						ref={carouselRef}
						data={data.meetings}
						horizontal
						pagingEnabled
						renderItem={({ item }) => (
							<FansView
								key={`mobile-${item.id}`}
								width={cardWidth + 8}
								padding={{ x: 4 }}
							>
								<VideoCallOrderCard
									profile={profile}
									data={item}
									title="AWAITING ACCEPTANCE"
									cardType={VideoCallOrderCardType.Pending}
									onPressSubmit={() => handleAccept(item.id)}
									onPressCancel={() => handleDecline(item.id)}
									cancelLabel="Decline"
									submitLabel="Accept"
								/>
							</FansView>
						)}
						onScroll={handleScroll}
						showsHorizontalScrollIndicator={false}
						keyExtractor={(item) => item}
						getItemLayout={(data, index) => getItemLayout(index)}
					/>
				</FansView>
			)}

			<FansView margin={{ t: 12 }}>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					gap={14}
					margin={{ b: 13 }}
					pressableProps={{
						onPress: handleDisableAll,
					}}
				>
					<FypSvg
						svg={BlockSvg}
						width={15}
						height={15}
						color="fans-purple"
					/>
					<FypText
						fontSize={17}
						fontWeight={600}
						lineHeight={22}
						style={tw.style("text-fans-purple")}
					>
						{videoType === "video"
							? "Disable video calls"
							: "Disable custom videos"}
					</FypText>
				</FansView>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
				>
					{data.meetings.map((el, index) => (
						<FansView
							key={`dot-${el.id}`}
							borderRadius={10}
							width={10}
							height={10}
							alignItems="center"
							justifyContent="center"
							pressableProps={{
								onPress: () => handleGoToIndex(index),
							}}
						>
							<FansView
								width={selectedIndex === index ? 8 : 5}
								height={selectedIndex === index ? 8 : 5}
								borderRadius={8}
								style={tw.style(
									selectedIndex === index
										? "bg-fans-black dark:bg-fans-white"
										: "bg-fans-grey-de dark:bg-fans-grey-50",
								)}
							></FansView>
						</FansView>
					))}
				</FansView>
			</FansView>
		</FansView>
	);
};

interface ProcessedAllCardsSectionProps {
	videoType: IVideoType;
}

const ProcessedAllCardsSection: FC<ProcessedAllCardsSectionProps> = (props) => {
	const { videoType } = props;
	return (
		<FansView padding={{ x: 18 }}>
			<FansView
				flexDirection="row"
				alignItems="center"
				margin={{ b: 15 }}
			>
				<FypText fontSize={17} fontWeight={600} lineHeight={22}>
					{`5 ${
						videoType === "video" ? "Video calls" : "Custom videos"
					}`}
				</FypText>
				<FansView
					width={4}
					height={4}
					borderRadius={4}
					margin={{ l: 19, r: 8 }}
					style={tw.style("bg-fans-grey-48 dark:bg-fans-grey-b1")}
				></FansView>
				<FypText
					fontSize={16}
					lineHeight={21}
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					Total revenue: $500
				</FypText>
			</FansView>
			<FansView
				padding={{ t: 18, b: 18 }}
				borderRadius={15}
				alignItems="center"
				gap={4}
				style={tw.style(
					"border border-fans-grey-f0 dark:border-fans-grey-43",
				)}
			>
				<Image
					source={require("@assets/images/common/green-processed.webp")}
					style={tw.style("w-[47px] h-[45px]")}
					resizeMode="contain"
				/>
				<FypText fontSize={17} fontWeight={600} textAlign="center">
					{videoType === "video"
						? `Processed all${`\n`}video call orders`
						: `Processed al${`\n`} custom video orders`}
				</FypText>
			</FansView>
		</FansView>
	);
};

interface AcceptFormProps {
	profile: IProfile;
	handleCreate: () => void;
	handleCancel: () => void;
}

const AcceptForm: FC<AcceptFormProps> = (props) => {
	const { profile, handleCreate, handleCancel } = props;
	return (
		<FansView position="relative" padding={{ t: 34, b: 18, x: 18 }}>
			<FansView
				position="relative"
				margin={{ b: 25 }}
				style={tw.style("mx-auto")}
			>
				<UserAvatar image={profile.avatar} size="86px" />
				<FypLinearGradientView
					colors={["#D885FF", "#A854f5", "#1D21E5"]}
					start={[1, 0]}
					end={[0, 1]}
					width={42}
					height={42}
					borderRadius={42}
					position="absolute"
					alignItems="center"
					justifyContent="center"
					style={tw.style(
						"border-[4px] border-fans-white bottom-[-11px] right-[-8px]",
					)}
				>
					<FypSvg
						svg={VideoRecordSvg}
						width={19}
						height={17}
						color="fans-white"
					/>
				</FypLinearGradientView>
			</FansView>
			<FansView padding={{ x: 18 }} margin={{ b: 40 }}>
				<FypText
					fontSize={21}
					lineHeight={28}
					fontWeight={700}
					textAlign="center"
					margin={{ b: 6 }}
				>
					Get ready for your video{`\n`}call with{" "}
					<FypText
						fontSize={21}
						lineHeight={28}
						fontWeight={700}
						style={tw.style("text-fans-purple")}
					>
						Alex Fink
					</FypText>
					!
				</FypText>
				<FypText
					fontSize={42}
					fontWeight={600}
					lineHeight={56}
					textAlign="center"
					margin={{ b: 14 }}
					style={tw.style("text-fans-purple")}
				>
					00:10:09
				</FypText>
				<FypText
					fontSize={16}
					lineHeight={21}
					textAlign="center"
					style={tw.style("text-fans-grey-48 dark:text-fans-grey-b1")}
				>
					5 minutes before it's time, a popup will appear for you to
					join the room
				</FypText>
			</FansView>
			<FansView margin={{ b: 24 }}>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					height={52}
				>
					<FansView width={24} margin={{ l: 34 }}>
						<FypSvg
							svg={CalendarSvg}
							width={14}
							height={15}
							color="fans-grey-48 dark:fans-grey-b1"
						/>
					</FansView>
					<FypText
						fontSize={17}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
							"w-[70px]",
						)}
					>
						DATE
					</FypText>
					<FypText
						fontSize={17}
						fontWeight={500}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
							"w-[180px]",
						)}
					>
						JANUARY 23
					</FypText>
				</FansView>
				<FansDivider
					style={tw.style(
						"border-fans-grey-f0 dark:border-fans-grey-43",
					)}
				/>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					height={52}
				>
					<FansView width={24} margin={{ l: 34 }}>
						<FypSvg
							svg={ClockSvg}
							width={15}
							height={15}
							color="fans-grey-48 dark:fans-grey-b1"
						/>
					</FansView>
					<FypText
						fontSize={17}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
							"w-[70px]",
						)}
					>
						TIME
					</FypText>
					<FypText
						fontSize={17}
						fontWeight={500}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
							"w-[180px]",
						)}
					>
						10:15 - 10:30 PM UTC
					</FypText>
				</FansView>
				<FansDivider
					style={tw.style(
						"border-fans-grey-f0 dark:border-fans-grey-43",
					)}
				/>
				<FansView
					flexDirection="row"
					alignItems="center"
					justifyContent="center"
					height={52}
				>
					<FansView width={24} margin={{ l: 34 }}>
						<FypSvg
							svg={RoundedTipSvg}
							width={15}
							height={15}
							color="fans-grey-48 dark:fans-grey-b1"
						/>
					</FansView>
					<FypText
						fontSize={17}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
							"w-[70px]",
						)}
					>
						PRICE
					</FypText>
					<FypText
						fontSize={17}
						fontWeight={500}
						style={tw.style(
							"text-fans-grey-48 dark:text-fans-grey-b1",
							"w-[180px]",
						)}
					>
						$30 USD
					</FypText>
				</FansView>
			</FansView>
			<FypButton2
				style={tw.style("bg-fans-purple")}
				textStyle={tw.style("text-fans-white")}
				pressableProps={{
					onPress: handleCreate,
				}}
			>
				OK
			</FypButton2>
			<FypButton2
				textStyle={tw.style("text-fans-purple")}
				pressableProps={{
					onPress: handleCancel,
				}}
			>
				Cancel call
			</FypButton2>
		</FansView>
	);
};

const PendingOrdersModal = () => {
	const { state, dispatch } = useAppContext();
	const { profile } = state;
	const modals = state.modal.modals;
	const modal = modals.find(
		(m) => m.id === PENDING_ORDERS_DIALOG_ID,
	) as ModalState;
	const visible = !!modal && modal.show;

	const [videoCallMeetings, setVideoCallMeetings] =
		useState<VideoCallMeetingsRespBody>({
			page: 1,
			size: 10,
			total: 0,
			totalPrice: 0,
			meetings: [],
		});
	const [selectedMeetingId, setSelectedMeetingId] = useState("");

	const handleClose = () => {
		dispatch.setModal({
			type: ModalActionType.showModal,
			data: { id: PENDING_ORDERS_DIALOG_ID, show: false },
		});
	};

	const [tab, setTab] = useState<"list" | "allPassed" | "acceptForm">("list");

	const handleAccept = (meetingId: string) => {
		setSelectedMeetingId(meetingId);
		setTab("acceptForm");
	};

	const handleDecline = async (meetingId: string) => {
		const resp = await declineMeetingById(null, { id: meetingId });
		if (resp.ok) {
			fetchVideoCallMeetings();
			setTab("allPassed");
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleDisableAll = async () => {
		const postbody = {
			videoCallsEnabled: false,
		};
		const resp = await updateVideoCallSettings(postbody);
		if (resp.ok) {
			setTab("allPassed");
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
		setTab("allPassed");
	};

	const handleRemindLater = () => {
		setTab("allPassed");
	};

	const handlePressDone = () => {
		handleClose();
	};

	const handleCreateCall = async () => {
		const resp = await acceptMeetingById(null, { id: selectedMeetingId });
		if (resp.ok) {
			handleClose();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleCancelCall = async () => {
		const resp = await cancelMeetingById(null, { id: selectedMeetingId });
		if (resp.ok) {
			handleClose();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const fetchVideoCallMeetings = async () => {
		const resp = await getVideoCallMeetings({
			status: MeetingStatusType.Pending.toLowerCase(),
			after: new Date().toJSON(),
		});

		if (resp.ok) {
			setVideoCallMeetings(resp.data);
		}
	};

	useEffect(() => {
		setTab("list");
		fetchVideoCallMeetings();
	}, [visible]);

	return (
		<FypModal
			visible={visible}
			onDismiss={handleClose}
			width={{ xs: "full", lg: 740 }}
		>
			<FansView position="relative">
				<ScrollView showsVerticalScrollIndicator={false}>
					{tab === "list" ? (
						<FansView
							position="relative"
							padding={{ t: 34, b: 18 }}
						>
							<FypText
								fontSize={17}
								lineHeight={22}
								fontWeight={600}
								style={tw.style(
									"text-fans-purple absolute top-4 right-[22px]",
								)}
								onPress={handleRemindLater}
							>
								Remind later
							</FypText>
							<FansView
								position="relative"
								margin={{ b: 25 }}
								style={tw.style("mx-auto")}
							>
								<UserAvatar
									image={profile.avatar}
									size="86px"
								/>
								<FypLinearGradientView
									colors={["#D885FF", "#A854f5", "#1D21E5"]}
									start={[1, 0]}
									end={[0, 1]}
									width={42}
									height={42}
									borderRadius={42}
									position="absolute"
									alignItems="center"
									justifyContent="center"
									style={tw.style(
										"border-[4px] border-fans-white bottom-[-11px] right-[-8px]",
									)}
								>
									<FypSvg
										svg={ShopSvg}
										width={16}
										height={20}
										color="fans-white"
									/>
								</FypLinearGradientView>
							</FansView>
							<FansView padding={{ x: 18 }} margin={{ b: 24 }}>
								<FypText
									fontSize={21}
									lineHeight={28}
									fontWeight={700}
									textAlign="center"
									margin={{ b: 16 }}
								>
									Pending orders
								</FypText>
								<FypText fontSize={16} textAlign="center">
									Please accept or reject pending orders to
									continue onto FYP.Fans
								</FypText>
							</FansView>

							<FansView gap={25} margin={{ b: 30 }}>
								<OrderCardGroup
									videoType="video"
									profile={profile}
									data={videoCallMeetings}
									handleDisableAll={handleDisableAll}
									handleAccept={handleAccept}
									handleDecline={handleDecline}
								/>
								{/* <OrderCardGroup
									videoType="customVideo"
									handleDisableAll={handleDisableAll}
									handleAccept={handleAccept}
									handleDecline={handleDecline}
								/> */}
							</FansView>
							<FansView padding={{ x: 18 }}>
								<FypButton2
									style={tw.style(
										"border border-fans-purple",
									)}
									textStyle={tw.style("text-fans-purple")}
									pressableProps={{
										onPress: handleRemindLater,
									}}
								>
									Remind later
								</FypButton2>
							</FansView>
						</FansView>
					) : null}
					{tab === "allPassed" ? (
						<FansView
							position="relative"
							padding={{ t: 34, b: 18 }}
						>
							<FansIconButton
								size={25}
								backgroundColor="bg-fans-black/30 dark:bg-fans-white/30"
								style={tw.style(
									"absolute top-[14px] right-[14px]",
								)}
								onPress={handleClose}
							>
								<FypSvg
									svg={CloseSvg}
									width={10}
									height={10}
									color="fans-white dark:fans-black-1d"
								/>
							</FansIconButton>
							<FansView
								position="relative"
								margin={{ b: 25 }}
								style={tw.style("mx-auto")}
							>
								<UserAvatar
									image={profile.avatar}
									size="86px"
								/>
								<FypLinearGradientView
									colors={["#D885FF", "#A854f5", "#1D21E5"]}
									start={[1, 0]}
									end={[0, 1]}
									width={42}
									height={42}
									borderRadius={42}
									position="absolute"
									alignItems="center"
									justifyContent="center"
									style={tw.style(
										"border-[4px] border-fans-white bottom-[-11px] right-[-8px]",
									)}
								>
									<FypSvg
										svg={ShopSvg}
										width={16}
										height={20}
										color="fans-white"
									/>
								</FypLinearGradientView>
							</FansView>
							<FansView padding={{ x: 18 }} margin={{ b: 24 }}>
								<FypText
									fontSize={21}
									lineHeight={28}
									fontWeight={700}
									textAlign="center"
									margin={{ b: 16 }}
								>
									Pending orders
								</FypText>
								<FypText fontSize={16} textAlign="center">
									Please accept or reject pending orders to
									continue onto FYP.Fans
								</FypText>
							</FansView>

							<FansView gap={24} margin={{ b: 26 }}>
								<ProcessedAllCardsSection videoType="video" />
								<ProcessedAllCardsSection videoType="customVideo" />
							</FansView>
							<FansView padding={{ x: 18 }}>
								<FypButton2
									textStyle={tw.style("text-fans-purple")}
									pressableProps={{
										onPress: handlePressDone,
									}}
								>
									Done
								</FypButton2>
							</FansView>
						</FansView>
					) : null}
					{tab === "acceptForm" ? (
						<AcceptForm
							profile={profile}
							handleCreate={handleCreateCall}
							handleCancel={handleCancelCall}
						/>
					) : null}
				</ScrollView>
			</FansView>
		</FypModal>
	);
};

export default PendingOrdersModal;
