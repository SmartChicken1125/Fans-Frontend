import {
	OutlinedDollarSvg,
	OutlinedInfoSvg,
	Clock1Svg,
	VideoRecordSvg,
	StarCheckSvg,
	FilledShopSvg,
	CalendarSvg,
	ChevronLeftSvg,
	ChevronRightSvg,
	PlusSvg,
	ChevronDownSvg,
	FilledSettingSvg,
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
	FypNullableView,
	FypButton2,
	FypCheckbox,
} from "@components/common/base";
import CustomTopNavBar from "@components/common/customTopNavBar";
import AppLayout from "@components/common/layout";
import PaymentMethodDropdown from "@components/common/paymentMethodDropdown";
import {
	FansView,
	FansDivider,
	FansIconButton,
	FansGap,
} from "@components/controls";
import { AddPaymentCardDialog } from "@components/profiles";
import {
	AgeConfirmDialog,
	ChatWithUsBlock,
	CreatorDurationPriceItem,
	OrderSummary,
	GuideItem,
} from "@components/videoCall";
import {
	testPaymentToken,
	defaultCreatorVideoCallSettingsData,
} from "@constants/common";
import { defaultVideoCallDurationFormData } from "@constants/defaultFormData";
import { timezones } from "@constants/timezones";
import { defaultProfileStateData } from "@context/state/profileState";
import { useAppContext } from "@context/useAppContext";
import { cdnURL, formatPrice } from "@helper/Utils";
import { getCreatorProfileByLink } from "@helper/endpoints/profile/apis";
import { getPaymentMethods } from "@helper/endpoints/subscriptions/apis";
import {
	getProfileVideoCallSettings,
	getAvailableIntervals,
	getVideoCallMeetingPrice,
	createVideoCallMeeting,
} from "@helper/endpoints/videoCalls/apis";
import tw from "@lib/tailwind";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFeatureGates } from "@state/featureGates";
import { VideoCallStackParams } from "@usertypes/navigations";
import {
	IProfile,
	IVideoDuration,
	ICalendarDate,
	IPaymentMethod,
	IAvailableInterval,
	ICreatorVideoCallSettings,
} from "@usertypes/types";
import { useBlankLink } from "@utils/useBlankLink";
import { createURL } from "expo-linking";
import { getIpAddressAsync } from "expo-network";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { FC, useEffect, useState, useCallback, useRef } from "react";
import { Image, ScrollView } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";
import Toast from "react-native-toast-message";

type ICallTimeType = "now" | "schedule";

interface TimeCellProps {
	selected: boolean;
	interval: IAvailableInterval;
	timezone: string;
	onSelect: () => void;
}

const TimeCell: FC<TimeCellProps> = (props) => {
	const { selected, onSelect, interval, timezone } = props;

	const getDateString = () => {
		const offset =
			timezones.find((el) => el.tzCode === timezone)?.utc ?? "+00:00";

		return [
			moment(interval.startDate).zone(offset).format("HH:mm") +
				" - " +
				moment(interval.startDate)
					.add(interval.duration, "minutes")
					.zone(offset)
					.format("HH:mm"),
			moment(interval.startDate)
				.add(interval.duration, "minutes")
				.zone(offset)
				.format("A"),
		];
	};

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
				{getDateString()[0]}
			</FypText>
			<FypText fontSize={17} fontWeight={600} lineHeight={22}>
				{getDateString()[1]}
			</FypText>
		</FansView>
	);
};

interface IScheduleForm {
	date: ICalendarDate;
	timezone: string;
	startDate: string;
}

interface ScheduleFormProps {
	collapsed: boolean;
	formData: IScheduleForm;
	intervals: IAvailableInterval[];
	onChangeData: (name: string, val: ICalendarDate | string) => void;
}

const ScheduleForm: FC<ScheduleFormProps> = (props) => {
	const {
		collapsed,
		formData,
		onChangeData,
		intervals: weeklyIntervals,
	} = props;
	const offset =
		timezones.find((el) => el.tzCode === formData.timezone)?.utc ??
		"+00:00";

	const intervals = weeklyIntervals.filter(
		(el) =>
			moment(el.startDate).zone(offset).format("YYYY-MM-DD") ===
			formData.date?.toJSON().split("T")[0],
	);

	const [showMore, setShowMore] = useState(false);
	const [openDatePicker, setOpenDatePicker] = useState(false);

	const handleShowMore = () => {
		setShowMore(!showMore);
	};

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
						search
						data={timezones.map((tz) => ({
							data: tz.tzCode,
							label: tz.name,
						}))}
						value={formData.timezone}
						onSelect={(val) =>
							onChangeData("timezone", val as string)
						}
					/>
				</FansView>
				<FypCollapsible collapsed={formData.timezone === ""}>
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
									style={tw.style(
										"text-fans-purple w-[130px]",
									)}
								>
									{moment(formData.date).format(
										"MMM DD, YYYY",
									)}
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
							style={tw.style("mx-[-7px] gap-y-4")}
						>
							{intervals
								.filter(
									(el, index) =>
										index <
										(showMore ? intervals.length : 10),
								)
								.map((interval) => (
									<FansView
										style={tw.style("w-1/2")}
										padding={{ x: 7 }}
										key={interval.startDate}
									>
										<TimeCell
											interval={interval}
											timezone={formData.timezone}
											selected={
												interval.startDate ===
												formData.startDate
											}
											onSelect={() =>
												onChangeData(
													"startDate",
													interval.startDate,
												)
											}
										/>
									</FansView>
								))}
						</FansView>
					</FansView>
					{intervals.length > 10 ? (
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
								{showMore ? "Show less" : "Show more"}
							</FypText>
						</FansView>
					) : null}
				</FypCollapsible>
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

interface TimeTypeButtonProps {
	value: ICallTimeType;
	onChange: (val: ICallTimeType) => void;
}

const TimeTypeButton: FC<TimeTypeButtonProps> = (props) => {
	const { value, onChange } = props;
	return (
		<FansView
			flexDirection="row"
			alignItems="center"
			padding={{ x: 4, y: 5 }}
			height={42}
			borderRadius={42}
			style={tw.style(
				value === "now" ? "bg-fans-grey-48" : "bg-fans-purple",
			)}
		>
			<FansView
				flex="1"
				borderRadius={42}
				justifyContent="center"
				alignItems="center"
				height="full"
				style={tw.style(value === "now" ? "bg-fans-white" : "")}
				pressableProps={{
					onPress: () => onChange("now"),
				}}
			>
				<FypText
					fontSize={18}
					fontWeight={value === "now" ? 600 : 500}
					style={tw.style(
						value === "now" ? "text-fans-black" : "text-fans-white",
					)}
				>
					Right now
				</FypText>
			</FansView>
			<FansView
				flex="1"
				borderRadius={42}
				justifyContent="center"
				alignItems="center"
				height="full"
				style={tw.style(value === "schedule" ? "bg-fans-white" : "")}
				pressableProps={{
					onPress: () => onChange("schedule"),
				}}
			>
				<FypText
					fontSize={18}
					fontWeight={value === "schedule" ? 600 : 500}
					style={tw.style(
						value === "schedule"
							? "text-fans-black"
							: "text-fans-white",
					)}
				>
					Schedule
				</FypText>
			</FansView>
		</FansView>
	);
};

const OrderVideoCallScreen = (
	props: NativeStackScreenProps<VideoCallStackParams, "Order">,
) => {
	const { route } = props;
	const { username } = route.params;
	const router = useRouter();
	const { state, dispatch } = useAppContext();
	const [openLink] = useBlankLink();
	const featureGates = useFeatureGates();

	const scrollRef = useRef<ScrollView>(null);

	const [profile, setProfile] = useState<IProfile>(defaultProfileStateData);
	const [settings, setSettings] = useState<ICreatorVideoCallSettings>(
		defaultCreatorVideoCallSettingsData,
	);
	const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
	const [callTimeType, setCallTimeType] = useState<ICallTimeType>("now");
	const [duration, setDuration] = useState<IVideoDuration>(
		defaultVideoCallDurationFormData,
	);
	const [payment, setPayment] = useState(testPaymentToken);
	const [topics, setTopics] = useState("");
	const [scheduleForm, setScheduleForm] = useState<IScheduleForm>({
		date: new Date(),
		timezone: "",
		startDate: "",
	});
	const [collapsedForm, setCollapsedForm] = useState(false);
	const [openPaymentModal, setOpenPaymentModal] = useState(false);
	const [intervalDateParams, setIntervalDateParams] = useState<{
		after: Date;
		before: Date;
	}>({
		after: moment(new Date()).add(-1, "d").toDate(),
		before: moment(new Date()).add(5, "d").toDate(),
	});
	const [availableIntervals, setAvailableIntervals] = useState<
		IAvailableInterval[]
	>([]);
	const [isConfirmed, setIsConfirmed] = useState(false);
	const [formPositionY, setFormPositionY] = useState(0);
	const [openAgeVerifyModal, setOpenAgeVerifyModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [price, setPrice] = useState(0);
	const [platformFee, setPlatformFee] = useState(0);
	const [vatFee, setVatFee] = useState(0);
	const [total, setTotal] = useState(0);

	const timeOptions = [
		{ data: "now", label: "Right now" },
		{ data: "schedule", label: "Schedule" },
	];

	useEffect(() => {
		const getVideoCallMeetingPriceData = async () => {
			if (!duration) return;

			const postbody = {
				hostId: profile.id,
				startDate:
					callTimeType === "now" ? "now" : scheduleForm.startDate,
				duration: duration.length,
				customerPaymentProfileId: payment,
				topics: topics,
			};

			const videoCallMeetingPriceData =
				await getVideoCallMeetingPrice(postbody);
			if (videoCallMeetingPriceData.ok) {
				setPrice(videoCallMeetingPriceData.data.amount);
				setPlatformFee(videoCallMeetingPriceData.data.platformFee);
				setVatFee(videoCallMeetingPriceData.data.vatFee);
				setTotal(videoCallMeetingPriceData.data.totalAmount);
			}
		};

		getVideoCallMeetingPriceData();
	}, [callTimeType, scheduleForm, duration, payment, topics]);

	const handlePressTerms = () => {
		const url = createURL(`/terms`);
		openLink(url);
	};

	const handlePressOrderCall = () => {
		scrollRef.current?.scrollTo({ y: formPositionY, animated: true });
	};

	const handleChangeScheduleForm = (
		name: string,
		val: ICalendarDate | string,
	) => {
		setScheduleForm({
			...scheduleForm,
			[name]: val,
		});
		if (name === "date") {
			const scheduleDate = val as ICalendarDate;
			if (
				scheduleDate &&
				(scheduleDate <
					moment(intervalDateParams.after).add(1, "d").toDate() ||
					scheduleDate >
						moment(intervalDateParams.before).add(-1, "d").toDate())
			) {
				setIntervalDateParams({
					after: moment(scheduleDate).add(-1, "d").toDate(),
					before: moment(scheduleDate).add(5, "d").toDate(),
				});
			}
		}
	};

	const handleAddPaymentMethod = () => {
		setOpenPaymentModal(true);
	};

	const fetchCreatorVideoCallSettings = async () => {
		const resp = await getProfileVideoCallSettings({ id: profile.id });

		if (resp.ok) {
			setSettings({
				...resp.data,
				meetingDurations: resp.data.meetingDurations.sort((d1, d2) =>
					d1.length > d2.length ? 1 : d1.length < d2.length ? -1 : 0,
				),
			});
			if (
				resp.data.sexualContentAllowed &&
				state.profile.user?.ageVerifyStatus !== "APPROVED"
			) {
				setOpenAgeVerifyModal(true);
			}
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

	const fetchAvailabilities = async () => {
		if (duration.length === 0) {
			return;
		}
		const params = {
			creatorId: profile.id,
			duration: duration.length,
			after: intervalDateParams.after,
			before: intervalDateParams.before,
		};
		const resp = await getAvailableIntervals(params);
		if (resp.ok) {
			setAvailableIntervals(resp.data.intervals);
		} else {
			setAvailableIntervals([]);
		}
	};

	const handleCreateMeeting = async () => {
		if (duration.length === 0) {
			Toast.show({
				type: "error",
				text1: "Please select duration.",
			});
			return;
		}
		if (callTimeType === "schedule" && scheduleForm.startDate === "") {
			Toast.show({
				type: "error",
				text1: "Please select time.",
			});
			return;
		}
		if (callTimeType === "now" && !isConfirmed) {
			Toast.show({
				type: "error",
				text1: "Please confirm availability",
			});
			return;
		}
		setIsLoading(true);
		const postbody = {
			hostId: profile.id,
			startDate: callTimeType === "now" ? "now" : scheduleForm.startDate,
			duration: duration.length,
			customerPaymentProfileId: payment,
			topics: topics,
		};

		const resp = await createVideoCallMeeting(postbody);
		setIsLoading(false);
		if (resp.ok) {
			Toast.show({
				type: "success",
				text1: "Succssfuly created!",
			});
			router.back();
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handleGoBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.push("/posts");
		}
	};

	const getOrderTimeString = () => {
		if (duration.id === "0") {
			return "";
		}
		if (callTimeType === "now") {
			const nowDate = new Date();
			return `${moment(nowDate).format("HH:mm")}-${moment(nowDate)
				.add(duration.length, "minutes")
				.format("HH:mm")} ${moment(nowDate).format("a")} (${
				duration.length
			} min)`;
		} else {
			if (scheduleForm.startDate === "") {
				return "";
			}
			return `${moment(scheduleForm.startDate).format("HH:mm")}-${moment(
				scheduleForm.startDate,
			)
				.add(duration.length, "minutes")
				.format("HH:mm")} ${moment(scheduleForm.startDate).format(
				"a",
			)} (${duration.length} min)`;
		}
	};

	const getGeoLocation = async () => {
		const ipAdress = await getIpAddressAsync();
		console.log(ipAdress);
	};

	useEffect(() => {
		fetchProfileData();
		getPaymentMethodsData();
		getGeoLocation();
	}, [username]);

	useEffect(() => {
		if (profile.id !== "0") {
			fetchCreatorVideoCallSettings();
		}
	}, [profile.id]);

	useEffect(() => {
		if (profile.id === "0" || duration.length === 0) {
			return;
		}
		fetchAvailabilities();
	}, [
		profile.id,
		duration.length,
		intervalDateParams.after,
		intervalDateParams.before,
	]);

	return (
		<AppLayout
			title={`${profile.displayName} | FYP.Fans`}
			description={profile.bio}
		>
			<FansView flex="1" position="relative">
				<ScrollView style={tw.style("flex-1")} ref={scrollRef}>
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
									onClickLeft={handleGoBack}
								/>
								<FansView
									style={tw.style(
										"md:pt-10 mb-[26px] md:mb-8",
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
											<FypNullableView
												visible={!!profile.displayName}
											>
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
												</FansView>
											</FypNullableView>

											<FypText
												fontSize={16}
												lineHeight={21}
												style={tw.style(
													"mb-3 text-center md:text-left",
												)}
												numberOfLines={2}
											>
												{settings?.meetingDescription}
											</FypText>
											<FansView
												flexDirection="row"
												alignItems="center"
												gap={32}
											>
												{featureGates.has(
													"2024_01-available-text-in-video-call-page",
												) ? (
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
												) : null}

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
														{`${formatPrice(
															duration.price,
														)}-${
															duration.length
														} PRICES`}
													</FypText>
												</FansView>
											</FansView>
										</FansView>
									</FansView>
								</FansView>

								<FansView
									style={tw.style("px-[18px] md:px-0 pb-10")}
								>
									<FypNullableView
										visible={
											settings.contentPreferences.length >
												0 ||
											settings.customContentPreferences !==
												""
										}
									>
										<FypText
											fontWeight={600}
											fontSize={17}
											margin={{ b: 15 }}
										>
											Types of video calls offered
										</FypText>
										<FansView
											borderRadius={15}
											padding={{ t: 26, b: 24, x: 20 }}
											style={tw.style(
												"border border-fans-grey dark:border-fans-grey-43",
											)}
										>
											<ContentPreferencesList
												availableOptionIds={
													settings.contentPreferences
												}
											/>
											{settings.customContentPreferences ? (
												<FypText
													fontSize={16}
													margin={{ t: 20 }}
													textAlign="center"
													style={tw.style(
														"text-fans-grey-48 dark:text-fans-grey-b1 italic",
													)}
												>
													{
														settings.customContentPreferences
													}
												</FypText>
											) : null}
										</FansView>
									</FypNullableView>

									<FansGap height={30} />

									<FypText
										fontWeight={600}
										fontSize={19}
										margin={{ b: 10 }}
										onLayout={(e) =>
											setFormPositionY(
												e.nativeEvent.layout.y,
											)
										}
									>
										Make your order
									</FypText>
									<FypText
										fontSize={16}
										margin={{ b: 30 }}
										style={tw.style(
											"text-fans-grey-70 dark:text-fans-grey-b1",
										)}
									>
										Order a video call with me, just pick
										the date and time you prefer. Can't wait
										to meet you!{`\n`}
										We'll have fun!
									</FypText>

									<FansView
										flexDirection="row"
										alignItems="center"
										gap={18}
										justifyContent={
											tw.prefixMatch("md")
												? "start"
												: "between"
										}
										pressableProps={{
											onPress: () =>
												setCollapsedForm(
													!collapsedForm,
												),
										}}
									>
										<FypText
											fontSize={17}
											lineHeight={22}
											fontWeight={600}
										>
											How it works
										</FypText>
										<FansView
											width={12}
											height={6}
											style={{
												transform: [
													{
														rotate: collapsedForm
															? "0deg"
															: "180deg",
													},
												],
											}}
										>
											<FypSvg
												svg={ChevronDownSvg}
												width={12}
												height={6}
												color="fans-grey-48 dark:fans-grey-b1"
											/>
										</FansView>
									</FansView>

									<FypCollapsible collapsed={collapsedForm}>
										<FansGap height={30} />
										<FypNullableView
											visible={
												settings.meetingDurations
													.length > 0
											}
										>
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
												margin={{ b: 36, x: -6 }}
											>
												{settings.meetingDurations.map(
													(el) => (
														<FansView
															key={el.length}
															style={tw.style(
																"w-1/3 md:w-1/4 p-[4px] md:p-2",
															)}
														>
															<CreatorDurationPriceItem
																minutes={
																	el.length
																}
																price={
																	el.price /
																	100
																}
																selected={
																	duration.length ===
																	el.length
																}
																onPress={() =>
																	setDuration(
																		el,
																	)
																}
															/>
														</FansView>
													),
												)}
											</FansView>
										</FypNullableView>

										<FypCollapsible
											collapsed={duration.id === "0"}
										>
											<FansView margin={{ b: 30 }}>
												<FypText
													fontWeight={600}
													fontSize={17}
													margin={{ b: 15 }}
												>
													When
												</FypText>
												<TimeTypeButton
													value={callTimeType}
													onChange={setCallTimeType}
												/>
											</FansView>

											<FypNullableView
												visible={callTimeType === "now"}
											>
												<FansView
													borderRadius={15}
													padding={{
														t: 17,
														b: 19,
														x: 16,
													}}
													alignItems="center"
													justifyContent="center"
													gap={8}
													style={tw.style(
														"bg-fans-purple-light",
													)}
												>
													<FypText
														fontSize={16}
														textAlign="center"
														style={tw.style(
															"text-fans-black-1d max-w-[496px]",
														)}
													>
														<FypSvg
															svg={
																OutlinedInfoSvg
															}
															width={14}
															height={14}
															color="fans-black-1d"
														/>
														{"  "}
														Warning: If you haven't
														communicated with the
														creator that hey are
														available right now, do
														not select this option
													</FypText>
												</FansView>
												<FansGap height={18} />
												<FansView
													flexDirection="row"
													alignItems="center"
													gap={18}
													pressableProps={{
														onPress: () =>
															setIsConfirmed(
																!isConfirmed,
															),
													}}
												>
													<FypCheckbox
														checked={isConfirmed}
														onPress={() => {}}
													/>
													<FypText fontSize={16}>
														The creator confirmed
														their availability
														<FypText
															fontSize={16}
															style={tw.style(
																"text-fans-red",
															)}
														>
															*
														</FypText>
													</FypText>
												</FansView>
												<FansGap height={32} />
											</FypNullableView>

											<ScheduleForm
												collapsed={
													callTimeType === "now"
												}
												formData={scheduleForm}
												onChangeData={
													handleChangeScheduleForm
												}
												intervals={availableIntervals}
											/>

											<FormControl
												label="Describe call topics (optional)"
												value={topics}
												onChangeText={setTopics}
												placeholder="Describe topics for your video call..."
												isTextArea
												maxLength={1000}
											/>
										</FypCollapsible>
									</FypCollapsible>

									<FansGap height={34} />
									<FansDivider />
									<FansGap height={26} />

									<OrderSummary
										creator={profile}
										subtotal={price}
										platformFee={platformFee}
										total={total}
										type="videoCall"
										dateText={moment(
											callTimeType === "now"
												? new Date()
												: scheduleForm.date,
										)
											.format("MMMM DD")
											.toString()}
										timeText={getOrderTimeString()}
									/>

									<FansGap height={16} />
									<FansView
										borderRadius={15}
										padding={{ t: 10, b: 12, x: 16 }}
										alignItems="center"
										justifyContent="center"
										gap={8}
										style={tw.style("bg-fans-purple-light")}
									>
										<FypText
											fontSize={16}
											textAlign="center"
											style={tw.style(
												"text-fans-black-1d max-w-[496px]",
											)}
										>
											<FypSvg
												svg={OutlinedInfoSvg}
												width={14}
												height={14}
												color="fans-black-1d"
											/>
											{"  "}
											{callTimeType === "now"
												? `Call starts in 15minutes if creator accepts. You are only charged after acceptance`
												: "Only charged if accepted"}
										</FypText>
									</FansView>
									<FansGap height={35} />
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

									<FansView margin={{ b: 18 }}>
										<FypLinearGradientView
											height={42}
											colors={[
												"#1D21E5",
												"#A854F5",
												"#D885FF",
											]}
											start={[0, 1]}
											end={[1, 0]}
											borderRadius={42}
										>
											<FypButton2
												textStyle={tw.style(
													"text-fans-white",
												)}
												pressableProps={{
													onPress:
														handleCreateMeeting,
												}}
											>
												Pay ${total}
											</FypButton2>
										</FypLinearGradientView>
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
							<FypLinearGradientView
								height={42}
								colors={["#1D21E5", "#A854F5", "#D885FF"]}
								start={[0, 1]}
								end={[1, 0]}
								borderRadius={42}
							>
								<FypButton2
									textStyle={tw.style("text-fans-white")}
									pressableProps={{
										onPress: handlePressOrderCall,
									}}
								>
									Order 1:1 video call
								</FypButton2>
							</FypLinearGradientView>
							<FansGap height={32} />
							<MoneyGuarantee />
							<FansGap height={40} />
							<ChatWithUsBlock />
							<FansGap height={22} />
							<FansView>
								<FypText
									fontSize={21}
									fontWeight={600}
									lineHeight={28}
								>
									How it works
								</FypText>
								<FansGap height={32} />
								<FansView gap={22}>
									<GuideItem
										subTitle="STEP 1"
										title="Set up your video call"
										text="Begin by selecting your preferred time, date, and duration for the video call with the creator. This step schedules the call and allows us to forward your request to the creator"
										icon={
											<FypSvg
												svg={FilledSettingSvg}
												width={22}
												height={22}
												color="fans-purple"
											/>
										}
									/>
									<GuideItem
										subTitle="STEP 2"
										title="Secure your spot & await confirmation"
										text="Choose your payment method and complete the checkout process. Rest assured, your account will only be charged after the creator approves your video call request. Once you’ve checked out, the creator will either accept or decline your call invitation"
										icon={
											<FypSvg
												svg={FilledShopSvg}
												width={17}
												height={21}
												color="fans-purple"
											/>
										}
									/>
									<GuideItem
										subTitle="STEP 3"
										title="Join your video call"
										text="After acceptance, you’re all set! Simply visit FYP.Fans five minutes before your scheduled call time. You’ll see a large “Join Video Call” button, granting you access to your private call room. Enjoy your call – it’s that simple!"
										icon={
											<FypSvg
												svg={StarCheckSvg}
												width={22}
												height={21}
												color="fans-purple"
											/>
										}
									/>
								</FansView>
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
			<AgeConfirmDialog
				visible={openAgeVerifyModal}
				handleLeave={() => {
					setOpenAgeVerifyModal(false);
					router.back();
				}}
				handleVerify={() => setOpenAgeVerifyModal(false)}
			/>
		</AppLayout>
	);
};

export default OrderVideoCallScreen;
