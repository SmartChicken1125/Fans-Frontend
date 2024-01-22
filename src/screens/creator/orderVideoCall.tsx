import {
	OutlinedDollarSvg,
	OutlinedInfoSvg,
	Clock1Svg,
	VideoRecordSvg,
	StarCheckSvg,
	ChatSvg,
	ShopSvg,
	CalendarSvg,
	ChevronLeftSvg,
	ChevronRightSvg,
	PlusSvg,
} from "@assets/svgs/common";
import { MoneyGuarantee } from "@components/chat/videoCalls";
import AvatarWithStatus from "@components/common/AvatarWithStatus";
import { ContentPreferencesList } from "@components/common/ContentPreferencesList";
import FormControl from "@components/common/FormControl";
import {
	FypDropdown,
	FypLinearGradientView,
	FypSvg,
	FypText,
	FypLink,
	FypCollapsible,
} from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout from "@components/common/layout";
import PaymentMethodDropdown from "@components/common/paymentMethodDropdown";
import { FansView, FansDivider, FansIconButton } from "@components/controls";
import { AddPaymentCardDialog } from "@components/profiles";
import { defaultVideoCallDurationFormData } from "@constants/defaultFormData";
import { timezones } from "@constants/timezones";
import { defaultProfileStateData } from "@context/state/profileState";
import { useAppContext } from "@context/useAppContext";
import { cdnURL } from "@helper/Utils";
import { getCreatorProfileByLink } from "@helper/endpoints/profile/apis";
import {
	getProfileVideoCallSettings,
	getVideoCallTimeframes,
} from "@helper/endpoints/settings/apis";
import { getPaymentMethods } from "@helper/endpoints/subscriptions/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CreatorProfileNavigationStacks } from "@usertypes/navigations";
import {
	IProfile,
	IVideoCallDuration,
	IVideoCallSetting,
	ICalendarDate,
	IPaymentMethod,
	ITimeframeInterval,
} from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import { Video } from "expo-av";
import { createURL } from "expo-linking";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { FC, useEffect, useState, useCallback } from "react";
import { Image, ScrollView } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import Toast from "react-native-toast-message";

type ICallTimeType = "now" | "schedule";

const ChatWithUsBlock = () => {
	const [openLink] = useBlankLink();
	const handlePressChat = () => {
		openLink("https://support.fyp.fans/");
	};
	return (
		<FansView
			borderRadius={15}
			padding={{ t: 20, b: 28, x: 18 }}
			style={tw.style(
				"border border-fans-grey-de dark:border-fans-grey-50",
			)}
		>
			<FypText
				fontSize={17}
				lineHeight={22}
				fontWeight={600}
				textAlign="center"
				margin={{ b: 16 }}
			>
				Need help?
			</FypText>
			<FansView
				height={42}
				flexDirection="row"
				alignItems="center"
				justifyContent="center"
				borderRadius={42}
				gap={10}
				style={tw.style("border border-fans-purple")}
				pressableProps={{
					onPress: handlePressChat,
				}}
			>
				<FypSvg
					svg={ChatSvg}
					width={15}
					height={15}
					color="fans-purple"
				/>
				<FypText
					fontSize={19}
					lineHeight={26}
					fontWeight={700}
					style={tw.style("text-fans-purple")}
				>
					Chat with us
				</FypText>
			</FansView>
		</FansView>
	);
};

interface TimeCellProps {
	selected: boolean;
	onSelect: () => void;
}

const TimeCell: FC<TimeCellProps> = (props) => {
	const { selected, onSelect } = props;
	return (
		<FansView
			width="full"
			height={42}
			flexDirection="row"
			alignItems="center"
			justifyContent="center"
			gap={16}
			style={tw.style(
				selected
					? "border-[2px] border-fans-purple"
					: "border border-fans-grey dark:border-fans-grey-43",
			)}
			borderRadius={42}
			pressableProps={{
				onPress: onSelect,
			}}
		>
			<FypText fontSize={17} fontWeight={600} lineHeight={22}>
				10:15 - 10:30
			</FypText>
			<FypText fontSize={17} fontWeight={600} lineHeight={22}>
				PM
			</FypText>
		</FansView>
	);
};

interface IScheduleForm {
	date: ICalendarDate;
	timezone: string;
}

interface ScheduleFormProps {
	collapsed: boolean;
	formData: IScheduleForm;
	timeframes: ITimeframeInterval[];
	onChangeData: (name: string, val: ICalendarDate | string) => void;
}

const ScheduleForm: FC<ScheduleFormProps> = (props) => {
	const { collapsed, formData, onChangeData, timeframes } = props;

	const [openDatePicker, setOpenDatePicker] = useState(false);

	const handleShowMore = () => {};

	const onDismissSingle = useCallback(() => {
		setOpenDatePicker(false);
	}, [openDatePicker]);

	const onConfirmSingle = useCallback(
		(params: { date: ICalendarDate }) => {
			setOpenDatePicker(false);
			onChangeData("date", params.date);
		},
		[openDatePicker, onChangeData],
	);

	const onPressNextDay = () => {
		onChangeData("date", moment(formData.date).add(1, "d").toDate());
	};

	const onPressPrevDay = () => {
		onChangeData("date", moment(formData.date).add(-1, "d").toDate());
	};

	const getTimeOptions = () => {
		const weekday = moment(formData.date).weekday();
		const dayTimeFrames = timeframes
			.filter((el) => el.day === weekday)
			.sort((d1, d2) =>
				d1.startTime > d2.startTime
					? 1
					: d1.startTime < d2.startTime
					? -1
					: 0,
			);
	};

	useEffect(() => {
		getTimeOptions();
	}, [formData.date]);

	return (
		<FypCollapsible collapsed={collapsed}>
			<FansView margin={{ b: 30 }}>
				<FansView margin={{ b: 32 }}>
					<FypText
						fontSize={17}
						lineHeight={22}
						fontWeight={600}
						margin={{ b: 15 }}
						style={tw.style("text-fans-black dark:text-fans-white")}
					>
						Time Zone
					</FypText>
					<FypDropdown
						data={timezones}
						value={formData.timezone}
						onSelect={(val) =>
							onChangeData("timezone", val as string)
						}
					/>
				</FansView>
				<FansView margin={{ b: 32 }} gap={13}>
					<FypText fontSize={17} fontWeight={600} lineHeight={22}>
						Select date
					</FypText>

					<FansView
						flexDirection="row"
						alignItems="center"
						gap={{ xs: 28, md: 64 }}
					>
						<FansView
							height={63}
							borderRadius={15}
							flexDirection="row"
							justifyContent="center"
							alignItems="center"
							position="relative"
							flex="1"
							gap={50}
							style={tw.style(
								"border border-fans-grey dark:border-fans-grey-43",
							)}
						>
							<FansIconButton
								size={30}
								backgroundColor="bg-transparent"
								onPress={onPressPrevDay}
								disabled={
									new Date().toJSON().split("T")[0] ===
									formData.date?.toJSON().split("T")[0]
								}
							>
								<FypSvg
									svg={ChevronLeftSvg}
									width={9}
									height={18}
									color="fans-purple"
								/>
							</FansIconButton>
							<FypText
								fontSize={19}
								lineHeight={26}
								fontWeight={700}
								textAlign="center"
								style={tw.style("text-fans-purple w-[130px]")}
							>
								{moment(formData.date).format("MMM DD, YYYY")}
							</FypText>
							<FansIconButton
								size={30}
								backgroundColor="bg-transparent"
								onPress={onPressNextDay}
							>
								<FypSvg
									svg={ChevronRightSvg}
									width={9}
									height={18}
									color="fans-purple"
								/>
							</FansIconButton>
						</FansView>
						<FansIconButton
							size={34}
							backgroundColor="bg-fans-grey-f0 dark:bg-fans-grey-43"
							onPress={() => setOpenDatePicker(true)}
						>
							<FypSvg
								svg={CalendarSvg}
								width={14}
								height={16}
								color="fans-black dark:fans-white"
							/>
						</FansIconButton>
					</FansView>
				</FansView>
				<FansView margin={{ b: 13 }}>
					<FypText
						fontSize={17}
						fontWeight={600}
						lineHeight={22}
						margin={{ b: 12 }}
					>
						Select time
					</FypText>
					<FansView
						flexDirection="row"
						flexWrap="wrap"
						style={tw.style("gap-x-[14px] gap-y-4")}
					>
						<FansView flex="1">
							<TimeCell selected onSelect={() => {}} />
						</FansView>
						<FansView flex="1">
							<TimeCell selected={false} onSelect={() => {}} />
						</FansView>
					</FansView>
				</FansView>

				<FansView
					flexDirection="row"
					alignItems="center"
					gap={15}
					justifyContent="center"
					pressableProps={{
						onPress: handleShowMore,
					}}
				>
					<FypSvg
						svg={PlusSvg}
						width={9}
						height={9}
						color="fans-purple"
					/>
					<FypText
						fontSize={17}
						fontWeight={600}
						style={tw.style("text-fans-purple")}
					>
						Show more
					</FypText>
				</FansView>
			</FansView>
			<DatePickerModal
				locale="en"
				mode="single"
				visible={openDatePicker}
				onDismiss={onDismissSingle}
				date={formData.date}
				onConfirm={onConfirmSingle}
				validRange={{ startDate: new Date() }}
			/>
		</FypCollapsible>
	);
};

const OrderVideoCallScreen = (
	props: NativeStackScreenProps<
		CreatorProfileNavigationStacks,
		"OrderVideoCallScreen"
	>,
) => {
	const router = useRouter();
	const { state, dispatch } = useAppContext();
	const { creatorUsername: username } = state.common;
	const [openLink] = useBlankLink();

	const [profile, setProfile] = useState<IProfile>(defaultProfileStateData);
	const [settings, setSettings] = useState<IVideoCallSetting>();
	const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
	const [timeframes, setTimeframes] = useState<ITimeframeInterval[]>([]);
	const [callTimeType, setCallTimeType] = useState<ICallTimeType>("now");
	const [duration, setDuration] = useState<IVideoCallDuration>(
		defaultVideoCallDurationFormData,
	);
	const [payment, setPayment] = useState("");
	const [topic, setTopic] = useState("");
	const [scheduleForm, setScheduleForm] = useState<IScheduleForm>({
		date: new Date(),
		timezone: "",
	});
	const [openPaymentModal, setOpenPaymentModal] = useState(false);

	const timeOptions = [
		{ data: "now", label: "Right now" },
		{ data: "schedule", label: "Schedule" },
	];

	const handlePressTerms = () => {
		const url = createURL(`/terms`);
		openLink(url);
	};

	const handlePressOrderCall = () => {};

	const handleChangeScheduleForm = (
		name: string,
		val: ICalendarDate | string,
	) => {
		setScheduleForm({
			...scheduleForm,
			[name]: val,
		});
	};

	const handleAddPaymentMethod = () => {
		setOpenPaymentModal(true);
	};

	const fetchVideoCallSettings = async () => {
		const resp = await getProfileVideoCallSettings({ id: profile.id });
		if (resp.ok) {
			setSettings({
				...resp.data,
				meetingDurations: resp.data.meetingDurations.sort((d1, d2) =>
					d1.length > d2.length ? 1 : d1.length < d2.length ? -1 : 0,
				),
			});
		}
	};

	const fetchProfileData = async () => {
		const resp = await getCreatorProfileByLink({
			profileLink: username as string,
		});
		if (resp.ok) {
			setProfile(resp.data);
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const getPaymentMethodsData = async () => {
		const paymentMethodsData = await getPaymentMethods();
		if (paymentMethodsData.ok) {
			setPaymentMethods(paymentMethodsData.data);
		}
	};

	const fetchTimeframes = async () => {
		const resp = await getVideoCallTimeframes();
		if (resp.ok) {
			setTimeframes(resp.data);
		}
	};

	useEffect(() => {
		fetchProfileData();
		getPaymentMethodsData();
		fetchTimeframes();
	}, [username]);

	useEffect(() => {
		if (profile.id !== "0") {
			fetchVideoCallSettings();
		}
	}, [profile.id]);

	return (
		<AppLayout
			title={`${profile.displayName} | FYP.Fans`}
			description={profile.bio}
		>
			<FansView flex="1" position="relative">
				<ScrollView style={tw.style("flex-1")}>
					<FansView flexDirection="row" flex="1">
						<FansView
							flex="1"
							alignItems="center"
							style={tw.style(
								"md:border-r border-fans-grey-f0 dark:border-fans-grey-43",
							)}
						>
							<FansView
								flex="1"
								position="relative"
								style={tw.style(
									"w-full md:max-w-[710px] bg-fans-white dark:bg-fans-black-1d",
								)}
							>
								<CustomTopNavBar
									title="Order a 1:1 video call"
									onClickLeft={() => router.back()}
								/>
								<FansView
									style={tw.style(
										"md:pt-10 mb-[26px] md:mb-[66px]",
									)}
								>
									<FansView
										height={85}
										style={tw.style("md:hidden")}
									>
										{profile.cover.length === 0 ? (
											<FypLinearGradientView
												colors={["#8a49f1", "#d885ff"]}
												position="relative"
												height={85}
											/>
										) : (
											<Image
												source={{
													uri: cdnURL(
														profile.cover[0],
													),
												}}
												style={tw.style(
													"h-full w-full",
												)}
											/>
										)}
									</FansView>
									<FansView
										gap={{ xs: 18, md: 24 }}
										style={tw.style(
											"mt-[-43px] md:mt-0 flex flex-col md:flex-row md:items-center",
										)}
									>
										<FansView
											width={117}
											height={117}
											position="relative"
											padding={4}
											borderRadius={109}
											alignItems="center"
											justifyContent="center"
											style={tw.style(
												"mx-auto md:ml-0 bg-fans-white dark:bg-fans-black-1d",
											)}
										>
											<AvatarWithStatus
												size={109}
												avatar={profile.avatar}
											/>
											<FypLinearGradientView
												colors={["#d885ff", "#1d21e5"]}
												width={42}
												height={42}
												borderRadius={42}
												alignItems="center"
												justifyContent="center"
												position="absolute"
												style={tw.style(
													"border-[4px] border-fans-white dark:border-fans-black-1d",
													"right-[6px] bottom-[-8px]",
												)}
											>
												<FypSvg
													svg={VideoRecordSvg}
													width={18}
													height={17}
													color="fans-white"
												/>
											</FypLinearGradientView>
										</FansView>
										<FansView
											flex="1"
											style={tw.style(
												"px-[18px] md:px-0 items-center md:items-start",
											)}
										>
											{profile.displayName ? (
												<FansView
													flexDirection="row"
													alignItems="center"
													gap={15}
													style={tw.style("mb-3")}
												>
													<FypText
														fontSize={23}
														lineHeight={31}
														fontWeight={700}
													>
														{profile.displayName}
													</FypText>
													<FypSvg
														svg={StarCheckSvg}
														width={16}
														height={15}
													/>
												</FansView>
											) : null}

											<FypText
												fontSize={16}
												lineHeight={21}
												style={tw.style(
													"mb-3 text-center md:text-left",
												)}
												numberOfLines={2}
											>
												{profile.bio}
											</FypText>
											<FansView
												flexDirection="row"
												alignItems="center"
												gap={32}
											>
												<FansView
													flexDirection="row"
													alignItems="center"
													gap={6}
												>
													<FypSvg
														svg={Clock1Svg}
														width={19}
														height={19}
														color="fans-purple"
													/>
													<FypText
														fontSize={15}
														lineHeight={21}
														fontWeight={600}
													>
														24 HR AVAILABLE
													</FypText>
												</FansView>
												<FansView
													flexDirection="row"
													alignItems="center"
													gap={6}
												>
													<FypSvg
														svg={OutlinedDollarSvg}
														width={17}
														height={17}
														color="fans-purple"
													/>
													<FypText
														fontSize={15}
														lineHeight={21}
														fontWeight={600}
													>
														{`$${duration.price}-${duration.length} PRICES`}
													</FypText>
												</FansView>
											</FansView>
										</FansView>
									</FansView>
								</FansView>
								<FansView
									style={tw.style("px-[18px] md:px-0 pb-10")}
								>
									<FansView
										padding={{ y: 18, x: 18 }}
										borderRadius={15}
										style={tw.style("bg-fans-purple")}
										gap={14}
									>
										<FypText
											fontSize={16}
											lineHeight={21}
											textAlign="center"
											style={tw.style("text-white")}
										>
											<FypSvg
												svg={OutlinedInfoSvg}
												width={15}
												height={15}
												color="fans-white"
											/>
											{"  "}
											We need to verify you’re 18 or
											older. Please allow access to your
											camera
										</FypText>
										<FansView
											width={170}
											height={42}
											borderRadius={42}
											justifyContent="center"
											style={tw.style(
												"bg-fans-white mx-auto",
											)}
										>
											<FypText
												fontSize={19}
												lineHeight={26}
												fontWeight={700}
												textAlign="center"
												style={tw.style(
													"text-fans-purple",
												)}
											>
												Verify
											</FypText>
										</FansView>
									</FansView>
									<FansView
										height={{ xs: 234, md: 436 }}
										position="relative"
										style={tw.style(
											"mt-[26px] md:mt-[30px] mb-7 md:mb-8",
										)}
									>
										<Video
											source={require("@assets/video/video-1.mp4")}
											style={tw.style(
												"w-full h-full rounded-[7px]",
											)}
										/>
									</FansView>
									<FypText
										fontWeight={600}
										fontSize={17}
										style={tw.style("mb-5")}
									>
										Types of video calls offered
									</FypText>
									{settings?.contentPreferences && (
										<ContentPreferencesList
											availableOptionIds={
												settings?.contentPreferences ??
												[]
											}
										/>
									)}
									{settings?.contentPreferences ? (
										<FypText
											fontSize={16}
											margin={{ t: 20 }}
										>
											{settings?.customContentPreferences}
										</FypText>
									) : null}
									<FansDivider
										color="fans-grey-f0"
										style={tw.style(
											"mt-6 md:mt-[34px] mb-[18px] md:mb-10",
										)}
									/>
									<FypText
										fontWeight={600}
										fontSize={19}
										margin={{ b: 10 }}
									>
										Make your order
									</FypText>
									<FypText
										fontSize={16}
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
											"mb-[26px]",
										)}
									>
										Order a video call with me, just pick
										the date and time you prefer. Can’t wait
										to meet you! We’ll have fun!
									</FypText>
									<FypText
										fontWeight={600}
										fontSize={17}
										margin={{ b: 15 }}
									>
										Duration & prices
									</FypText>
									<FansView
										flexDirection="row"
										flexWrap="wrap"
										style={tw.style("flex mb-9 mx-[-6px] ")}
									>
										{settings?.meetingDurations.map(
											(el) => (
												<FansView
													key={el.length}
													padding={3}
													style={tw.style(
														"w-1/3 md:w-1/4",
													)}
												>
													<FansView
														height={77}
														borderRadius={7}
														justifyContent="center"
														style={tw.style(
															"border",
															duration.length ===
																el.length
																? "border-fans-purple border-[2px]"
																: "border-fans-grey-f0 dark:border-fans-grey-43",
														)}
														pressableProps={{
															onPress: () =>
																setDuration(el),
														}}
													>
														<FypText
															fontSize={16}
															fontWeight={500}
															textAlign="center"
															lineHeight={21}
														>
															{`${el.length} min`}
														</FypText>
														<FypText
															fontSize={19}
															fontWeight={600}
															textAlign="center"
															lineHeight={26}
															style={tw.style(
																"text-fans-purple",
															)}
														>
															{`$${el.price}`}
														</FypText>
													</FansView>
												</FansView>
											),
										)}
									</FansView>
									<FansView margin={{ b: 30 }}>
										<FypText
											fontWeight={600}
											fontSize={17}
											margin={{ b: 15 }}
										>
											When
										</FypText>
										<FypDropdown
											data={timeOptions}
											value={callTimeType}
											onSelect={(val) =>
												setCallTimeType(
													val as ICallTimeType,
												)
											}
											placeholder="Select Time"
											valueField="data"
										/>
									</FansView>

									<ScheduleForm
										collapsed={callTimeType === "now"}
										formData={scheduleForm}
										onChangeData={handleChangeScheduleForm}
										timeframes={timeframes}
									/>

									<FansView margin={{ b: 30 }}>
										<FormControl
											label="Describe call topics (optional)"
											value={topic}
											onChangeText={setTopic}
											placeholder="Describe topics for your video call..."
											isTextArea
											maxLength={1000}
										/>
									</FansView>
									<FansView
										flexDirection="row"
										alignItems="center"
										margin={{ b: 30 }}
										gap={9}
									>
										<FypSvg
											svg={ShopSvg}
											width={14}
											height={17}
											color="fans-purple"
										/>
										<FypText fontSize={17} fontWeight={600}>
											{`${duration.length} MINUTE CALL WITH (CREATOR)`}
										</FypText>
									</FansView>
									<FansView>
										<FypText
											fontSize={17}
											lineHeight={22}
											fontWeight={600}
											margin={{ b: 14 }}
										>
											Total
										</FypText>
										<FypText
											fontSize={16}
											lineHeight={21}
											margin={{ b: 5 }}
											style={tw.style(
												"text-fans-grey-70 dark:text-fans-grey-b1",
											)}
										>
											$15.00 USD + $1.50 Platform fee
										</FypText>
										<FypText
											fontSize={21}
											fontWeight={600}
											lineHeight={28}
											margin={{ b: 18 }}
										>
											$16.50
										</FypText>
										<FansView flexDirection="row">
											<FansView
												flexDirection="row"
												alignItems="center"
												borderRadius={30}
												gap={7}
												padding={{ l: 12, r: 23, y: 6 }}
												style={tw.style(
													"bg-fans-purple-f6 dark:bg-fans-purple-47",
												)}
											>
												<FypSvg
													svg={OutlinedInfoSvg}
													width={13}
													height={13}
													color="fans-purple"
												/>
												<FypText
													fontSize={13}
													lineHeight={17}
													fontWeight={700}
													style={tw.style(
														"text-fans-purple",
													)}
												>
													ONLY CHARGED IF ACCEPTED
												</FypText>
											</FansView>
										</FansView>
									</FansView>
									<FansDivider
										style={tw.style("mt-[26px] mb-5")}
									/>
									<FansView margin={{ b: 22 }}>
										<FypText
											fontSize={17}
											lineHeight={22}
											fontWeight={600}
											margin={{ b: 15 }}
										>
											Payment method
										</FypText>
										<PaymentMethodDropdown
											options={paymentMethods}
											value={payment}
											onChange={(
												customerPaymentProfileId,
											) =>
												setPayment(
													customerPaymentProfileId,
												)
											}
											handleAddMethod={
												handleAddPaymentMethod
											}
										/>
									</FansView>
									<FansView
										height={42}
										borderRadius={42}
										alignItems="center"
										justifyContent="center"
										margin={{ b: 18 }}
										style={tw.style("bg-fans-purple")}
									>
										<FypText
											fontSize={19}
											lineHeight={26}
											fontWeight={700}
											style={tw.style("text-fans-white")}
										>
											Pay $16.50
										</FypText>
									</FansView>
									<FypText
										fontSize={12}
										lineHeight={21}
										textAlign="center"
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										By moving forward, you agree to our{" "}
										<FypLink
											fontSize={12}
											lineHeight={21}
											style={tw.style("text-fans-purple")}
											onPress={handlePressTerms}
										>
											Terms of Use.
										</FypLink>
									</FypText>
									<FansView
										margin={{ t: 32 }}
										style={tw.style("md:hidden")}
									>
										<MoneyGuarantee />
									</FansView>
									<FansView
										margin={{ t: 40 }}
										style={tw.style("md:hidden")}
									>
										<ChatWithUsBlock />
									</FansView>
								</FansView>
							</FansView>
						</FansView>
						<FansView
							style={tw.style(
								"hidden pt-15.5 2lg:flex px-5 w-100 xl:w-[536px] xl:px-10 xl:pr-[140px] 2lg:min-h-screen",
							)}
						>
							<FansView
								height={42}
								borderRadius={42}
								justifyContent="center"
								style={tw.style("bg-fans-purple")}
								pressableProps={{
									onPress: handlePressOrderCall,
								}}
							>
								<FypText
									fontSize={19}
									lineHeight={26}
									fontWeight={700}
									textAlign="center"
									style={tw.style("text-fans-white")}
								>
									Order 1:1 video call
								</FypText>
							</FansView>
							<FansView margin={{ t: 32 }}>
								<MoneyGuarantee />
							</FansView>
							<FansView margin={{ t: 40 }}>
								<ChatWithUsBlock />
							</FansView>
						</FansView>
					</FansView>
				</ScrollView>
			</FansView>
			<AddPaymentCardDialog
				visible={openPaymentModal}
				handleClose={() => setOpenPaymentModal(false)}
				handleToggleModal={setOpenPaymentModal}
			/>
		</AppLayout>
	);
};

export default OrderVideoCallScreen;
