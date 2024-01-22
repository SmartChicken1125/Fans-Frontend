import { CloseSvg, ChatSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	TopNavbar,
	ChatSection,
	ControlButtons,
	BuyMoreTimeModal,
	ThreeDotsModal,
	EmergencyModal,
	ReportModal,
	MobileChatModal,
	SubmitSuccessModal,
	JoinErrorModal,
	PurchaseRequestModal,
} from "@components/chat/videoCalls";
import {
	FypSvg,
	FypLinearGradientView,
	FypText,
	FypNullableView,
} from "@components/common/base";
import { FansView, FansIconButton, FansDivider } from "@components/controls";
import { emptyProfileData } from "@constants/common";
import { useAppContext } from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import { getCreatorProfileByLink } from "@helper/endpoints/profile/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { chatInboxAtom } from "@state/chat";
import { VideoCallStackParams } from "@usertypes/navigations";
import { IProfile } from "@usertypes/types";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { useRecoilValue } from "recoil";

const FanScreen = (
	props: NativeStackScreenProps<VideoCallStackParams, "Fan">,
) => {
	const router = useRouter();
	const { state } = useAppContext();
	const { profile } = state;
	const [receiver, setReceiver] = useState<IProfile>(emptyProfileData);

	// const chatId = (paramId as string) ?? "0";
	const chatId = "";

	const [openThreeDots, setOpenThreeDots] = useState(false);
	const [openEmergencyModal, setOpenEmergencyModal] = useState(false);
	const [openChatModal, setOpenChatModal] = useState(false);

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

	const [openBuyTimeModal, setOpenBuyTimeModal] = useState(false);
	const [openSuccessModal, setOpenSuccessModal] = useState(false);
	const [openJoinErrorModal, setOpenJoinErrorModal] = useState(false);
	const [openChatWindow, setOpenChatWindow] = useState(false);
	const [openExpandView, setOpenExpandView] = useState(true);
	const [showNavs, setShowNavs] = useState(false);
	const [openReportModal, setOpenReportModal] = useState(false);

	const inbox = useRecoilValue(chatInboxAtom);
	const conversation = inbox.data.get(chatId);

	const handleClose = () => {
		router.replace("/posts");
	};

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

	return (
		<FansView>
			<FypLinearGradientView
				colors={["#000", "#363535"]}
				start={[0, 1]}
				end={[0, 0]}
				width="screen"
				height="screen"
				position="relative"
			>
				{!openExpandView || showNavs ? (
					<TopNavbar
						type="creator"
						profile={profile}
						handleClose={handleClose}
						handlePressThreeDots={() => setOpenThreeDots(true)}
						handleBuyMoreTime={handleBuyMoreTime}
						handleTipUser={handleTipUser}
						handleWaitCallback={() => setOpenJoinErrorModal(true)}
						handlePressChat={handleOpenChatForm}
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
							pressableProps={{
								onPress: () => setOpenExpandView(false),
							}}
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
			<ThreeDotsModal
				open={openThreeDots}
				handleClose={() => {
					setOpenThreeDots(false);
				}}
				handlePressEmergency={() => {
					setOpenThreeDots(false);
					setOpenEmergencyModal(true);
				}}
				handlePressReport={() => {
					setOpenThreeDots(false);
					setOpenReportModal(true);
				}}
			/>
			<EmergencyModal
				open={openEmergencyModal}
				handleClose={() => setOpenEmergencyModal(false)}
				handleSubmit={() => setOpenEmergencyModal(false)}
			/>
			<ReportModal
				visible={openReportModal}
				handleClose={() => setOpenReportModal(false)}
			/>
			<SubmitSuccessModal
				open={openSuccessModal}
				handleClose={() => setOpenSuccessModal(false)}
				handleSubmit={handleClose}
			/>
			<JoinErrorModal
				open={openJoinErrorModal}
				handleClose={() => {
					setOpenJoinErrorModal(false);
				}}
				handleSubmit={handleClose}
			/>
		</FansView>
	);
};

export default FanScreen;
