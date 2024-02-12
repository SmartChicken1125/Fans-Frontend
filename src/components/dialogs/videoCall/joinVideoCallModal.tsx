import { GemTitleSvg, CloseSvg, VideoRecordSvg } from "@assets/svgs/common";
import UserAvatar from "@components/avatar/UserAvatar";
import {
	FypSvg,
	FypLinearGradientView,
	FypText,
} from "@components/common/base";
import { FansView, FansIconButton } from "@components/controls";
import { defaultVideoCallAttendant } from "@constants/common";
import { useAppContext } from "@context/useAppContext";
import {
	getVideoCallMeetings,
	acceptMeetingById,
	cancelMeetingById,
	getVideoCallAttendants,
} from "@helper/endpoints/videoCalls/apis";
import tw from "@lib/tailwind";
import { useFeatureGates } from "@state/featureGates";
import { MeetingStatusType } from "@usertypes/commonEnums";
import { IVideoCallMeeting, IVideoCallAttendant } from "@usertypes/types";
import { useRouter, useSegments } from "expo-router";
import moment from "moment";
import React, { useState, useEffect, Fragment } from "react";
import { Modal } from "react-native";
import Toast from "react-native-toast-message";

const JoinVideoCallModal = () => {
	const router = useRouter();
	const segments = useSegments();
	const featureGates = useFeatureGates();

	const { state } = useAppContext();
	const { profile } = state;
	const [visible, setVisible] = useState(false);
	const [isRecordAll, setIsRecordAll] = useState(false);
	const [videoCall, setVideoCall] = useState<IVideoCallMeeting | null>();
	const [seconds, setSeconds] = useState(0);
	const [attendant, setAttendant] = useState<IVideoCallAttendant>(
		defaultVideoCallAttendant,
	);

	const handleClose = () => {
		setVisible(false);
	};

	const fetchVideoCallAttendants = async (meetingId: string) => {
		const resp = await getVideoCallAttendants({ id: meetingId });
		if (resp.ok) {
			const _attendant = resp.data.attendees.find(
				(el) => el.id !== profile.userId,
			);
			if (_attendant) {
				setAttendant(_attendant);
			}
		} else {
			setAttendant(defaultVideoCallAttendant);
		}
	};

	const fetchVideoCallMeetings = async () => {
		const resp = await getVideoCallMeetings({
			status: MeetingStatusType.Pending.toLowerCase(),
			after: new Date().toJSON(),
			before: moment(new Date()).add(10, "m").toJSON(),
			sort: "startDate:asc",
		});
		if (resp.ok) {
			if (resp.data.total > 0) {
				const diffSeconds = moment(
					resp.data.meetings[0].startDate,
				).diff(moment(new Date()), "seconds");
				if (diffSeconds > 0 && diffSeconds < 300) {
					setSeconds(diffSeconds);
					setVideoCall(resp.data.meetings[0]);
					fetchVideoCallAttendants(resp.data.meetings[0].id);
					setVisible(true);
				}
			} else {
				setVideoCall(null);
				setVisible(false);
				setAttendant(defaultVideoCallAttendant);
			}
		} else {
			setVideoCall(null);
			setVisible(false);
			setAttendant(defaultVideoCallAttendant);
		}
	};

	const handleAcceptCall = async () => {
		if (!videoCall) {
			return;
		}
		const resp = await acceptMeetingById(null, { id: videoCall.id });
		if (resp.ok) {
			handleClose();
			router.replace({
				pathname: "video-call",
				params: {
					screen: profile.id === videoCall.hostId ? "Creator" : "Fan",
					id: videoCall.id,
				},
			});
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleCancelCall = async () => {
		if (!videoCall) {
			return;
		}
		const resp = await cancelMeetingById(null, { id: videoCall.id });
		if (resp.ok) {
			handleClose();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const formatTime = (timeInSeconds: number) => {
		const hours = Math.floor(timeInSeconds / 3600);
		const minutes = Math.floor((timeInSeconds - hours * 3600) / 60)
			.toString()
			.padStart(2, "0");
		const seconds = (timeInSeconds % 60).toString().padStart(2, "0");
		return `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`;
	};

	useEffect(() => {
		if (featureGates.has("2023_12-video-call")) {
			const interval = setInterval(() => {
				const route = segments.join("/");
				if (route !== "(tabs)/video-call") {
					fetchVideoCallMeetings();
				}
			}, 10000);
			return () => clearInterval(interval);
		}
	}, [segments]);

	useEffect(() => {
		if (seconds <= 0) {
			return;
		}

		const timer = setInterval(() => {
			setSeconds(seconds - 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [seconds]);

	return (
		<Modal transparent visible={visible}>
			<FansView
				width="screen"
				height="screen"
				position="relative"
				padding={{ x: 18 }}
				style={tw.style(
					"bg-fans-black/70 justify-end",
					"pb-[68px] md:pb-10",
				)}
			>
				<FypSvg
					svg={GemTitleSvg}
					color="fans-white"
					width={208}
					height={40}
					style={tw.style(
						"absolute top-[55px] left-[140px]",
						"hidden md:flex",
					)}
				/>

				<FansIconButton
					size={25}
					backgroundColor="bg-fans-white/30"
					onPress={handleClose}
					style={tw.style(
						"absolute top-4 right-[18px] z-10 md:hidden",
					)}
				>
					<FypSvg
						svg={CloseSvg}
						width={10}
						height={10}
						color="fans-white"
					/>
				</FansIconButton>
				{videoCall ? (
					<Fragment>
						<FypText
							fontSize={42}
							lineHeight={56}
							fontWeight={600}
							textAlign="center"
							style={tw.style(
								"md:hidden mt-[22px] text-fans-white mb-25",
							)}
						>
							{formatTime(seconds)}
						</FypText>
						<FansView
							alignItems="center"
							style={tw.style(
								!tw.prefixMatch("md") ? "flex-1" : "",
							)}
						>
							<FansView
								position="relative"
								width={{ xs: 109, md: 137 }}
								height={{ xs: 109, md: 137 }}
								style={tw.style("mb-5 md:mb-7")}
							>
								<UserAvatar
									image={attendant.avatar}
									size={
										tw.prefixMatch("md") ? "137px" : "109px"
									}
								/>
								<FypLinearGradientView
									colors={["#1d21E5", "#a854f5", "#d885ff"]}
									width={{ xs: 42, md: 57 }}
									height={{ xs: 42, md: 57 }}
									borderRadius={57}
									alignItems="center"
									justifyContent="center"
									position="absolute"
									style={tw.style(
										"border-[4px] border-fans-black-39 bottom-[-10px] right-0",
									)}
								>
									<FypSvg
										svg={VideoRecordSvg}
										width={{ xs: 18, md: 26 }}
										height={{ xs: 17, md: 26 }}
										color="fans-white"
									/>
								</FypLinearGradientView>
							</FansView>
							{attendant.displayName ? (
								<FypText
									fontSize={23}
									lineHeight={31}
									fontWeight={700}
									textAlign="center"
									style={tw.style(
										"text-fans-white mb-8 md:mb-[66px]",
									)}
								>
									Video call with{`\n`}
									{attendant.displayName}
								</FypText>
							) : null}

							<FansView
								width={60}
								height={30}
								borderRadius={30}
								margin={{ b: 15 }}
								justifyContent="center"
								style={tw.style(
									"bg-fans-grey-70 hidden md:flex",
								)}
							>
								<FypText
									fontSize={13}
									fontWeight={600}
									lineHeight={17}
									textAlign="center"
									style={tw.style("text-fans-white")}
								>
									NOW
								</FypText>
							</FansView>
							<FypText
								fontSize={20}
								fontWeight={500}
								lineHeight={28}
								textAlign="center"
								style={tw.style(
									"text-fans-white mb-10 md:mb-[66px] hidden md:flex",
								)}
							>
								{`${moment(videoCall.startDate).format(
									"dddd DD, MMM",
								)}${`\n`}${moment(videoCall.startDate).format(
									"hh A",
								)}`}
							</FypText>

							<FansView
								style={tw.style(
									"flex-col-reverse md:flex-col gap-[68px] md:gap-30",
									tw.prefixMatch("md")
										? ""
										: "flex-1 justify-between",
								)}
							>
								<FansView alignItems="center">
									<FansView margin={{ b: 14 }} width="full">
										<FansView
											pressableProps={{
												onPress: handleAcceptCall,
											}}
										>
											<FypLinearGradientView
												colors={
													tw.prefixMatch("md")
														? ["#a854f5", "#a854f5"]
														: ["#1d21e5", "#d885ff"]
												}
												width="full"
												height={42}
												borderRadius={42}
												alignItems="center"
												justifyContent="center"
												style={tw.style(
													"bg-fans-purple max-w-[358px] mx-auto",
												)}
											>
												<FypText
													fontSize={19}
													lineHeight={26}
													fontWeight={700}
													textAlign="center"
													style={tw.style(
														"text-fans-white",
													)}
												>
													Join video call
												</FypText>
											</FypLinearGradientView>
										</FansView>
									</FansView>
									<FypText
										fontSize={17}
										lineHeight={22}
										fontWeight={600}
										textAlign="center"
										style={tw.style("text-fans-white")}
										onPress={handleCancelCall}
									>
										Cancel call
									</FypText>
								</FansView>

								<FansView alignItems="center">
									<FansView
										flexDirection="row"
										alignItems="center"
										justifyContent="between"
										height={34}
										width={184}
										borderRadius={34}
										padding={{ l: 24, r: 18 }}
										style={tw.style(
											"bg-fans-grey-70 mb-3 md:mb-6",
											isRecordAll && "bg-fans-white",
										)}
										pressableProps={{
											onPress: () =>
												setIsRecordAll(!isRecordAll),
										}}
									>
										<FypText
											fontSize={17}
											lineHeight={22}
											style={tw.style(
												"text-fans-white",
												isRecordAll &&
													"text-fans-black",
											)}
										>
											Record call
										</FypText>
										<FansView
											flexDirection="row"
											alignItems="center"
											gap={3}
										>
											{isRecordAll && (
												<FansView
													width={8}
													height={8}
													borderRadius={8}
													style={tw.style(
														"bg-fans-red",
													)}
												></FansView>
											)}
											<FypText
												fontSize={15}
												lineHeight={20}
												fontWeight={500}
												style={tw.style(
													"text-fans-white text:bg-fans-black-1d",
													isRecordAll &&
														"text-fans-red",
												)}
											>
												{isRecordAll ? "ON" : "OFF"}
											</FypText>
										</FansView>
									</FansView>
									<FypText
										fontSize={16}
										lineHeight={21}
										textAlign="center"
										style={tw.style(
											"text-fans-grey-b1 max-w-[468px]",
										)}
									>
										When turned on, recording will only made
										available for you to re-watch, and will
										not be distributed to any third parties
									</FypText>
								</FansView>
							</FansView>
						</FansView>
					</Fragment>
				) : null}
			</FansView>
		</Modal>
	);
};

export default JoinVideoCallModal;
