import { FypStepper, FypText, FypNullableView } from "@components/common/base";
import { FansGap, FansScreen2, FansView } from "@components/controls";
import { defaultVideoCallSettingsData } from "@constants/common";
import { useAppContext, ProfileActionType } from "@context/useAppContext";
import {
	updateVideoCallSettings,
	getVideoCallDurations,
	getVideoCallSettings,
	getVideoCallTimeframes,
	getProfileVideoCallSettings,
} from "@helper/endpoints/videoCalls/apis";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SettingsVideoCallSetupNativeStackParams } from "@usertypes/navigations";
import {
	IVideoDurationForm,
	IVideoCallSetting,
	ITimeframeInterval,
	videoCallSettingProgresses,
} from "@usertypes/types";
import { useNavigation } from "expo-router";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import ContentPreferenceForm from "./contentPreferenceForm";
import NotificationStep from "./notificationStep";
import PricesForm from "./pricesForm";
import StepperButtons from "./stepperButtons";
import TimeframeForm from "./timeframeForm";
import TitleForm from "./titleForm";

const steps = [
	"Prices",
	"Timeframes",
	"ContentPreferences",
	"Title",
	"Notification",
];

const VideoCallSetupScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SettingsVideoCallSetupNativeStackParams>
		>();
	const [currentStep, setCurrentStep] = useState(0);
	const { state, dispatch } = useAppContext();

	const totalSteps = steps.length;

	const [nextDisabled, setNextDisabled] = useState(false);
	const [durations, setDurations] = useState<IVideoDurationForm[]>([]);
	const [timeframes, setTimeframes] = useState<ITimeframeInterval[]>([]);
	const [videoCallSettings, setVideoCallSettings] =
		useState<IVideoCallSetting>(defaultVideoCallSettingsData);
	const [inProgress, setInProgress] = useState(false);

	const handleNextStep = async () => {
		setInProgress(true);
		const resp = await updateVideoCallSettings({
			progress: videoCallSettingProgresses[currentStep + 1],
		});
		setInProgress(false);
		if (resp.ok) {
			setCurrentStep(currentStep + 1);
		} else {
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const handlePrevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleEnableVideoCalls = async () => {
		setInProgress(true);
		const resp = await updateVideoCallSettings({
			videoCallsEnabled: true,
			progress: "Completed",
		});
		if (resp.ok) {
			const respProfile = await getProfileVideoCallSettings({
				id: state.profile.id,
			});
			setInProgress(false);
			if (respProfile.ok) {
				dispatch.setProfile({
					type: ProfileActionType.updateSettings,
					data: {
						video: respProfile.data,
					},
				});
				navigation.navigate("EditVideoCallSetup");
			}
		} else {
			setInProgress(false);
			Toast.show({
				type: "error",
				text1: resp.data.message,
			});
		}
	};

	const fetchVideoCallDurations = async () => {
		const resp = await getVideoCallDurations();
		if (resp.ok) {
			setDurations(resp.data);
		} else {
			setDurations([]);
		}
	};

	const updateDurationsCallback = (value: IVideoDurationForm[]) => {
		setDurations(value);
	};

	const fetchTimeframes = async () => {
		const resp = await getVideoCallTimeframes();
		if (resp.ok) {
			setTimeframes(resp.data);
		}
	};

	const updateTimeframesCallback = (value: ITimeframeInterval[]) => {
		setTimeframes(value);
	};

	const fetchVideoCallSettings = async () => {
		const resp = await getVideoCallSettings();
		if (resp.ok) {
			setVideoCallSettings(resp.data);
		}
	};

	const updateVideoCallSettingsCallback = (value: IVideoCallSetting) => {
		setVideoCallSettings(value);
	};

	useEffect(() => {
		fetchVideoCallDurations();
		fetchTimeframes();
		fetchVideoCallSettings();
	}, []);

	useEffect(() => {
		if (currentStep === 0 && durations.length === 0) {
			setNextDisabled(true);
		} else if (currentStep === 1 && timeframes.length === 0) {
			setNextDisabled(true);
		} else {
			setNextDisabled(false);
		}
	}, [durations, currentStep]);

	return (
		<FansScreen2 contentStyle={{ maxWidth: 670 }}>
			<FansView style={{ marginTop: 20 }}>
				<FypStepper
					currentStep={currentStep}
					steps={steps}
					onSelect={setCurrentStep}
				/>
			</FansView>
			<FansView>
				<FypNullableView visible={steps[currentStep] === "Prices"}>
					<FansView>
						<FansView padding={{ t: 28, b: 42 }}>
							<FypText
								textAlign="center"
								fontSize={27}
								fontWeight={600}
								margin={{ b: 12 }}
							>
								Pricing & duration
							</FypText>
							<FypText textAlign="center" fontSize={16}>
								Set your price for different video durations.
								Higher duration videos should be more expensive
							</FypText>
						</FansView>
						<FansView margin={{ b: 25 }}>
							<FypText
								fontWeight={600}
								fontSize={17}
								margin={{ b: 12 }}
							>
								Prices
							</FypText>
							<FypText color="grey-70" fontSize={16}>
								Create prices for different video call
								durations. Provide up to 10 time options for
								fans to buy
							</FypText>
						</FansView>
						<PricesForm
							durations={durations}
							updateDurationsCallback={updateDurationsCallback}
						/>
						<FansGap height={{ xs: 24, md: 180 }} />
					</FansView>
				</FypNullableView>
				<FypNullableView visible={steps[currentStep] === "Timeframes"}>
					<FansView padding={{ b: 40 }}>
						<FansView margin={{ b: 42 }} padding={{ t: 34 }}>
							<FypText
								textAlign="center"
								fontWeight={600}
								fontSize={27}
								margin={{ b: 12 }}
							>
								Availability
							</FypText>
							<FypText textAlign="center" fontSize={16}>
								Fans or clients will only be able to book
								between the selected range of dates
							</FypText>
						</FansView>
						<TimeframeForm
							timeframes={timeframes}
							videoCallSettings={videoCallSettings}
							fetchTimeframes={fetchTimeframes}
							updateTimeframesCallback={updateTimeframesCallback}
							updateVideoCallSettingsCallback={
								updateVideoCallSettingsCallback
							}
						/>
					</FansView>
				</FypNullableView>
				<FypNullableView
					visible={steps[currentStep] === "ContentPreferences"}
				>
					<FansView padding={{ t: 34, b: 34 }}>
						<FansView margin={{ b: 40 }}>
							<FypText
								textAlign="center"
								fontWeight={600}
								fontSize={27}
								margin={{ b: 12 }}
							>
								Content preferences
							</FypText>
							<FypText textAlign="center" fontSize={16}>
								Select the types of content you are comfortable
								creating. This guides fans in their requests
							</FypText>
						</FansView>
						<ContentPreferenceForm
							videoCallSettings={videoCallSettings}
							updateVideoCallSettingsCallback={
								updateVideoCallSettingsCallback
							}
						/>
					</FansView>
				</FypNullableView>
				<FypNullableView visible={steps[currentStep] === "Title"}>
					<FansView padding={{ y: 34 }}>
						<FypText
							textAlign="center"
							fontFamily="inter-semibold"
							fontSize={27}
							margin={{ b: 12 }}
						>
							Title & description
						</FypText>
						<FypText
							textAlign="center"
							fontSize={16}
							margin={{ b: 42 }}
						>
							Specify the type of video call you will provide, so
							that fans know what to expect
						</FypText>
						<TitleForm
							videoCallSettings={videoCallSettings}
							updateVideoCallSettingsCallback={
								updateVideoCallSettingsCallback
							}
						/>
					</FansView>
				</FypNullableView>
				<FypNullableView
					visible={steps[currentStep] === "Notification"}
				>
					<NotificationStep
						videoCallSettings={videoCallSettings}
						updateVideoCallSettingsCallback={
							updateVideoCallSettingsCallback
						}
					/>
					<FansGap height={40} />
				</FypNullableView>
			</FansView>
			<FansView>
				<StepperButtons
					currentStep={currentStep}
					totalSteps={totalSteps}
					nextDisabled={nextDisabled}
					inProgress={inProgress}
					handlePrevStep={handlePrevStep}
					handleNextStep={handleNextStep}
					handleEnableVideoCalls={handleEnableVideoCalls}
				/>
			</FansView>
			<FansGap height={20} />
		</FansScreen2>
	);
};

export default VideoCallSetupScreen;
